const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const gridAttendances = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB' },
    include: {
      user: {
        select: {
          role: true,
          email: true,
          profile: {
            select: { namaLengkap: true }
          }
        }
      }
    }
  });

  console.log(`Total GridAttendance (CBB): ${gridAttendances.length}`);

  // Group by month, year
  const periodGroups = {};
  // Group by status
  const statusGroups = {};
  // Group by role
  const roleGroups = {};
  // Group by column
  const columnGroups = {};

  for (const a of gridAttendances) {
    const periodKey = `${a.year}-${a.month}`;
    periodGroups[periodKey] = (periodGroups[periodKey] || 0) + 1;
    statusGroups[a.status] = (statusGroups[a.status] || 0) + 1;
    const role = a.user ? a.user.role : 'UNKNOWN';
    roleGroups[role] = (roleGroups[role] || 0) + 1;
    columnGroups[a.column] = (columnGroups[a.column] || 0) + 1;
  }

  console.log('\n--- Grouped by Period (Year-Month) ---');
  console.log(periodGroups);

  console.log('\n--- Grouped by Status ---');
  console.log(statusGroups);

  console.log('\n--- Grouped by Role ---');
  console.log(roleGroups);

  console.log('\n--- Grouped by Column ---');
  const sortedColumns = Object.keys(columnGroups).sort((a,b) => {
    const numA = parseInt(a.replace('CBB-', '')) || 0;
    const numB = parseInt(b.replace('CBB-', '')) || 0;
    return numA - numB;
  });
  const sortedColumnGroups = {};
  sortedColumns.forEach(c => sortedColumnGroups[c] = columnGroups[c]);
  console.log(sortedColumnGroups);

  // Check recent updates
  const recent = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB' },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: { user: { include: { profile: true } } }
  });
  console.log('\n--- 5 Most Recently Updated CBB Records ---');
  recent.forEach(r => {
    console.log(`ID: ${r.id}, User: ${r.user?.profile?.namaLengkap || r.user?.email}, Column: ${r.column}, Status: ${r.status}, UpdatedAt: ${r.updatedAt}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
