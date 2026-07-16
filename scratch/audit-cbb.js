const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Ambil semua sesi CBB
  const sessions = await prisma.attendanceSession.findMany({
    where: { eventType: 'CBB' },
    orderBy: [{ year: 'asc' }, { month: 'asc' }, { createdAt: 'asc' }]
  });

  console.log(`\n=== AUDIT DATA CBB ===`);
  console.log(`Total AttendanceSession CBB: ${sessions.length}`);

  // 2. Ambil semua GridAttendance CBB
  const gridRecords = await prisma.gridAttendance.findMany({
    where: { eventType: 'CBB' }
  });
  console.log(`Total GridAttendance CBB: ${gridRecords.length}`);

  // Build lookup: userId_month_year_column -> status
  const gridLookup = {};
  gridRecords.forEach(r => {
    const key = `${r.userId}_${r.month}_${r.year}_${r.column}`;
    gridLookup[key] = r.status;
  });

  // 3. Per session, cek semua coach apakah sudah ada di GridAttendance
  console.log(`\n=== GAP ANALYSIS (Coach yang harusnya ada tapi tidak ada di GridAttendance) ===`);
  
  const missing = [];
  const sessionsSeen = new Set(); // Untuk deduplicate column+month+year+coachId

  for (const session of sessions) {
    const coachIdsList = session.coachIds 
      ? session.coachIds.split(',').map(s => s.trim()).filter(Boolean)
      : [session.coachId];

    for (const coachId of coachIdsList) {
      if (!coachId) continue;
      const key = `${coachId}_${session.month}_${session.year}_${session.column}`;
      if (sessionsSeen.has(key)) continue; // Skip duplikat
      sessionsSeen.add(key);

      const gridKey = `${coachId}_${session.month}_${session.year}_${session.column}`;
      if (!gridLookup[gridKey]) {
        missing.push({
          coachId,
          column: session.column,
          month: session.month,
          year: session.year,
          sessionId: session.id
        });
      }
    }
  }

  console.log(`Coach attendance yang HILANG dari GridAttendance: ${missing.length}`);
  if (missing.length > 0) {
    console.log('Detail:');
    missing.forEach(m => {
      console.log(`  CoachID: ${m.coachId}, Column: ${m.column}, Period: ${m.year}-${m.month}`);
    });
  }

  // 4. Tampilkan rangkuman per periode
  console.log(`\n=== RANGKUMAN PER PERIODE (GridAttendance CBB) ===`);
  const byPeriod = {};
  gridRecords.forEach(r => {
    const key = `${r.year}-${String(r.month).padStart(2,'0')}`;
    if (!byPeriod[key]) byPeriod[key] = { total: 0, hadir: 0, lainnya: 0 };
    byPeriod[key].total++;
    if (r.status === '✓') byPeriod[key].hadir++;
    else byPeriod[key].lainnya++;
  });
  
  Object.keys(byPeriod).sort().forEach(p => {
    const d = byPeriod[p];
    console.log(`Periode ${p}: ${d.total} record (Hadir: ${d.hadir}, Lainnya: ${d.lainnya})`);
  });

  // 5. Cek apakah ada user yang terdaftar sebagai PENGURUS tapi tidak punya record CBB di bulan yg ada sesi
  console.log(`\n=== PELATIH YANG MUNGKIN HILANG DATANYA ===`);
  const coaches = await prisma.user.findMany({
    where: { role: 'PENGURUS' },
    include: { profile: true }
  });

  // Kumpulkan semua (year, month, column) unique yang ada sesinya
  const sessionPeriodCols = new Set();
  sessions.forEach(s => {
    const coachIdsList = s.coachIds 
      ? s.coachIds.split(',').map(x => x.trim()).filter(Boolean)
      : [s.coachId];
    coachIdsList.forEach(cid => {
      if (cid) sessionPeriodCols.add(`${cid}_${s.year}_${s.month}_${s.column}`);
    });
  });

  let missingCoachCount = 0;
  for (const coach of coaches) {
    // Cek di grid
    const coachGridKeys = gridRecords
      .filter(r => r.userId === coach.id)
      .map(r => `${r.userId}_${r.year}_${r.month}_${r.column}`);
    
    const expectedKeys = [...sessionPeriodCols].filter(k => k.startsWith(coach.id + '_'));
    const missingForCoach = expectedKeys.filter(k => !coachGridKeys.includes(k));
    
    if (missingForCoach.length > 0) {
      missingCoachCount++;
      console.log(`Pelatih ${coach.profile?.namaLengkap || coach.email} (${coach.id}):`);
      missingForCoach.forEach(k => {
        const parts = k.split('_');
        console.log(`  - Hilang: year=${parts[1]}, month=${parts[2]}, column=${parts[3]}`);
      });
    }
  }
  if (missingCoachCount === 0) console.log('Semua pelatih terdata lengkap di GridAttendance.');
  
  console.log(`\n=== SELESAI AUDIT ===`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
