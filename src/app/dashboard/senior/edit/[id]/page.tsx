import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserEditForm from "@/components/UserEditForm";

export default async function EditSeniorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  });

  if (!user) redirect("/dashboard/senior");

  return <UserEditForm user={user} roleLabel="Senior" redirectUrl="/dashboard/senior" />;
}
