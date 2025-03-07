const { PrismaClient } = require('@prisma/client');
const { seedRoles } = require('./roles');
const { seedPermissions } = require('./permissions');
const { seedRolePermissions } = require('./rolePermissions');
const { seedUsers } = require('./users');
const { seedDepartments } = require('./departments');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Database...');

  await seedRoles();
  await seedPermissions();
  await seedRolePermissions(); 
  await seedDepartments();
  await seedUsers();

  console.log('🎉 Seeding Completed Successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error Seeding Database:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
