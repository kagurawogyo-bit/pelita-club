const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attendances = await prisma.gridAttendance.findMany({
    where: {
      user: {
        role: 'PENGURUS'
      }
    },
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  });

  console.log(`Found ${attendances.length} TOTAL attendance records for PENGURUS (Coaches).`);
  
  if (attendances.length > 0) {
    const summary = attendances.reduce((acc, curr) => {
      const key = `${curr.year}-${curr.month}`;
      if (!acc[key]) acc[key] = 0;
      acc[key]++;
      return acc;
    }, {});
    console.log("Records per year-month:", summary);
    
    // Show data for May (4) and June (5) 2026
    const mayJune2026 = attendances.filter(a => a.year === 2026 && (a.month === 4 || a.month === 5));
    console.log(`\nFound ${mayJune2026.length} records for May-Jun 2026:`);
    console.log(mayJune2026.slice(0, 5).map(a => ({
        coach: a.user.profile ? a.user.profile.namaLengkap : a.userId,
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
