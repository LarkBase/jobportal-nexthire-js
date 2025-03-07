const bcrypt = require("bcrypt");
const prisma = require("../config/db");
const { generateToken, generateRefreshToken } = require("../utils/jwt");

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { accessToken, refreshToken, user };
};

exports.refreshToken = async (oldRefreshToken) => {
  return await prisma.$transaction(async (prisma) => {
    const storedToken = await prisma.refreshToken.findUnique({ where: { token: oldRefreshToken } });

    if (!storedToken || new Date(storedToken.expiresAt).getTime() < Date.now()) {
      throw new Error("Refresh token expired or invalid");
    }

    const user = await prisma.user.findUnique({ where: { id: storedToken.userId } });

    // ✅ Delete old refresh token BEFORE generating a new one
    await prisma.refreshToken.delete({ where: { token: oldRefreshToken } });

    // ✅ Generate new tokens
    const newAccessToken = generateToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  });
};

exports.logoutAllSessions = async (refreshToken) => {
  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });

  if (storedToken) {
    await prisma.refreshToken.deleteMany({ where: { userId: storedToken.userId } }); // ✅ Deletes all refresh tokens
  }
};
