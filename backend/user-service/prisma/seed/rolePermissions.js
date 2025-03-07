const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const rolePermissions = {
  SUPER_ADMIN: [
    'MANAGE_USERS',
    'MANAGE_ROLES',
    'MANAGE_PERMISSIONS',
    'INVITE_USERS',
    'MANAGE_SYSTEM_SETTINGS',
  ],
  HR_ADMIN: ['INVITE_USERS', 'VIEW_CANDIDATES', 'OFFER_JOB'],
  RECRUITER_ADMIN: ['INVITE_USERS', 'CREATE_JOBS', 'EDIT_JOBS', 'DELETE_JOBS'],
  TECH_INTERVIEW_ADMIN: ['SCHEDULE_INTERVIEWS', 'CONDUCT_INTERVIEWS'],
  HR: ['VIEW_CANDIDATES', 'OFFER_JOB'],
  RECRUITER: ['CREATE_JOBS', 'EDIT_JOBS', 'DELETE_JOBS', 'VIEW_CANDIDATES'],
  TECH_INTERVIEWER: ['CONDUCT_INTERVIEWS', 'VIEW_INTERVIEW_RESULTS'],
  CANDIDATE: ['ACCEPT_REJECT_OFFER'],
};

async function seedRolePermissions() {
  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });

    if (!role) {
      console.error(`❌ Role not found: ${roleName}`);
      continue;
    }

    for (const permissionName of permissionNames) {
      const permission = await prisma.permission.findUnique({ where: { name: permissionName } });

      if (!permission) {
        console.error(`❌ Permission not found: ${permissionName}`);
        continue;
      }

      const existingMapping = await prisma.rolePermission.findFirst({
        where: { roleId: role.id, permissionId: permission.id },
      });

      if (!existingMapping) {
        await prisma.rolePermission.create({
          data: {
            role: { connect: { id: role.id } },
            permission: { connect: { id: permission.id } },
          },
        });

        console.log(`✅ Assigned ${permissionName} to ${roleName}`);
      } else {
        console.log(`⚠️ ${roleName} already has ${permissionName}`);
      }
    }
  }
}

module.exports = { seedRolePermissions };
