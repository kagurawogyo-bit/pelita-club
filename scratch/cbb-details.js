const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const data = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB' },
    include: {
      user: {
        select: { role: true }
      }
    }
  });

  // Grouping structure: { period: { column: { SISWA: { '✓': 0, '-': 0 }, PENGURUS: { '✓': 0, '-': 0 } } } }
  const groups = {};

  data.forEach(a => {
    const period = `${a.year}-${a.month}`;
    const column = a.column;
    const role = a.user?.role || 'UNKNOWN';
    const status = a.status;

    if (!groups[period]) groups[period] = {};
    if (!groups[period][column]) groups[period][column] = {
      SISWA: { '✓': 0, '-': 0 },
      PENGURUS: { '✓': 0, '-': 0 },
      UNKNOWN: { '✓': 0, '-': 0 }
    };

    if (!groups[period][column][role]) {
      groups[period][column][role] = { '✓': 0, '-': 0 };
    }

    groups[period][column][role][status] = (groups[period][column][role][status] || 0) + 1;
  });

  // Sort periods and print
  const sortedPeriods = Object.keys(groups).sort();
  for (const period of sortedPeriods) {
    console.log(`\n================ PERIOD: ${period} ================`);
    const cols = Object.keys(groups[period]).sort((a,b) => {
      const numA = parseInt(a.replace('CBB-', '')) || 0;
      const numB = parseInt(b.replace('CBB-', '')) || 0;
      return numA - numB;
    });

    cols.forEach(col => {
      const g = groups[period][col];
      console.log(`Column ${col}:`);
      console.log(`  Students (SISWA)   - Present (✓): ${g.SISWA['✓']}, Absent (-): ${g.SISWA['-']}`);
      console.log(`  Coaches (PENGURUS) - Present (✓): ${g.PENGURUS['✓']}, Absent (-): ${g.PENGURUS['-']}`);
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
