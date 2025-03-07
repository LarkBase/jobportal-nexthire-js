const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const permissions = [
  { name: 'MANAGE_USERS' },
  { name: 'MANAGE_ROLES' },
  { name: 'MANAGE_PERMISSIONS' },
  { name: 'INVITE_USERS' },
  { name: 'CREATE_JOBS' },
  { name: 'EDIT_JOBS' },
  { name: 'DELETE_JOBS' },
  { name: 'VIEW_CANDIDATES' },
  { name: 'SCHEDULE_INTERVIEWS' },
  { name: 'CONDUCT_INTERVIEWS' },
  { name: 'VIEW_INTERVIEW_RESULTS' },
  { name: 'OFFER_JOB' },
  { name: 'ACCEPT_REJECT_OFFER' },
  { name: 'MANAGE_SYSTEM_SETTINGS' },
];

async function seedPermissions() {
  for (const permission of permissions) {
    const existingPermission = await prisma.permission.findUnique({ where: { name: permission.name } });
    if (!existingPermission) {
      await prisma.permission.create({ data: permission });
      console.log(`✅ Created Permission: ${permission.name}`);
    } else {
      console.log(`⚠️ Permission already exists: ${permission.name}`);
    }
  }
}

module.exports = { seedPermissions };
