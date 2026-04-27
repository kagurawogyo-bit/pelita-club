import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import PengurusTable from "@/components/PengurusTable";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

export default async function PengurusPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  let decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    redirect("/login");
  }

  if (decoded.role !== "PENGURUS") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    where: { role: "PENGURUS" },
    include: { profile: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Data Pengurus</h2>
        <a href="/dashboard/pengurus/add" className="btn btn-primary" style={{ background: 'var(--accent-primary)', border: 'none', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>
          + Tambah Pengurus
        </a>
      </div>

      <PengurusTable initialUsers={users} />
    </div>
  );
}
