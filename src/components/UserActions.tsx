"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function UserActions({ userId, userName, editUrl }: { userId: string, userName: string, editUrl: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data "${userName}"?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      router.refresh();
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Link 
        href={editUrl} 
        style={{ 
          color: 'var(--accent-primary)', 
          textDecoration: 'none', 
          fontSize: '0.9rem',
          cursor: 'pointer' 
        }}
      >
        Edit
      </Link>
      <button 
        onClick={handleDelete}
        disabled={loading}
        style={{ 
          color: 'var(--accent-danger)', 
          background: 'none', 
          border: 'none', 
          padding: 0,
          fontSize: '0.9rem',
          cursor: 'pointer',
          opacity: loading ? 0.5 : 1
        }}
      >
        {loading ? "..." : "Hapus"}
      </button>
    </div>
  );
}
