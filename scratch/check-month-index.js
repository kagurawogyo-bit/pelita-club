const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Penting: cek bagaimana month disimpan (0-indexed JS atau 1-indexed)
  // Ambil semua distinct month values
  const allRecords = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB' },
    select: { month: true, year: true, updatedAt: true }
  });

  const distinctPeriods = [...new Set(allRecords.map(r => `${r.year}-${r.month}`))].sort();
  console.log('=== NILAI MONTH YANG TERSIMPAN DI DATABASE ===');
  console.log(distinctPeriods);

  // Cek session dates vs month stored
  const sessions = await prisma.attendanceSession.findMany({
    where: { eventType: 'CBB' },
    orderBy: { createdAt: 'asc' },
    take: 5
  });
  
  console.log('\n=== 5 SESI PERTAMA: tanggal buat vs nilai month ===');
  sessions.forEach(s => {
    const created = new Date(s.createdAt);
    const actualMonth = created.getMonth(); // 0-indexed
    const actualMonthNum = created.getMonth() + 1; // 1-indexed
    console.log(`Session: Column=${s.column}, Month stored=${s.month}, CreatedAt=${s.createdAt}`);
    console.log(`  → Bulan sebenarnya: JS month=${actualMonth} (0-idx) / bulan ke-${actualMonthNum} (${created.toLocaleString('id-ID', {month: 'long'})})`);
    console.log(`  → Month stored (${s.month}) = ${s.month === actualMonth ? '0-INDEXED (cocok JS)' : s.month === actualMonthNum ? '1-INDEXED (cocok kalender)' : 'TIDAK COCOK'}`);
  });

  // Cek bulan Juni: month=5 (0-indexed) atau month=6 (1-indexed)?
  console.log('\n=== CEK BULAN JUNI ===');
  const juneZeroIdx = await prisma.gridAttendance.count({ where: { eventType: 'CBB', month: 5, year: 2026 } });
  const juneOneIdx = await prisma.gridAttendance.count({ where: { eventType: 'CBB', month: 6, year: 2026 } });
  console.log(`Count dengan month=5 (Juni 0-indexed): ${juneZeroIdx}`);
  console.log(`Count dengan month=6 (Juni 1-indexed / Juli 0-indexed): ${juneOneIdx}`);

  // Ambil record terbaru di month=5
  const latestMonth5 = await prisma.gridAttendance.findFirst({
    where: { eventType: 'CBB', month: 5, year: 2026 },
    orderBy: { updatedAt: 'desc' }
  });
  if (latestMonth5) {
    console.log(`\nRecord terbaru di month=5: updatedAt=${latestMonth5.updatedAt}, column=${latestMonth5.column}`);
  }

  // Ambil record terbaru di month=6
  const latestMonth6 = await prisma.gridAttendance.findFirst({
    where: { eventType: 'CBB', month: 6, year: 2026 },
    orderBy: { updatedAt: 'desc' }
  });
  if (latestMonth6) {
    console.log(`Record terbaru di month=6: updatedAt=${latestMonth6.updatedAt}, column=${latestMonth6.column}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
