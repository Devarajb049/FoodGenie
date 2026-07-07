const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
console.log("GROQ_API_KEY from config.env:", process.env.GROQ_API_KEY);
console.log("GROQ_API_KEY from process.env:", process.env.GROQ_API_KEY || "NOT_SET");
