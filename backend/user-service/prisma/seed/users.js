const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const users = [
  { email: 'admin@nexthire.tech', role: 'SUPER_ADMIN', department: 'Senior Management' },
  { email: 'hr_admin@nexthire.tech', role: 'HR_ADMIN', department: 'HR' },
  { email: 'recruiter_admin@nexthire.tech', role: 'RECRUITER_ADMIN', department: 'Recruitment' },
  { email: 'tech_admin@nexthire.tech', role: 'TECH_INTERVIEW_ADMIN', department: 'Tech Interviews' },
  { email: 'hr@nexthire.tech', role: 'HR', department: 'HR' },
  { email: 'recruiter@nexthire.tech', role: 'RECRUITER', department: 'Recruitment' },
  { email: 'interviewer@nexthire.tech', role: 'TECH_INTERVIEWER', department: 'Tech Interviews' },
  { email: 'candidate1@nexthire.tech', role: 'CANDIDATE', department: 'Candidate' },
];

async function seedUsers() {
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const role = await prisma.role.findUnique({ where: { name: user.role } });
      const department = await prisma.department.findUnique({ where: { name: user.department } });

      if (!role) {
        console.error(`❌ Role not found for user: ${user.email}`);
        continue;
      }

      if (!department) {
        console.error(`❌ Department not found for user: ${user.email}`);
        continue;
      }

      await prisma.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          role: { connect: { id: role.id } },
          department: { connect: { id: department.id } },
        },
      });

      console.log(`✅ Created User: ${user.email} with role ${user.role} in ${user.department} Department`);
    } else {
      console.log(`⚠️ User already exists: ${user.email}`);
    }
  }
}

module.exports = { seedUsers };
