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
    if (!decoded || (decoded.role !== "PENGURUS" && decoded.role !== "SENIOR")) {
      // Izinkan SENIOR jika mereka juga melatih, tapi sesuaikan role check jika perlu
      return NextResponse.json({ error: "Hanya pengurus yang dapat membuat sesi" }, { status: 403 });
    }

    const { column, month, year, coachIds, eventType = "REGULAR" } = await req.json();

    if (!column || month === undefined || year === undefined) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Matikan sesi aktif sebelumnya milik pelatih ini
    try {
      await prisma.attendanceSession.updateMany({
        where: { coachId: decoded.userId, isActive: true },
        data: { isActive: false }
      });
    } catch (updateErr: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      console.error("Error updating old sessions:", updateErr);
      throw new Error("Gagal mengupdate sesi lama: " + updateErr.message);
    }

    // Buat sesi baru yang berlaku selama 3 jam
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    try {
      const session = await prisma.attendanceSession.create({
        data: {
          coachId: decoded.userId,
          coachIds: Array.isArray(coachIds) ? coachIds.join(",") : decoded.userId,
          column,
          month,
          year,
          expiresAt,
          isActive: true,
          eventType
        },
        include: {
          coach: {
            include: { profile: true }
          }
        }
      });

      // Sinkronisasi otomatis: Tandai pelatih hadir saat sesi dibuat
      const coachIdsList = Array.isArray(coachIds) ? coachIds : [decoded.userId];
      for (const cid of coachIdsList) {
        if (!cid) continue;
        await prisma.gridAttendance.upsert({
          where: {
            userId_month_year_column_eventType: {
              userId: cid,
              column,
              month,
              year,
              eventType,
            },
          },
          update: { status: "✓" },
          create: {
            userId: cid,
            column,
            month,
            year,
            status: "✓",
            eventType,
          },
        });
      }

      return NextResponse.json(session);
    } catch (createErr: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      console.error("Error creating session in DB:", createErr);
      throw new Error("Gagal membuat data sesi: " + createErr.message);
    }
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    console.error("Create Session Detailed Error:", error);
    return NextResponse.json({ 
      error: error.message || "Gagal membuat sesi",
      details: error.stack
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");
    const eventType = searchParams.get("eventType");

    if (sessionId) {
      const session = await prisma.attendanceSession.findUnique({
        where: { id: sessionId },
        include: {
          coach: {
            include: { profile: true }
          }
        }
      });
      
      if (!session) return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
      
      // Check if expired
      if (new Date() > new Date(session.expiresAt) || !session.isActive) {
        return NextResponse.json({ ...session, isExpired: true });
      }
      
      return NextResponse.json(session);
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const activeSession = await prisma.attendanceSession.findFirst({
      where: { 
        coachId: decoded.userId, 
        isActive: true,
        expiresAt: { gt: new Date() },
        ...(eventType ? { eventType } : {})
      },
      include: {
        coach: {
          include: { profile: true }
        }
      }
    });

    return NextResponse.json(activeSession);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
        
        const { searchParams } = new URL(req.url);
        const eventType = searchParams.get("eventType");
        
        await prisma.attendanceSession.updateMany({
            where: { 
                coachId: decoded.userId, 
                isActive: true,
                ...(eventType ? { eventType } : {})
            },
            data: { isActive: false }
        });
        
        return NextResponse.json({ message: "Sesi berhasil dihentikan" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
