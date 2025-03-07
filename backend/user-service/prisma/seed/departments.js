const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const departments = [
  { name: 'HR' },
  { name: 'Recruitment' },
  { name: 'Tech Interviews' },
  { name: 'Senior Management' }, 
  { name: 'Candidate'}, 
];

async function seedDepartments() {
  for (const dept of departments) {
    const existingDept = await prisma.department.findUnique({ where: { name: dept.name } });
    if (!existingDept) {
      await prisma.department.create({ data: dept });
      console.log(`✅ Created Department: ${dept.name}`);
    } else {
      console.log(`⚠️ Department already exists: ${dept.name}`);
    }
  }
}

module.exports = { seedDepartments };
