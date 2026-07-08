const mongoose = require("mongoose");

const connectDatabase = async () => {
  if (!process.env.DB_URI) {
    console.warn("MongoDB Connection Skipped: DB_URI environment variable is not defined.");
    return;
  }
  try {
    const con = await mongoose.connect(process.env.DB_URI);

    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
};

module.exports = connectDatabase;