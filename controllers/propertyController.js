const propertyService = require("../services/propertyService");

// Expected fields for create/update:
// name, description, address, refNo, location: { longitude, latitude }, features: [], price, images: []

exports.list = async (req, res) => {
  try {
    // console.log("call reached")
    const properties = await propertyService.list();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const property = await propertyService.get(req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFeaturedImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.files.length <= 0 || !req.files) {
      res.status(400).json({ error: "No files found" });
    }

    const response = await propertyService.uploadFeaturedImage(id, req.files);
    res.status(200).json(response.images)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  console.log(req.body)
  try {
    // Enforce exactly 4 images
    if (!req.files || req.files.length !== 4) {
      return res
        .status(400)
        .json({ error: "Exactly 4 images are required as featured images." });
    }
    // Forcefully convert fields to numbers before destructuring
    if (req.body.price !== undefined)
      req.body.price = parseFloat(req.body.price);
    if (req.body.longitude !== undefined)
      req.body.longitude = parseFloat(req.body.longitude);
    if (req.body.latitude !== undefined)
      req.body.latitude = parseFloat(req.body.latitude);
    let {
      name,
      description,
      cleaningfee,
      petsNos,
      petsfee,
      address,
      refNo,
      features,
      price,
      nickname,
      bedrooms,
      bathrooms,
      longitude,
      latitude,
    } = req.body;

    console.log({
      name,
      description,
      cleaningfee,
      petsNos,
      petsfee,
      address,
      refNo,
      features,
      price,
      nickname,
      bedrooms,
      bathrooms,
      longitude,
      latitude,
    })

    // console.log('DEBUG property create req.body:', req.body, 'typeof price:', typeof price);
    if (
      !name ||
      !description ||
      !address ||
      !refNo ||
      longitude === undefined ||
      latitude === undefined ||
      !features ||
      price === undefined ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      nickname === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (isNaN(longitude) || isNaN(latitude)) {
      return res
        .status(400)
        .json({ error: "Longitude and latitude must be numbers" });
    }
    if (!Array.isArray(features)) {
      return res.status(400).json({ error: "Features must be an array" });
    }
    const property = await propertyService.create(req.body, req.files);
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    console.log(req.body);

    req.body.features = JSON.parse(req.body.features);
    // If images are uploaded, enforce exactly 4 images
    if (req.files && req.files.length > 0 && req.files.length !== 4) {
      return res
        .status(400)
        .json({ error: "Exactly 4 images are required as featured images." });
    }

    // Convert fields to numbers if present
    if (req.body.price !== undefined)
      req.body.price = parseFloat(req.body.price);
    if (req.body.longitude !== undefined)
      req.body.longitude = parseFloat(req.body.longitude);
    if (req.body.latitude !== undefined)
      req.body.latitude = parseFloat(req.body.latitude);
    if (req.body.guests !== undefined)
      req.body.guests = parseFloat(req.body.guests);
    // Ensure features is an array if present

    console.log(Array.isArray(req.body.features));
    if (!Array.isArray(req.body.features)) {
      return res.status(400).json({ error: "Features must be an array" });
    }
    console.log(req.body, "9999999999999");
    // If images are uploaded, pass them to the service to replace old images
    const property = await propertyService.update(
      req.params.id,
      req.body,
      req.files
    );
    res.json(property);
  } catch (err) {
    console.log(err, "8888888888888888");
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await propertyService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const property = await propertyService.uploadImage(req.params.id, req.file);
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const property = await propertyService.removeImage(
      req.params.id,
      req.params.imageUrl
    );
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Upload gallery images for a property
exports.uploadPropertyGalleryImages = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const files = req.files;
    let tags = req.body.tags;
    // Support both single and multiple tags
    if (!Array.isArray(tags)) tags = tags ? [tags] : [];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }
    if (tags.length !== files.length) {
      return res
        .status(400)
        .json({ error: "Each image must have a corresponding tag." });
    }
    const allowedTags = ["exterior", "interior", "surroundings"];
    for (const tag of tags) {
      if (!allowedTags.includes(tag)) {
        return res.status(400).json({
          error: `Invalid tag: ${tag}. Allowed: exterior, interior, surroundings.`,
        });
      }
    }
    const images = await propertyService.addPropertyGalleryImages(
      propertyId,
      files,
      tags
    );
    res.status(201).json(images);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get gallery images for a property, optionally filtered by tag
exports.getPropertyGalleryImages = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const tag = req.query.tag;
    const images = await propertyService.getPropertyGalleryImages(
      propertyId,
      tag
    );
    res.json(images);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePropertyGalleryImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    await propertyService.deletePropertyGalleryImage(imageId);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.deletePropertyGalleryImageByUrl = async (req, res) => {
  try {
    const propertyId = req.params.id;
    // Accept url from query or body for flexibility
    const url = req.query.url || req.body.url;
    if (!url) {
      return res.status(400).json({ error: "Image URL is required." });
    }
    const response = await propertyService.deletePropertyGalleryImageByUrl(propertyId, url);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.updatePropertyGalleryImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const { tag } = req.body;
    if (!tag) {
      return res.status(400).json({ error: "Tag is required." });
    }
    const image = await propertyService.updatePropertyGalleryImage(
      imageId,
      tag
    );
    console.log(image, "ppopopoppopop")
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
