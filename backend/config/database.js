const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_URI);

    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDatabase;