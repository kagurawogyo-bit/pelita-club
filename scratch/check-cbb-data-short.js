const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const gridCount = await prisma.gridAttendance.count({
    where: { eventType: 'CBB' }
  });
  const sessionCount = await prisma.attendanceSession.count({
    where: { eventType: 'CBB' }
  });
  console.log('--- CBB Count ---');
  console.log('GridAttendance (CBB):', gridCount);
  console.log('AttendanceSession (CBB):', sessionCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());
