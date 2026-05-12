import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";

export default async function CbbRecapPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
  if (!decoded || (decoded.role !== "PENGURUS" && decoded.role !== "SENIOR")) {
    redirect("/dashboard");
  }

  // Ambil semua data absensi dengan eventType = CBB
  const attendances = await prisma.gridAttendance.findMany({
    where: { eventType: "CBB" },
    include: {
      user: {
        include: { profile: true }
      }
    }
  });

  // Rekap per user
  const recapData: Record<string, {
    nama: string,
    role: string,
    hadir: number,
    sakit: number,
    izin: number,
    alpa: number
  }> = {};

  attendances.forEach(a => {
    if (!recapData[a.userId]) {
      recapData[a.userId] = {
        nama: a.user?.profile?.namaLengkap || "Tanpa Nama",
        role: a.user?.role || "-",
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpa: 0
      };
    }

    if (a.status === "✓") recapData[a.userId].hadir++;
    else if (a.status === "S") recapData[a.userId].sakit++;
    else if (a.status === "I") recapData[a.userId].izin++;
    else if (a.status === "A") recapData[a.userId].alpa++;
  });

  const recapArray = Object.values(recapData).sort((a, b) => {
    if (a.role !== b.role) return a.role.localeCompare(b.role);
    return a.nama.localeCompare(b.nama);
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Rekap Absensi Event CBB</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Ringkasan kehadiran peserta (Siswa & Pelatih) khusus untuk Event CBB.</p>
      </div>

      <div className="glass-card">
        <div style={{ overflowX: 'auto', padding: '1px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '20px 16px', textAlign: 'left', width: '60px' }}>NO</th>
                <th style={{ padding: '20px 16px', textAlign: 'left' }}>NAMA LENGKAP</th>
                <th style={{ padding: '20px 16px', textAlign: 'left' }}>ROLE</th>
                <th style={{ padding: '20px 16px', color: '#10b981' }}>HADIR (✓)</th>
                <th style={{ padding: '20px 16px', color: '#f59e0b' }}>SAKIT (S)</th>
                <th style={{ padding: '20px 16px', color: '#3b82f6' }}>IZIN (I)</th>
                <th style={{ padding: '20px 16px', color: '#ef4444' }}>ALPA (A)</th>
                <th style={{ padding: '20px 16px', fontWeight: 800 }}>TOTAL PERTEMUAN</th>
              </tr>
            </thead>
            <tbody>
              {recapArray.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Belum ada data absensi untuk Event CBB.
                  </td>
                </tr>
              ) : (
                recapArray.map((row, index) => {
                  const total = row.hadir + row.sakit + row.izin + row.alpa;
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{index + 1}</td>
                      <td style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{row.nama}</td>
                      <td style={{ padding: '16px', textAlign: 'left' }}>
                        <span style={{
                          background: row.role === 'PENGURUS' ? 'rgba(249,115,22,0.1)' : 'rgba(14,165,233,0.1)',
                          color: row.role === 'PENGURUS' ? '#f97316' : '#0ea5e9',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {row.role === 'PENGURUS' ? 'PELATIH' : row.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 800, color: '#10b981' }}>{row.hadir}</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#f59e0b' }}>{row.sakit}</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#3b82f6' }}>{row.izin}</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#ef4444' }}>{row.alpa}</td>
                      <td style={{ padding: '16px', fontWeight: 800 }}>{total}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
