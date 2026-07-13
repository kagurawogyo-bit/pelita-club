import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name") || "dokumen";

  if (!fileUrl) {
    return NextResponse.json({ error: "URL tidak ditemukan" }, { status: 400 });
  }

  // Whitelist: hanya izinkan file dari Supabase project ini
  if (!fileUrl.includes("igjoyxocpealzlqnypfc.supabase.co")) {
    return NextResponse.json({ error: "URL tidak diizinkan" }, { status: 403 });
  }

  try {
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) throw new Error("File tidak ditemukan di storage");

    const contentType = fileRes.headers.get("content-type") || "application/octet-stream";
    const buffer = await fileRes.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return NextResponse.json({ error: err.message || "Gagal mengunduh file" }, { status: 500 });
  }
}
