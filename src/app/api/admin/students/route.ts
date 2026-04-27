import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: string, role: string };

    if (!decoded || decoded.role !== "PENGURUS") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }


    const students = await prisma.user.findMany({
      where: { role: "SISWA" },
      include: { profile: true },
      orderBy: { profile: { namaLengkap: 'asc' } }
    });

    console.log(`DEBUG: Found ${students.length} students for reset menu`);
    students.forEach(s => {
      console.log(`DEBUG: ID=${s.id}, Email=${s.email}, Name=${s.profile?.namaLengkap}`);
    });

    const formatted = students.map(s => ({
      id: s.id,
      email: s.email,
      namaLengkap: s.profile?.namaLengkap?.toLowerCase() || 'tanpa nama',
    }));

    return NextResponse.json(formatted);

  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json({ error: "Gagal mengambil data siswa" }, { status: 500 });
  }
}
