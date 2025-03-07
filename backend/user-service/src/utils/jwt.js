const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ENV = require("../config/env");
const prisma = require("../config/db");

// ✅ Generate Access Token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.roleId },
    ENV.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// ✅ Generate Refresh Token
const generateRefreshToken = async (user) => {
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  return refreshToken;
};

module.exports = { generateToken, generateRefreshToken };
