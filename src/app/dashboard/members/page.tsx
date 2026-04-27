import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import StudentTable from "@/components/StudentTable";

export default async function MembersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
  if (!decoded) redirect("/login");

  if (decoded.role !== "PENGURUS") {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-danger)' }}>Akses Ditolak</h2>
        <p>Hanya pengurus yang dapat melihat halaman ini.</p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    where: { role: "SISWA" },
    include: { profile: true },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate age distribution based on birth year relative to this year (January 1st)
  const currentYear = new Date().getFullYear();
  
  // Format data for the table
  const formattedStudents = users.map(u => {
    let umur = 0;
    let kelompokUmur = "-";
    
    if (u.profile?.tanggalLahir) {
      const birthDate = new Date(u.profile.tanggalLahir);
      umur = currentYear - birthDate.getFullYear();

      if (umur < 7) kelompokUmur = "Di bawah 7 tahun";
      else if (umur <= 8) kelompokUmur = "7-8 tahun";
      else if (umur <= 10) kelompokUmur = "9-10 tahun";
      else if (umur <= 12) kelompokUmur = "11-12 tahun";
      else if (umur <= 14) kelompokUmur = "13-14 tahun";
      else if (umur <= 16) kelompokUmur = "15-16 tahun";
      else if (umur <= 18) kelompokUmur = "17-18 tahun";
      else kelompokUmur = "19+ tahun";
    }

    const ttl = `${u.profile?.tempatLahir || ''}, ${u.profile?.tanggalLahir ? new Date(u.profile.tanggalLahir).toISOString().split('T')[0] : ''}`;
    const tbbb = `${u.profile?.tinggiBadan || '-'}cm / ${u.profile?.beratBadan || '-'}kg`;
    const jk = u.profile?.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";

    return {
      id: u.id,
      namaLengkap: u.profile?.namaLengkap?.toLowerCase() || "tanpa nama",
      namaPanggilan: u.profile?.namaPanggilan?.toLowerCase() || "-",
      ttl: ttl,
      umurText: umur > 0 ? `${umur} th` : "-",
      kelompokUmur,
      jk,
      tbbb,
      hp: u.profile?.nomorHp || "-",
      asalSekolah: u.profile?.sekolahAsal || "-"
    };
  });

  // DB empty check
  if (formattedStudents.length === 0) {
    // No fallback, show empty table
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Data Siswa</h2>
        <a href="/dashboard/members/add" className="btn btn-primary" style={{ background: 'var(--accent-primary)', border: 'none', padding: '10px 20px', borderRadius: '8px' }}>
          + Tambah Siswa
        </a>
      </div>

      <StudentTable students={formattedStudents} />
    </div>
  );
}
