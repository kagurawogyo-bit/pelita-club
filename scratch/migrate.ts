import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting migration of SMP_SMA to SMP and SMA...");

  // Fetch all records where column ends with _SMP_SMA
  // Since user said May-July, month is 4 (May), 5 (June), 6 (July)
  const targetMonths = [4, 5, 6];

  for (const month of targetMonths) {
    console.log(`\nProcessing month: ${month}`);
    
    const records = await prisma.gridAttendance.findMany({
      where: {
        month: month,
        column: {
          endsWith: "_SMP_SMA"
        }
      }
    });

    console.log(`Found ${records.length} records for month ${month}.`);

    let updatedCount = 0;

    for (const record of records) {
      const baseColumn = record.column.replace("_SMP_SMA", "");
      const colSmp = `${baseColumn}_SMP`;
      const colSma = `${baseColumn}_SMA`;

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

      // Upsert SMA
      await prisma.gridAttendance.upsert({
        where: {
          userId_month_year_column_eventType: {
            userId: record.userId,
            month: record.month,
            year: record.year,
            column: colSma,
            eventType: record.eventType
          }
        },
        update: { status: record.status },
        create: {
          userId: record.userId,
          month: record.month,
          year: record.year,
          column: colSma,
          status: record.status,
          eventType: record.eventType
        }
      });

      updatedCount++;
    }
    
    console.log(`Migrated ${updatedCount} records for month ${month}.`);
  }

  console.log("\nMigration completed.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
