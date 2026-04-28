import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || "0");
    const year = parseInt(searchParams.get("year") || "0");
    const eventType = searchParams.get("eventType") || "REGULAR";

    const attendances = await prisma.gridAttendance.findMany({
      where: {
        month,
        year,
        eventType
      }
    });

    // Format into Record<userId, Record<column, status>>
    const formatted: Record<string, Record<string, string>> = {};
    attendances.forEach(a => {
      if (!formatted[a.userId]) formatted[a.userId] = {};
      formatted[a.userId][a.column] = a.status;
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET Grid Attendance Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data absensi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: string, role: string } | null;
    if (!decoded) {
        return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, month, year, column, status, coachIds, eventType = "REGULAR" } = body;

    // Security check: only PENGURUS can update others. SISWA can only update themselves.
    if (decoded.role === "SISWA" && decoded.userId !== userId) {
        return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    // Upsert the main attendance record
    const attendance = await prisma.gridAttendance.upsert({
      where: {
        userId_month_year_column_eventType: {
          userId,
          month,
          year,
          column,
          eventType
        }
      },
      update: { status },
      create: { userId, month, year, column, status, eventType }
    });

    // If coachIds are provided and status is "✓", also update coach attendance
    if (Array.isArray(coachIds) && status === "✓") {
      for (const coachId of coachIds) {
        await prisma.gridAttendance.upsert({
          where: {
            userId_month_year_column_eventType: {
              userId: coachId,
              month,
              year,
              column,
              eventType
            }
          },
          update: { status: "✓" },
          create: {
            userId: coachId,
            month,
            year,
            column,
            status: "✓",
            eventType
          }
        });
      }
    }

    return NextResponse.json({ message: "Berhasil menyimpan absensi", attendance });

  } catch (error) {
    console.error("POST Grid Attendance Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan absensi" }, { status: 500 });
  }
}
