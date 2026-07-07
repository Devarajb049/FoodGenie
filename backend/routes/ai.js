const express = require("express");
const router = express.Router();
const {
  generateDescription,
  analyzeReviews,
  chatbot
} = require("../controllers/aiController");

router.post("/generate-description", generateDescription);
router.post("/analyze-reviews", analyzeReviews);
router.post("/chatbot", chatbot);

module.exports = router;
