const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cek semua kolom CBB yang ADA di GridAttendance, per periode
  const gridRecords = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB' }
  });

  // Temukan kolom unik yang sudah ada
  const columnsExist = new Set(gridRecords.map(r => r.column));
  const sortedCols = [...columnsExist].sort((a, b) => {
    const numA = parseInt(a.replace('CBB-', '')) || 0;
    const numB = parseInt(b.replace('CBB-', '')) || 0;
    return numA - numB;
  });

  console.log('=== KOLOM CBB YANG ADA DI DATABASE ===');
  console.log(sortedCols);

  // Cek semua kolom CBB 1-20 mana yg belum ada
  const allCols = Array.from({ length: 20 }, (_, i) => `CBB-${i + 1}`);
  const missingCols = allCols.filter(c => !columnsExist.has(c));
  console.log('\n=== KOLOM CBB-1 s/d CBB-20 YANG BELUM ADA DI DATABASE ===');
  console.log(missingCols.length > 0 ? missingCols : 'Semua ada');

  // Per periode, tampilkan siapa saja yang hadir per kolom
  console.log('\n=== JUMLAH SISWA & PELATIH PER KOLOM (Bulan Mei 2026) ===');
  const mayData = gridRecords.filter(r => r.year === 2026 && r.month === 5 && r.status === '✓');
  const mayByCols = {};
  
  // Get all users
  const users = await prisma.user.findMany({ select: { id: true, role: true } });
  const userRoles = {};
  users.forEach(u => userRoles[u.id] = u.role);

  mayData.forEach(r => {
    if (!mayByCols[r.column]) mayByCols[r.column] = { SISWA: 0, PENGURUS: 0 };
    const role = userRoles[r.userId] || 'UNKNOWN';
    if (role === 'SISWA') mayByCols[r.column].SISWA++;
    else if (role === 'PENGURUS') mayByCols[r.column].PENGURUS++;
  });

  const sortedMayCols = Object.keys(mayByCols).sort((a, b) => {
    return parseInt(a.replace('CBB-', '')) - parseInt(b.replace('CBB-', ''));
  });

  sortedMayCols.forEach(col => {
    const d = mayByCols[col];
    console.log(`${col}: ${d.SISWA} Siswa, ${d.PENGURUS} Pelatih`);
  });

  // Apakah ada bulan Juli?
  const juliData = gridRecords.filter(r => r.year === 2026 && r.month === 6);
  console.log(`\n=== DATA JULI 2026 (Month=6) ===`);
  console.log(`Total record: ${juliData.length}`);
  const juliCols = new Set(juliData.map(r => r.column));
  console.log(`Kolom yang ada di Juli:`, [...juliCols].sort());
}

main().catch(console.error).finally(() => prisma.$disconnect());
