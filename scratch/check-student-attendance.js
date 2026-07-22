const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attendances = await prisma.gridAttendance.findMany({
    where: {
      user: {
        role: 'SISWA'
      },
      year: 2026,
      month: {
        in: [0, 1, 2, 3, 4, 5]
      }
    }
  });

  console.log(`Found ${attendances.length} student attendance records for Jan-Jun 2026.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
