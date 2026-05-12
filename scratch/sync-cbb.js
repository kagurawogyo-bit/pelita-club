const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sync() {
  const sessions = await prisma.attendanceSession.findMany({
    where: { eventType: 'CBB' }
  });

  console.log(`Found ${sessions.length} CBB sessions`);
  let updated = 0;

  for (const session of sessions) {
    const coachIdsList = session.coachIds ? session.coachIds.split(",") : [session.coachId];
    
    for (const cid of coachIdsList) {
      if (!cid) continue;

      const existing = await prisma.gridAttendance.findUnique({
        where: {
          userId_month_year_column_eventType: {
            userId: cid,
            column: session.column,
            month: session.month,
            year: session.year,
            eventType: 'CBB'
          }
        }
      });

      if (!existing || existing.status !== '✓') {
        await prisma.gridAttendance.upsert({
          where: {
            userId_month_year_column_eventType: {
              userId: cid,
              column: session.column,
              month: session.month,
              year: session.year,
              eventType: 'CBB'
            }
          },
          update: { status: '✓' },
          create: {
            userId: cid,
            column: session.column,
            month: session.month,
            year: session.year,
            status: '✓',
            eventType: 'CBB'
          }
        });
        updated++;
      }
    }
  }

  console.log(`Synced ${updated} coach attendance records`);
}

sync().catch(console.error).finally(() => prisma.$disconnect());
