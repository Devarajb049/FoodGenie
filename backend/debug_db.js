const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const DB_URI = "mongodb+srv://dbuser:sLttdrvqPR4Jr5bR@foodapp.skkhvgp.mongodb.net/foodapp?retryWrites=true&w=majority";

const run = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB Atlas!");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Check count of restaurants
    const countRes = await mongoose.connection.db.collection("restaurants").countDocuments();
    console.log("Restaurant count:", countRes);

    // Check one restaurant
    const oneRes = await mongoose.connection.db.collection("restaurants").findOne();
    console.log("Sample Restaurant:", oneRes);

    // Check count of menus
    const countMenus = await mongoose.connection.db.collection("menus").countDocuments();
    console.log("Menus count:", countMenus);

    // Check one menu
    const oneMenu = await mongoose.connection.db.collection("menus").findOne();
    console.log("Sample Menu:", oneMenu);

    // Check count of food items
    const countFood = await mongoose.connection.db.collection("fooditems").countDocuments();
    console.log("FoodItem count:", countFood);

    // Check one food item
    const oneFood = await mongoose.connection.db.collection("fooditems").findOne();
    console.log("Sample FoodItem:", oneFood);

    // Let's specifically query menu for store 66717b16e1a78e67dc8c8df3
    const targetStoreId = new mongoose.Types.ObjectId("66717b16e1a78e67dc8c8df3");
    const targetMenu = await mongoose.connection.db.collection("menus").findOne({ restaurant: targetStoreId });
    console.log("Menu for store 66717b16e1a78e67dc8c8df3 (ObjectId):", targetMenu);

    const targetMenuStr = await mongoose.connection.db.collection("menus").findOne({ restaurant: "66717b16e1a78e67dc8c8df3" });
    console.log("Menu for store 66717b16e1a78e67dc8c8df3 (String):", targetMenuStr);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();

