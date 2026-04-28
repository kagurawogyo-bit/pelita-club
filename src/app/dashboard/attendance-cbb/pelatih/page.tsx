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
      namaLengkap: c.profile?.namaLengkap || "Pelatih",
      kelompokUmur: "Pelatih"
    }));

  const cbbColumns = [
    "CBB-1", "CBB-2", "CBB-3", "CBB-4", "CBB-5", 
    "CBB-6", "CBB-7", "CBB-8", "CBB-9", "CBB-10"
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
