const jwt = require("jsonwebtoken");
const ENV = require("../config/env");

exports.authenticate = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
  