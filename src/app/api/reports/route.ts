import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth()));
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
    const role = searchParams.get("role") || "SISWA";

    // Fetch all users with the requested role
    let users = await prisma.user.findMany({
      where: { role },
      include: { profile: true }
    });

    // If role is PENGURUS, we might want to see all staff or specific coaches
    // Refined: If they have a profile, we include them
    if (role === "PENGURUS") {
      users = users.filter(u => u.profile); 
    }

    // Fetch all attendance for these specific users in the given month/year
    const allAttendance = await prisma.gridAttendance.findMany({
      where: {
        month,
        year,
        userId: { in: users.map(u => u.id) }
      }
    });

    // Get all unique columns that have at least ONE non-empty status marked
    const activeColumns = Array.from(new Set(
      allAttendance
        .filter(a => a.status !== "-")
        .map(a => a.column)
    ));
    
    const totalPossibleSessions = activeColumns.length;

    // Calculate report for each user
    const report = users.map(user => {
      const userAttendances = allAttendance.filter(a => a.userId === user.id);
      const presentSessions = userAttendances.filter(a => a.status === "✓").length;
      
      const percentage = totalPossibleSessions > 0 
        ? Math.round((presentSessions / totalPossibleSessions) * 100) 
        : 0;

      return {
        id: user.id,
        name: user.profile?.namaLengkap?.toLowerCase() || "tanpa nama",
        role: user.role,
        present: presentSessions,
        total: totalPossibleSessions,
        percentage
      };
    });

    // Sort by percentage descending
    const sortedReport = report.sort((a, b) => b.percentage - a.percentage);

    return NextResponse.json(sortedReport);
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    console.error("Report API Error:", error);
    return NextResponse.json({ error: "Gagal membuat laporan" }, { status: 500 });
  }
}
