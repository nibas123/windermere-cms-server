const prisma = require("../api/prisma");
const path = require("path");
const cloudinary = require("../services/cloudinary");

exports.list = async () => {
  return prisma.property.findMany({ include: { bookings: true } });
};

exports.get = async (id) => {
  return prisma.property.findUnique({
    where: { id },
    include: { bookings: true },
  });
};

exports.create = async (data, files) => {
  console.log(data);
  let {
    name,
    description,
    address,
    refNo,
    features,
    price,
    longitude,
    latitude,
    guests,
    size,
    rooms,
  } = data;
  price = parseFloat(price);
  guests = parseInt(guests);

  let images = [];
  for (let i = 0; i < files.length; i++) {
    const result = await cloudinary.uploader.upload(files[i].path);
    images.push(result.secure_url);
  }

  const property = await prisma.property.create({
    data: {
      name,
      description,
      address,
      refNo,
      longitude,
      latitude,
      features,
      price,
      images,
      guests,
      size,
      rooms,
    },
    include: { bookings: true },
  });
  return property;
};

exports.update = async (id, data, files) => {
  console.log(id, "poop");
  let {
    name,
    description,
    address,
    refNo,
    features,
    status,
    size,
    guests,
    rooms,
    price,
    longitude,
    latitude,
  } = data;
  price = price !== undefined ? parseFloat(price) : undefined;
  let updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (address !== undefined) updateData.address = address;
  if (refNo !== undefined) updateData.refNo = refNo;
  if (longitude !== undefined) updateData.longitude = longitude;
  if (latitude !== undefined) updateData.latitude = latitude;
  if (features !== undefined) updateData.features = features;
  if (price !== undefined) updateData.price = price;
  if (status !== undefined) updateData.status = status;
  if (size !== undefined) updateData.size = size;
  if (guests !== undefined) updateData.guests = guests;
  if (rooms !== undefined) updateData.rooms = rooms;
  // If files are provided, replace images
  if (files && files.length > 0) {
    updateData.images = files.map((f) => `/uploads/${f.filename}`);
  }
  const property = await prisma.property.update({
    where: { id },
    data: updateData,
    include: { bookings: true },
  });
  return property;
};

exports.remove = async (id) => {
  console.log(`Starting deletion of property ${id}`);

  try {
    // Check if property exists first
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw new Error("Property not found");
    }
    console.log("Property found:", property.name);

    // Delete related data in the correct order (child records first)
    console.log("Deleting payments...");
    await prisma.payment.deleteMany({
      where: {
        booking: {
          propertyId: id,
        },
      },
    });

    console.log("Deleting bookings...");
    await prisma.booking.deleteMany({
      where: { propertyId: id },
    });

    console.log("Deleting gallery images...");
    await prisma.propertyGalleryImage.deleteMany({
      where: { propertyId: id },
    });

    console.log("Deleting comments...");
    await prisma.comment.deleteMany({
      where: { propertyId: id },
    });

    console.log("Deleting enquiry bookings...");
    await prisma.enquiryBooking.deleteMany({
      where: { propertyId: id },
    });

    console.log("Deleting property...");
    const deletedProperty = await prisma.property.delete({
      where: { id },
    });

    console.log("Property deleted successfully:", deletedProperty.name);
    return deletedProperty;
  } catch (error) {
    console.error("Property deletion error:", error);
    throw error;
  }
};

exports.uploadFeaturedImage = async (propertyId, files) => {
  try {
    const response = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    const { images, updatedAt } = response;

    let imgUrl = [...images];

    for (let i = 0; i < files.length; i++) {
      const result = await cloudinary.uploader.upload(files[i].path);
      imgUrl.push(result.secure_url);
    }

    const updatedResponse = await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        images: imgUrl,
      },
    });

    return updatedResponse;
  } catch (err) {
    throw err;
  }
};

exports.uploadImage = async (propertyId, file) => {
  if (!file) throw new Error("No file uploaded");
  const url = `/uploads/${file.filename}`;
  const property = await prisma.property.update({
    where: { id: propertyId },
    data: {
      images: { push: url },
    },
    include: { bookings: true },
  });
  return property;
};

exports.removeImage = async (propertyId, imageUrl) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) throw new Error("Property not found");
  const newImages = property.images.filter((img) => img !== imageUrl);
  return prisma.property.update({
    where: { id: propertyId },
    data: { images: newImages },
    include: { bookings: true },
  });
};

// Add gallery images to a property
exports.addPropertyGalleryImages = async (propertyId, files, tags) => {
  try {
    const insertData = [];

    for (let i = 0; i < files.length; i++) {
      // const file = files[i];
      const tag = tags[i];
      const result = await cloudinary.uploader.upload(files[i].path);
      const data = { tag, url: result.secure_url, propertyId };
      insertData.push(data);
    }

    const response = await prisma.propertyGalleryImage.createManyAndReturn({
      data: insertData,
    });

    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get gallery images for a property, optionally filtered by tag
exports.getPropertyGalleryImages = async (propertyId, tag) => {
  const where = { propertyId };
  if (tag) where.tag = tag;
  return prisma.propertyGalleryImage.findMany({ where });
};

exports.deletePropertyGalleryImage = async (imageId) => {
  return prisma.propertyGalleryImage.delete({ where: { id: imageId } });
};

exports.updatePropertyGalleryImage = async (imageId, tag) => {
  const allowedTags = ["exterior", "interior", "surroundings"];
  if (!allowedTags.includes(tag)) {
    throw new Error(
      `Invalid tag: ${tag}. Allowed: exterior, interior, surroundings.`
    );
  }
  return prisma.propertyGalleryImage.update({
    where: { id: imageId },
    data: { tag },
  });
};

exports.deletePropertyGalleryImageByUrl = async (propertyId, url) => {
  const property = await prisma.property.findFirst({
    where: { id: propertyId },
  });
  if (!property) throw new Error("Property not found.");

  if(property.images.length === 1){
    throw new Error("Atleast one image is needed")
  }

  const index = property.images.indexOf(url);

  if (index !== -1) {
    property.images.splice(index, 1); // Removes 1 element starting from 'index'
    return prisma.property.update({
      where: { id: propertyId },
      data: {
        images: property.images,
      },
    });
  }

  if (!image) throw new Error("Image not found for this property.");
};
