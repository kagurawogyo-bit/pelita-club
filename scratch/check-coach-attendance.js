const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attendances = await prisma.gridAttendance.findMany({
    where: {
      year: 2026,
      month: {
        in: [0, 1, 2, 3, 4, 5] // Jan to Jun
      },
      user: {
        role: 'PELATIH'
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

  console.log(`Found ${attendances.length} attendance records for coaches from Jan to Jun 2026.`);
  
  if (attendances.length > 0) {
    const summary = attendances.reduce((acc, curr) => {
      const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][curr.month];
      if (!acc[monthName]) acc[monthName] = 0;
      acc[monthName]++;
      return acc;
    }, {});
    console.log("Records per month:", summary);
    
    // show a few sample records
    console.log("Sample records:");
    console.log(attendances.slice(0, 5).map(a => ({
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
