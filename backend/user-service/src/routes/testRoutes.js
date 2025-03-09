const express = require("express");
const { generateMCQs } = require("../controllers/testController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate-mcqs", authenticate, generateMCQs);

module.exports = router;
