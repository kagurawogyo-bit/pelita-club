import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import crypto from "crypto";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  let decoded: any;
  try {
    decoded = verifyToken(token);
    if (!decoded) throw new Error();
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string; // 'KK', 'Akte', or 'Ktp'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2MB Limit
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ukuran file melebihi 2MB" }, { status: 400 });
    }

    // Format Limit
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format file tidak valid. Hanya PDF, JPG, dan PNG yang diizinkan." }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${decoded.userId}/${type}_${crypto.randomUUID()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Gagal mengupload ke Supabase Storage. Pastikan bucket 'documents' dan akses kunci (SUPABASE_URL/KEY) sudah dikonfigurasi.");
    }

    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
