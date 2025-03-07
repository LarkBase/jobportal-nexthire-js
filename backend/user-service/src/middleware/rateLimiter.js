const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");
const ENV = require("../config/env");

// ✅ Rate Limiting Configuration
const loginRateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW, // 15 minutes
  max: ENV.RATE_LIMIT_MAX,
  message: "Too many failed login attempts. Please try again later.",
  handler: (req, res) => {
    logger.audit.warn(`⚠️ Too many failed login attempts from IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Too many failed login attempts. Please try again later.",
    });
  },
  standardHeaders: true, // Send rate limit info in headers
  legacyHeaders: false, // Disable legacy X-RateLimit headers
});

module.exports = { loginRateLimiter };
