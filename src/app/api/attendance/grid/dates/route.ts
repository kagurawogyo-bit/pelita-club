import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || "0");
    const year = parseInt(searchParams.get("year") || "0");
    const eventType = searchParams.get("eventType") || "REGULAR";

    const columnDates = await prisma.gridColumnDate.findMany({
      where: { month, year, eventType }
    });

    // Format into Record<column, dateText>
    const formatted: Record<string, string> = {};
    columnDates.forEach(cd => {
      formatted[cd.column] = cd.dateText;
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET Grid Column Dates Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data tanggal kolom" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });

    const decoded = verifyToken(token) as { userId: string, role: string } | null;
    if (!decoded) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    // Only allow admins/pengurus to update dates
    if (decoded.role === "SISWA") {
        return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { month, year, eventType = "REGULAR", column, dateText } = await req.json();

    if (dateText === "") {
        // If empty, delete the record to clean up
        await prisma.gridColumnDate.deleteMany({
            where: { month, year, eventType, column }
        });
        return NextResponse.json({ message: "Tanggal dihapus" });
    }

    const columnDate = await prisma.gridColumnDate.upsert({
      where: {
        month_year_eventType_column: {
          month, year, eventType, column
        }
      },
      update: { dateText },
      create: { month, year, eventType, column, dateText }
    });

    return NextResponse.json({ message: "Berhasil menyimpan tanggal", columnDate });
  } catch (error) {
    console.error("POST Grid Column Dates Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan tanggal kolom" }, { status: 500 });
  }
}
