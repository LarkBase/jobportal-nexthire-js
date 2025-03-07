const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const roles = [
  { name: 'SUPER_ADMIN' },
  { name: 'HR_ADMIN' },
  { name: 'RECRUITER_ADMIN' },
  { name: 'TECH_INTERVIEW_ADMIN' },
  { name: 'HR' },
  { name: 'RECRUITER' },
  { name: 'TECH_INTERVIEWER' },
  { name: 'CANDIDATE' },
];

async function seedRoles() {
  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({ where: { name: role.name } });
    if (!existingRole) {
      await prisma.role.create({ data: role });
      console.log(`✅ Created Role: ${role.name}`);
    } else {
      console.log(`⚠️ Role already exists: ${role.name}`);
    }
  }
}

module.exports = { seedRoles };
