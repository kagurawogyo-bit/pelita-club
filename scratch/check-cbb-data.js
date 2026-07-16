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

  // Check sample GridAttendance with eventType: 'CBB'
  const sampleGrid = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB' },
    take: 5,
    include: { user: { include: { profile: true } } }
  });
  console.log('\n--- Sample Grid CBB ---');
  console.log(JSON.stringify(sampleGrid, null, 2));

  // Check sample AttendanceSession with eventType: 'CBB'
  const sampleSession = await prisma.attendanceSession.findMany({
    where: { eventType: 'CBB' },
    take: 5
  });
  console.log('\n--- Sample Sessions CBB ---');
  console.log(JSON.stringify(sampleSession, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
