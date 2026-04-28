import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 400 });
    }

    // Ambil info sesi
    const session = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        coach: {
          include: { profile: true }
        }
      }
    });

    if (!session || !session.isActive || new Date() > new Date(session.expiresAt)) {
      return NextResponse.json({ error: "Sesi tidak valid atau sudah berakhir" }, { status: 400 });
    }

    const userId = decoded.userId;
    const { column, month, year, eventType = "REGULAR" } = session;
    const status = "✓"; // Default hadir jika scan QR sesi

    // Upsert ke GridAttendance
    await prisma.gridAttendance.upsert({
      where: {
        userId_month_year_column_eventType: {
          userId,
          column,
          month,
          year,
          eventType,
        },
      },
      update: { status },
      create: {
        userId,
        column,
        month,
        year,
        status,
        eventType,
      },
    });

    // Juga catat kehadiran pelatih secara otomatis untuk semua yang terdaftar di sesi
    const coachIdsList = session.coachIds ? session.coachIds.split(",") : [session.coachId];
    
    // Optimasi: Hanya update pelatih jika belum ditandai hadir di database untuk sesi ini
    for (const coachId of coachIdsList) {
        if (!coachId) continue;
        
        const alreadyPresent = await prisma.gridAttendance.findUnique({
          where: {
            userId_month_year_column_eventType: {
              userId: coachId,
              column,
              month,
              year,
              eventType,
            }
          }
        });

        if (alreadyPresent?.status !== "✓") {
          await prisma.gridAttendance.upsert({
            where: {
              userId_month_year_column_eventType: {
                userId: coachId,
                column,
                month,
                year,
                eventType,
              },
            },
            update: { status: "✓" },
            create: {
              userId: coachId,
              column,
              month,
              year,
              status: "✓",
              eventType,
            },
          });
        }
    }


    return NextResponse.json({
      message: "Kehadiran berhasil dicatat!",
      namaPelatih: session.coach.profile?.namaLengkap || "Pelatih",
      kolom: column
    });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    console.error("QR Checkin Error:", error);
    return NextResponse.json({ error: "Gagal mencatat kehadiran" }, { status: 500 });
  }
}
