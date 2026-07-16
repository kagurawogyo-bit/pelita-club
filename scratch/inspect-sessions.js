const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.attendanceSession.findMany({
    where: { eventType: 'CBB' },
    orderBy: [
      { year: 'asc' },
      { month: 'asc' },
      { column: 'asc' }
    ]
  });

  console.log(`Found ${sessions.length} CBB sessions:`);
  sessions.forEach(s => {
    console.log(`Session ID: ${s.id}`);
    console.log(`  Coach ID: ${s.coachId}`);
    console.log(`  Coach IDs: ${s.coachIds}`);
    console.log(`  Column: ${s.column}`);
    console.log(`  Period: Month ${s.month}, Year ${s.year}`);
    console.log(`  Active: ${s.isActive}`);
    console.log(`  Created At: ${s.createdAt}`);
    console.log(`  Expires At: ${s.expiresAt}`);
    console.log('----------------------------------------');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
