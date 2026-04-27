import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserEditForm from "@/components/UserEditForm";

export default async function EditPengurusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  });

  if (!user) redirect("/dashboard/pengurus");

  return <UserEditForm user={user} roleLabel="Pengurus" redirectUrl="/dashboard/pengurus" />;
}
