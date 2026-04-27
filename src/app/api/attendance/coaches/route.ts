import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const coachesRaw = await prisma.user.findMany({
      where: { role: "PENGURUS" },
      include: { profile: true },
      orderBy: { profile: { namaLengkap: 'asc' } }
    });

    const coaches = coachesRaw.map(c => ({
      id: c.id,
      namaLengkap: c.profile?.namaLengkap || "Pelatih"
    }));

    return NextResponse.json(coaches);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
