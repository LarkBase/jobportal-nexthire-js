const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const users = [
  { email: 'admin@nexthire.tech', role: 'SUPER_ADMIN' },
  { email: 'hr_admin@nexthire.tech', role: 'HR_ADMIN' },
  { email: 'recruiter_admin@nexthire.tech', role: 'RECRUITER_ADMIN' },
  { email: 'tech_admin@nexthire.tech', role: 'TECH_INTERVIEW_ADMIN' },
  { email: 'hr@nexthire.tech', role: 'HR' },
  { email: 'recruiter@nexthire.tech', role: 'RECRUITER' },
  { email: 'interviewer@nexthire.tech', role: 'TECH_INTERVIEWER' },
  { email: 'candidate1@nexthire.tech', role: 'CANDIDATE' },
];

async function seedUsers() {
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const role = await prisma.role.findUnique({ where: { name: user.role } });

      if (!role) {
        console.error(`❌ Role not found for user: ${user.email}`);
        continue;
      }

      await prisma.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          role: { connect: { id: role.id } },
        },
      });

      console.log(`✅ Created User: ${user.email} with role ${user.role}`);
    } else {
      console.log(`⚠️ User already exists: ${user.email}`);
    }
  }
}

module.exports = { seedUsers };
