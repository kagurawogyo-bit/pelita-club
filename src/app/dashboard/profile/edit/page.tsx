"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserEditForm from "@/components/UserEditForm";

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>Memuat form edit...</div>;
  }

  return (
    <UserEditForm 
      user={user} 
      roleLabel="Profil Saya" 
      redirectUrl="/dashboard/profile" 
    />
  );
}
