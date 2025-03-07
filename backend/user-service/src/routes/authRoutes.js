const express = require("express");
const { login, refreshToken, logout } = require("../controllers/authController");
const {authenticate} =require("../middleware/authMiddleware");
const { loginValidation } = require("../validators/authValidators");
const { loginRateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/login", loginRateLimiter, loginValidation, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate,logout);

module.exports = router;
