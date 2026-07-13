import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import PrintBiodata from "@/components/PrintBiodata";

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const decoded: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = verifyToken(token);
  if (!decoded || decoded.role !== "PENGURUS") redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!user) redirect("/dashboard/members");

  return <PrintBiodata user={user} />;
}
