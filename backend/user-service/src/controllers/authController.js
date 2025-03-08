const authService = require("../services/authService");
const logger = require("../utils/logger");
const { validationResult } = require("express-validator");

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const { accessToken, refreshToken, user } = await authService.login(email, password);

    // ✅ Log successful login
    logger.auth.info(`User ${email} logged in successfully from IP: ${ipAddress}`);
    logger.audit.info(`User ${email} logged in successfully from IP: ${ipAddress}`);

    // ✅ Store tokens securely
    res.cookie("token", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

    return res.status(200).json({ success: true, accessToken, refreshToken, user });
  } catch (error) {
    logger.audit.warn(`Failed login attempt for ${req.body.email} from IP: ${req.ip}`);
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { accessToken, refreshToken } = await authService.refreshToken(oldRefreshToken);

    // ✅ Securely update tokens
    res.cookie("token", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

    return res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (error) {
    logger.audit.warn(`Failed refresh token attempt: ${error.message}`);
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

exports.logout = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const email = req.user?.email || "Unknown User"; 
  
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" }); // ✅ Handle missing refresh token
      }
  
      await authService.logoutAllSessions(refreshToken);
  
      res.clearCookie("token");
      res.clearCookie("refreshToken");
  
      logger.auth.info(`User ${email} logged out from all sessions.`);
      logger.audit.info(`User ${email} logged out from all sessions.`);
  
      return res.status(200).json({ success: true, message: "Logged out from all devices." });
    } catch (error) {
      logger.errorLog.error(`Logout error: ${error.message}`);
      return res.status(500).json({ success: false, message: "Logout failed." });
    }
  };