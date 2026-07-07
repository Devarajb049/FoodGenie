const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const DB_URI = "mongodb+srv://dbuser:sLttdrvqPR4Jr5bR@foodapp.skkhvgp.mongodb.net/foodapp?retryWrites=true&w=majority";

const run = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB!");

    const result = await mongoose.connection.db.collection("users").deleteMany({});
    console.log(`Deleted ${result.deletedCount} users from the database.`);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();
