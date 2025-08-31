const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lodge data from windermere-lodges/data/lodges.ts
const lodgesData = [
  {
    name: 'Glenridding Lodge',
    address: 'Grasmere 2, White Cross Bay near Windermere, Cumbria & The Lake District (Ref. 1068867)',
    description: 'Our modern lodge offers you all the comforts you need and the perfect base for your Lake District Holiday. Situated just a 1 minute walk to the main facilities and 3 minute walk to the lake, you\'re perfectly placed to enjoy everything White Cross Bay has to offer. Our large decking area and comfortable seating area offers the perfect rest spot after a day of walking - west facing for late sunshine too! We also provide 2 parking spaces too - ideal for 2 x couples or those travelling separately.',
    refNo: '1068867',
    longitude: -2.9244,
    latitude: 54.3781,
    features: [
      'Lake Access',
      'Wifi', 
      'Shared Pool',
      'Washing Machine',
      'Hair Dryer',
      'Kitchen',
      'TV',
      'Air Conditioning',
      'Heating',
      'Cable TV',
      'Parquet',
      'Balcony',
      'Parking'
    ],
    price: 149,
    status: 'active',
    images: [
      '/Glenridding/1.jpeg',
      '/Glenridding/2.jpeg',
      '/Glenridding/3.jpeg',
      '/Glenridding/4.jpeg'
    ]
  },
  {
    name: "Water's Reach",
    address: 'White Cross Bay Holiday Park near Troutbeck Bridge, Cumbria & The Lake District (Ref. 1172323)',
    description: "Troutbeck Bridge 0.4 miles.Water's Reach is a delightful lodge located near the tranquil shores of Windermere in Cumbria.It offers off-road parking for two vehicles and is pet-friendly, accommodating two well-mannered pets.This charming retreat is ideal for families or groups of friends looking for a peaceful getaway amidst the breathtaking landscapes of the Lake District.Upon entering this single-storey residence, guests are welcomed by a spacious open-plan living area, featuring a Smart TV and a toasty electric fire, perfect for intimate evenings indoors.The designated cook will appreciate the well-appointed kitchen, which includes an electric oven, gas hob, microwave, and a convenient dishwasher to facilitate clean up.Additionally, a wine chiller and a fridge/freezer are available for storing your favourite drinks and fresh ingredients.When it's time to enjoy a meal, gather around the dining table that comfortably seats six, and savour a hearty dinner while planning the next day's excursions.As the day winds down, retreat to one of the three inviting bedrooms: a king-size room with an en-suite bathroom featuring a basin and WC, along with two twin rooms, all ensuring a restful night's sleep.In the morning, refresh yourself in the modern shower room, equipped with a walk-in shower, basin, and WC.Step outside to the rear patio and decking area, where you can sip your morning coffee or enjoy an evening drink, enveloped by the soothing sounds of nature.The outdoor furniture provides a lovely spot to unwind and absorb the peaceful ambiance of this charming retreat.Take advantage of your excellent location and explore the National Trust - Wray's impressive array of native flora and fauna.Adventure enthusiasts will relish a day at Brockhole on Windermere, which offers a variety of thrilling outdoor activities, while those in search of tranquillity may prefer a leisurely stroll to Orrest Head Viewpoint for breathtaking panoramic vistas of the Lake District.Adventurers should not overlook Zip World Windermere, an exhilarating experience designed for those seeking thrills.Enhance your understanding of local history by visiting Kendal Museum, the Quaker Tapestry Museum, or the Lakeland Museum, each offering intriguing exhibits.A visit to the impressive Lancaster Castle is highly advisable, as its 1000-year-old history is sure to enchant any guest.Proceed to Williamson Park to enjoy the stunning vistas extending to Morecambe Bay, and conclude your day at the Lancaster City Museum, which explores the city's rich heritage.After a day filled with discovery, retreat to the tranquil haven of Water's Reach, your ideal home away from home in the Lake District.",
    refNo: '1172323',
    longitude: -2.9244,
    latitude: 54.3781,
    features: [
      'Swimming pool',
      'Ground floor accommodation',
      'Ground floor bedroom',
      'Wifi',
      'Kitchen',
      'TV',
      'Parking',
      'Pet friendly',
      'Garden',
      'Decking area'
    ],
    price: 180,
    status: 'active',
    images: [
      '/Waters_Reach/1.jpg',
      '/Waters_Reach/2.jpg',
      '/Waters_Reach/3.jpg',
      '/Waters_Reach/4.jpg'
    ]
  },
  {
    name: 'Serenity',
    address: 'Skiptory Howe 10, White Cross Bay near Windermere, Cumbria & The Lake District (Ref. 1172347)',
    description: 'Serenity is a beautiful lodge offering a peaceful retreat in the heart of the Lake District. This modern property features stunning views and all the amenities you need for a comfortable stay. Perfect for families or couples looking to escape the hustle and bustle of everyday life.',
    refNo: '1172347',
    longitude: -2.9244,
    latitude: 54.3781,
    features: [
      'Lake views',
      'Wifi',
      'Kitchen',
      'TV',
      'Parking',
      'Garden',
      'BBQ area',
      'Walking distance to amenities'
    ],
    price: 165,
    status: 'active',
    images: [
      '/Serenity/1.jpg',
      '/Serenity/2.jpg',
      '/Serenity/3.jpg',
      '/Serenity/4.jpg'
    ]
  }
];

async function migrateLodges() {
  try {
    console.log('Starting lodge migration...');
    
    // Check if lodges already exist
    const existingLodges = await prisma.property.findMany({
      where: {
        name: {
          in: lodgesData.map(lodge => lodge.name)
        }
      }
    });

    if (existingLodges.length > 0) {
      console.log(`Found ${existingLodges.length} existing lodges. Skipping migration.`);
      return;
    }

    // Create lodges
    for (const lodgeData of lodgesData) {
      const lodge = await prisma.property.create({
        data: lodgeData
      });
      console.log(`Created lodge: ${lodge.name} (ID: ${lodge.id})`);
    }

    console.log('Lodge migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateLodges()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateLodges }; 