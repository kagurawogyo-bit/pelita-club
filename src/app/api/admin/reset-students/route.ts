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

    if (!decoded || decoded.role !== "PENGURUS") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }


    const body = await req.json();
    const { userIds } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "Pilih setidaknya satu akun" }, { status: 400 });
    }

    // Delete users with role "SISWA" that are in the userIds list
    const deleted = await prisma.user.deleteMany({
      where: {
        role: "SISWA",
        id: { in: userIds }
      }
    });

    return NextResponse.json({ 
      message: `Berhasil menghapus ${deleted.count} akun siswa`,
      count: deleted.count 
    });

  } catch (error) {
    console.error("Reset Students Error:", error);
    return NextResponse.json({ error: "Gagal mereset akun siswa" }, { status: 500 });
  }
}
