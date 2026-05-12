import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import AttendanceManager from "@/components/AttendanceManager";

export default async function CbbAttendancePage() {
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

  const today = new Date();

  // Format data for the table
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

  // Define custom columns for CBB (e.g. Hari-1, Hari-2, etc. or M1P1)
  // Since the user agreed to the plan but didn't specify, we'll keep M1P1 format but they are stored under eventType="CBB"
  const cbbColumns = [
    "CBB-1", "CBB-2", "CBB-3", "CBB-4", "CBB-5", 
    "CBB-6", "CBB-7", "CBB-8", "CBB-9", "CBB-10",
    "CBB-11", "CBB-12", "CBB-13", "CBB-14", "CBB-15",
    "CBB-16", "CBB-17", "CBB-18", "CBB-19", "CBB-20"
  ];

  return (
    <AttendanceManager 
      initialStudents={formattedStudents} 
      showCoachSelection={false} 
      title="Absensi Siswa (Event CBB)"
      readOnly={decoded.role === "SISWA"}
      eventType="CBB"
      customColumns={cbbColumns}
    />
  );
}
