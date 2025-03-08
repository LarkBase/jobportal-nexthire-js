const jwt = require("jsonwebtoken");
const ENV = require("../config/env");
const prisma = require("../config/db");

exports.authenticate = async(req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      
      // Fetch the user along with their role details
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true }, // Fetch role name using roleId
      });

      if (!user) return res.status(401).json({ message: "Invalid token" });
  
      // Attach user data (including role name) to the request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role?.name, // Store role name instead of roleId
      };
  
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  };
  
exports.roleMiddleware = (roles) => async (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
  