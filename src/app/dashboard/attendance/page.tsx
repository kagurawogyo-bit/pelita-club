import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import AttendanceManager from "@/components/AttendanceManager";

export default async function AttendancePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
  if (!decoded) redirect("/login");

  // Fetch users with role SISWA
  const users = await prisma.user.findMany({
    where: { role: "SISWA" },
    include: { profile: true },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch real coaches (PENGURUS)
  const coachesRaw = await prisma.user.findMany({
    where: { role: "PENGURUS" },
    include: { profile: true },
    orderBy: { profile: { namaLengkap: 'asc' } }
  });

  const coaches = coachesRaw
    .filter(c => c.profile?.namaLengkap?.startsWith("Coach")) 
    .map(c => ({
      id: c.id,
      namaLengkap: c.profile?.namaLengkap || "Pelatih"
    }));

  const today = new Date();

  // Format data for the table, including kelompokUmur calculation
  let formattedStudents = users.map(u => {
    let umur = 0;
    let kelompokUmur = "-";
    
    if (u.profile?.tanggalLahir) {
      const birthDate = new Date(u.profile.tanggalLahir);
      umur = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        umur--;
      }

      if (umur < 7) kelompokUmur = "Di bawah 7 tahun";
      else if (umur <= 8) kelompokUmur = "7-8 tahun";
      else if (umur <= 10) kelompokUmur = "9-10 tahun";
      else if (umur <= 12) kelompokUmur = "11-12 tahun";
      else if (umur <= 14) kelompokUmur = "13-14 tahun";
      else if (umur <= 16) kelompokUmur = "15-16 tahun";
      else kelompokUmur = "17 tahun ke atas";
    }

    return {
      id: u.id,
      namaLengkap: u.profile?.namaLengkap?.toLowerCase() || "tanpa nama",
      kelompokUmur,
    };
  });

  // If user is a student, only show their own name
  if (decoded.role === "SISWA") {
    formattedStudents = formattedStudents.filter(s => s.id === decoded.userId);
  }

  return (
    <AttendanceManager 
      initialStudents={formattedStudents} 
      showCoachSelection={false} 
      coaches={coaches}
      readOnly={decoded.role === "SISWA"}
    />
  );


}
