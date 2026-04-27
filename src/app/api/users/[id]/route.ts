import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
    if (!decoded || decoded.role !== "PENGURUS") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }


    const { id } = await params;

    // Delete profile first due to foreign key constraints if any (Prisma cascade might handle it)
    await prisma.profile.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
    if (!decoded || decoded.role !== "PENGURUS") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }


    const { id } = await params;
    const data = await request.json();

    // Update profile
    await prisma.profile.update({
      where: { userId: id },
      data: {
        namaLengkap: data.namaLengkap,
        namaPanggilan: data.namaPanggilan,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : undefined,
        agama: data.agama,
        jenisKelamin: data.jenisKelamin,
        alamat: data.alamat,
        nik: data.nik,
        tinggiBadan: data.tinggiBadan ? parseFloat(data.tinggiBadan) : undefined,
        beratBadan: data.beratBadan ? parseFloat(data.beratBadan) : undefined,
        namaAyah: data.namaAyah,
        namaIbu: data.namaIbu,
        nomorHp: data.nomorHp,
        sekolahAsal: data.sekolahAsal,
      }
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
