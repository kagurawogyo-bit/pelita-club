const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Month 0-indexed: month=5 = Juni, month=6 = Juli
  // Pertemuan terakhir: 29 Juni = month=5

  console.log('=== SEMUA DATA CBB JUNI (month=5) ===');
  const juneData = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB', month: 5, year: 2026 },
    include: {
      user: {
        select: { role: true, profile: { select: { namaLengkap: true } } }
      }
    },
    orderBy: [{ column: 'asc' }, { updatedAt: 'asc' }]
  });

  // Group by column
  const byCol = {};
  juneData.forEach(r => {
    if (!byCol[r.column]) byCol[r.column] = { siswa: [], pelatih: [] };
    const nama = r.user?.profile?.namaLengkap || 'N/A';
    const role = r.user?.role;
    const status = r.status;
    if (role === 'SISWA') byCol[r.column].siswa.push({ nama, status });
    else byCol[r.column].pelatih.push({ nama, status });
  });

  const sortedCols = Object.keys(byCol).sort((a, b) => {
    return parseInt(a.replace('CBB-', '')) - parseInt(b.replace('CBB-', ''));
  });

  for (const col of sortedCols) {
    const d = byCol[col];
    const siswaHadir = d.siswa.filter(s => s.status === '✓').length;
    const pelatihHadir = d.pelatih.filter(p => p.status === '✓').length;
    console.log(`\n${col}: ${siswaHadir} siswa hadir, ${pelatihHadir} pelatih hadir`);
    console.log('  Siswa:', d.siswa.filter(s => s.status === '✓').map(s => s.nama).join(', ') || '-');
    console.log('  Pelatih:', d.pelatih.filter(p => p.status === '✓').map(p => p.nama).join(', ') || '-');
  }

  console.log('\n=== DATA CBB JULI (month=6) ===');
  const julyData = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB', month: 6, year: 2026 },
    include: {
      user: {
        select: { role: true, profile: { select: { namaLengkap: true } } }
      }
    },
    orderBy: [{ column: 'asc' }]
  });

  const byColJuly = {};
  julyData.forEach(r => {
    if (!byColJuly[r.column]) byColJuly[r.column] = { siswa: [], pelatih: [] };
    const nama = r.user?.profile?.namaLengkap || 'N/A';
    const role = r.user?.role;
    if (role === 'SISWA') byColJuly[r.column].siswa.push(nama);
    else byColJuly[r.column].pelatih.push(nama);
  });

  Object.keys(byColJuly).sort().forEach(col => {
    const d = byColJuly[col];
    console.log(`\n${col}: ${d.siswa.length} siswa hadir, ${d.pelatih.length} pelatih hadir`);
    console.log('  Siswa:', d.siswa.join(', ') || '-');
    console.log('  Pelatih:', d.pelatih.join(', ') || '-');
  });

  console.log('\n\n=== SUMMARY ===');
  console.log(`Juni (month=5): ${juneData.length} total record, CBB-1 s/d CBB-14`);
  console.log(`Juli (month=6): ${julyData.length} total record, ${[...new Set(julyData.map(r=>r.column))].join(', ')}`);
  console.log('\n⚠️  Dashboard saat ini menampilkan Juli (month=6) karena ini bulan berjalan.');
  console.log('⚠️  Data CBB Juni masih ada di database - hanya perlu ganti filter ke bulan Juni di dashboard.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
