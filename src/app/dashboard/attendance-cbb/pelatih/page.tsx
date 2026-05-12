import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import AttendanceManager from "@/components/AttendanceManager";

export default async function CbbPelatihAttendancePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
  if (!decoded || (decoded.role !== "PENGURUS" && decoded.role !== "SENIOR")) {
    redirect("/dashboard");
  }

  // Fetch users with role PENGURUS
  const users = await prisma.user.findMany({
    where: { role: "PENGURUS" },
    include: { profile: true },
    orderBy: { profile: { namaLengkap: 'asc' } }
  });

  const coaches = users.map(u => ({
    id: u.id,
    namaLengkap: u.profile?.namaLengkap || u.email || "Pelatih",
    kelompokUmur: "Pelatih"
  }));

  const cbbColumns = [
    "CBB-1", "CBB-2", "CBB-3", "CBB-4", "CBB-5", 
    "CBB-6", "CBB-7", "CBB-8", "CBB-9", "CBB-10",
    "CBB-11", "CBB-12", "CBB-13", "CBB-14", "CBB-15",
    "CBB-16", "CBB-17", "CBB-18", "CBB-19", "CBB-20"
  ];

  return (
    <AttendanceManager 
      initialStudents={coaches} 
      customGroups={["Pelatih"]}
      title="Absensi Pelatih (Event CBB)"
      showCoachSelection={false} 
      readOnly={false}
      eventType="CBB"
      customColumns={cbbColumns}
    />
  );
}
