import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Untuk keamanan, kita berikan respon sukses yang sama meskipun email tidak terdaftar
    // agar penyerang tidak bisa menebak email mana yang terdaftar.
    if (!user) {
      return NextResponse.json({ 
        message: "Jika email terdaftar, instruksi reset akan dikirim." 
      });
    }

    // Di sini seharusnya ada logika pengiriman email asli menggunakan library seperti nodemailer.
    // Untuk saat ini, kita simulasikan sukses.
    
    return NextResponse.json({ 
      message: "Instruksi reset password telah dikirim ke email Anda." 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
