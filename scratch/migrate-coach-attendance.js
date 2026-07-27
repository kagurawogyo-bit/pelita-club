const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find all attendance records for PENGURUS where column matches M*P* without a suffix
  const oldAttendances = await prisma.gridAttendance.findMany({
    where: {
      user: {
        role: 'PENGURUS'
      },
      eventType: 'REGULAR'
    }
  });

  const toMigrate = oldAttendances.filter(a => {
    // Only migrate M*P* columns that don't have a suffix
    return /^M[1-5]P[1-2]$/.test(a.column);
  });

  console.log(`Found ${toMigrate.length} old coach attendance records to migrate.`);

  let migratedCount = 0;

  for (const record of toMigrate) {
    // We will create/update two new records for _SD and _SMP_SMA
    const colSd = `${record.column}_SD`;
    const colSmp = `${record.column}_SMP_SMA`;

    // Upsert SD
    await prisma.gridAttendance.upsert({
      where: {
        userId_month_year_column_eventType: {
          userId: record.userId,
          month: record.month,
          year: record.year,
          column: colSd,
          eventType: record.eventType
        }
      },
      update: { status: record.status },
      create: {
        userId: record.userId,
        month: record.month,
        year: record.year,
        column: colSd,
        status: record.status,
        eventType: record.eventType
      }
    });

    // Upsert SMP
    await prisma.gridAttendance.upsert({
      where: {
        userId_month_year_column_eventType: {
          userId: record.userId,
          month: record.month,
          year: record.year,
          column: colSmp,
          eventType: record.eventType
        }
      },
      update: { status: record.status },
      create: {
        userId: record.userId,
        month: record.month,
        year: record.year,
        column: colSmp,
        status: record.status,
        eventType: record.eventType
      }
    });

    // Delete the old record
    await prisma.gridAttendance.delete({
      where: {
        id: record.id
      }
    });

    migratedCount++;
  }

  console.log(`Successfully migrated ${migratedCount} records to the new SD/SMP column format.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
