import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      email, password, role,
      namaLengkap, namaPanggilan, nik, nomorHp,
      tempatLahir, tanggalLahir, jenisKelamin, agama,
      tinggiBadan, beratBadan, alamat, namaAyah, namaIbu, sekolahAsal
    } = body;

    // Validate email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Validate NIK
    if (nik) {
      const existingProfile = await prisma.profile.findUnique({
        where: { nik },
      });

      if (existingProfile) {
        return NextResponse.json({ error: "NIK sudah terdaftar" }, { status: 400 });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User and Profile in a transaction
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        profile: {
          create: {
            namaLengkap,
            namaPanggilan: namaPanggilan || null,
            nik,
            nomorHp,
            tempatLahir,
            tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
            jenisKelamin,
            agama,
            tinggiBadan: tinggiBadan ? parseFloat(tinggiBadan) : null,
            beratBadan: beratBadan ? parseFloat(beratBadan) : null,
            alamat,
            namaAyah,
            namaIbu,
            sekolahAsal
          }
        }
      }
    });

    return NextResponse.json({ message: "Pendaftaran berhasil", userId: newUser.id }, { status: 201 });

  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
