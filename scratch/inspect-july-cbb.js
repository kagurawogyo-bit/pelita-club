const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const data = await prisma.gridAttendance.findMany({
    where: {
      eventType: 'CBB',
      month: 6,
      year: 2026
    },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          profile: { select: { namaLengkap: true } }
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  console.log(`Found ${data.length} records for July 2026:`);
  data.forEach(r => {
    console.log(`ID: ${r.id}`);
    console.log(`  User: ${r.user?.profile?.namaLengkap || r.user?.email} (${r.user?.role})`);
    console.log(`  Column: ${r.column}`);
    console.log(`  Status: ${r.status}`);
    console.log(`  Updated At: ${r.updatedAt}`);
    console.log('----------------------------------------');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
