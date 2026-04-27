import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  const decoded = verifyToken(token) as any;
  if (!decoded) {
    redirect("/login");
  }

  // Fetch counts
  const totalSiswa = await prisma.user.count({ where: { role: "SISWA" } });
  const totalPengurus = await prisma.user.count({ where: { role: "PENGURUS" } });
  const totalSenior = await prisma.user.count({ where: { role: "SENIOR" } });

  // Calculate age distribution for SISWA
  const siswaProfiles = await prisma.profile.findMany({
    where: { user: { role: "SISWA" } },
    select: { tanggalLahir: true }
  });

  const ages = {
    under7: 0,
    age7_8: 0,
    age9_10: 0,
    age11_12: 0,
    age13_14: 0,
    age15_16: 0,
    age17_18: 0,
    age19plus: 0
  };

  const currentYear = new Date().getFullYear();
  siswaProfiles.forEach(p => {
    if (p.tanggalLahir) {
      const birthDate = new Date(p.tanggalLahir);
      const age = currentYear - birthDate.getFullYear();

      if (age < 7) ages.under7++;
      else if (age <= 8) ages.age7_8++;
      else if (age <= 10) ages.age9_10++;
      else if (age <= 12) ages.age11_12++;
      else if (age <= 14) ages.age13_14++;
      else if (age <= 16) ages.age15_16++;
      else if (age <= 18) ages.age17_18++;
      else ages.age19plus++;
    }
  });

  // Calculate real attendance this month (using GridAttendance for consistency)
  const currentMonth = new Date().getMonth();
  const currentYearVal = new Date().getFullYear();
  
  const allMonthAttendance = await prisma.gridAttendance.findMany({
    where: {
      month: currentMonth,
      year: currentYearVal,
      user: { role: "SISWA" }
    }
  });

  // Get total unique columns (sessions) in this month
  const activeColumns = Array.from(new Set(allMonthAttendance.filter(a => a.status !== "-").map(a => a.column)));
  const totalSessions = activeColumns.length;
  const totalPresent = allMonthAttendance.filter(a => a.status === "✓").length;
  
  const totalPossible = totalSiswa * totalSessions;
  const attendancePercentage = totalPossible > 0 
    ? Math.round((totalPresent / totalPossible) * 100) 
    : 0;


  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Selamat datang kembali di Sistem Manajemen Data Pelita.</p>
      </header>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-primary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div className="stat-value">{totalSiswa}</div>
          <div className="stat-label">Total Siswa Terdaftar</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-secondary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div className="stat-value">{attendancePercentage}%</div>
          <div className="stat-label">Kehadiran Bulan Ini</div>

        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <div className="stat-value">{totalPengurus}</div>
          <div className="stat-label">Staf Pengurus</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          <div className="stat-value">{totalSenior}</div>
          <div className="stat-label">Anggota Senior</div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        {/* Left Column: Quick Access & Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ background: 'var(--accent-warning)', color: 'white', padding: '6px', borderRadius: '8px', fontSize: '1rem' }}>⚡</span> 
              Akses Cepat
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <a href="/dashboard/members" className="quick-link">
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Tambah Siswa</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Input data baru</div>
                </div>
              </a>

              <a href="/dashboard/attendance" className="quick-link">
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><polyline points="9 15 11 17 15 13"></polyline></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Absen Siswa</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Catat kehadiran</div>
                </div>
              </a>

              <a href="/dashboard/attendance/pelatih" className="quick-link">
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="18 8 20 10 24 6"></polyline></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Absen Pelatih</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Verifikasi pelatih</div>
                </div>
              </a>

              <a href="/dashboard/reports" className="quick-link">
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Laporan</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rekap data bulanan</div>
                </div>
              </a>
            </div>
          </section>

          <section className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '6px', borderRadius: '8px', fontSize: '1rem' }}>📊</span> 
              Distribusi Kelompok Umur
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
              {[
                { label: 'Di bawah 7', value: ages.under7, color: '#f472b6' },
                { label: '7-8 thn', value: ages.age7_8, color: '#38bdf8' },
                { label: '9-10 thn', value: ages.age9_10, color: '#34d399' },
                { label: '11-12 thn', value: ages.age11_12, color: '#818cf8' },
                { label: '13-14 thn', value: ages.age13_14, color: '#a78bfa' },
                { label: '15-16 thn', value: ages.age15_16, color: '#fbbf24' },
                { label: '17-18 thn', value: ages.age17_18, color: '#f87171' },
                { label: '19+ thn', value: ages.age19plus, color: '#94a3b8' },
              ].map((age, i) => (
                <div key={i} style={{ background: 'var(--bg-primary)', padding: '16px 8px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px', color: 'var(--text-primary)' }}>{age.value}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: age.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{age.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Status & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Status Sistem</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Database</span>
                <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>● Terhubung</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Waktu Server</span>
                <span style={{ color: 'var(--text-primary)' }}>{new Date().toLocaleTimeString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)', color: 'white', border: 'none' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1.1rem' }}>Butuh Bantuan?</h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '16px', lineHeight: 1.5 }}>Jika Anda mengalami kendala teknis atau butuh panduan penggunaan, hubungi tim IT.</p>
            <button className="btn" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', width: '100%', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              Buka Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
