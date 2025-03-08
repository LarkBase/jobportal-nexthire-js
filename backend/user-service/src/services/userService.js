const prisma = require("../config/db");
const bcrypt = require("bcrypt");


exports.getUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, email: true, roleId: true, departmentId: true,createdAt: true },
  });
};

  
exports.getUserById = async (id) => {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, roleId: true, departmentId: true, createdAt: true },
    });
};
  
exports.createUser = async (userData) => {
    const { email, password, roleId, departmentId } = userData;
  
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("Email already in use");
  
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId,
        departmentId,
      },
    });
};
  
exports.updateUser = async (id, userData) => {
    const { email, password, roleId, departmentId } = userData;
  
    let updatedData = { email, roleId, departmentId };
  
    // If updating password, hash it
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
  
    return await prisma.user.update({
      where: { id },
      data: updatedData,
    });
};
  
  exports.deleteUser = async (id) => {
    return await prisma.user.delete({ where: { id } });
};