import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: string, role: string };
    if (!decoded) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }


    // Set attendance date to beginning of current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already attended today
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: decoded.userId,
          date: today
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Anda sudah melakukan absensi hari ini" }, { status: 400 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: decoded.userId,
        date: today,
        status: "HADIR"
      }
    });

    return NextResponse.json({ message: "Berhasil mencatat kehadiran", attendance }, { status: 201 });

  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    console.error("Attendance Error:", error);
    return NextResponse.json({ error: "Gagal mencatat kehadiran" }, { status: 500 });
  }
}
