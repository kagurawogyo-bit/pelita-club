const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attendances = await prisma.gridAttendance.findMany({
    where: {
      user: {
        role: 'PENGURUS'
      },
      year: 2026,
      month: {
        in: [3, 4, 5] // April, May, June
      }
    },
    include: {
      user: {
        select: {
          profile: true
        }
      }
    }
  });

  console.log(`Found ${attendances.length} records for Apr-Jun.`);
  
  if (attendances.length > 0) {
    const columns = new Set();
    attendances.forEach(a => columns.add(a.column));
    console.log("Unique columns found in DB for coaches:", Array.from(columns));
    
    console.log("\nSample records:");
    console.log(attendances.slice(0, 10).map(a => ({
        month: a.month,
        column: a.column,
        status: a.status
    })));
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
