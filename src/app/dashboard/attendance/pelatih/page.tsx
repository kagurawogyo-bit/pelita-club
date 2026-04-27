import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import AttendanceManager from "@/components/AttendanceManager";

export default async function CoachAttendancePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
  if (!decoded) redirect("/login");

  if (decoded.role !== "PENGURUS") {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-danger)' }}>Akses Ditolak</h2>
        <p>Hanya pengurus yang dapat mengelola absensi pelatih.</p>
      </div>
    );
  }

  // Fetch users with role PENGURUS
  const users = await prisma.user.findMany({
    where: { role: "PENGURUS" },
    include: { profile: true },
    orderBy: { profile: { namaLengkap: 'asc' } }
  });

  // Format data for the table - Show all PENGURUS as potential coaches
  const formattedCoaches = users.map(u => {
    return {
      id: u.id,
      namaLengkap: u.profile?.namaLengkap || u.email || "Pelatih",
      kelompokUmur: "Pelatih",
    };
  });


  return (
    <AttendanceManager 
      initialStudents={formattedCoaches} 
      title="Absensi Pelatih"
      customGroups={["Pelatih"]}
    />
  );
}
