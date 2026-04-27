"use client";

import { useState } from "react";
import UserActions from "./UserActions";

export default function PengurusTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map(u => u.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} pengurus terpilih?`)) return;

    setLoading(true);
    try {
      // Loop delete or create a bulk delete API
      // Since I already have /api/admin/reset-students, I could make a generic bulk delete API
      // For now, let's just use the individual delete API in a loop for simplicity, 
      // or better, use the existing UserActions logic.
      
      const deletePromises = selectedIds.map(id => 
        fetch(`/api/users/${id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      
      setUsers(prev => prev.filter(u => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      alert("Berhasil menghapus pengurus terpilih.");
    } catch (err) {
      alert("Gagal menghapus beberapa data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="checkbox" 
            checked={users.length > 0 && selectedIds.length === users.length}
            onChange={toggleSelectAll}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Pilih Semua ({selectedIds.length} terpilih)
          </span>
        </div>
        
        {selectedIds.length > 0 && (
          <button 
            onClick={handleBulkDelete}
            disabled={loading}
            className="btn"
            style={{ background: 'var(--accent-danger)', color: 'white', padding: '6px 12px', fontSize: '0.8rem' }}
          >
            {loading ? "Menghapus..." : `Hapus ${selectedIds.length} Terpilih`}
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px', width: '40px' }}></th>
              <th style={{ padding: '16px', width: '50px' }}>NO</th>
              <th style={{ padding: '16px' }}>NAMA LENGKAP</th>
              <th style={{ padding: '16px' }}>NIK</th>
              <th style={{ padding: '16px' }}>JENIS KELAMIN</th>
              <th style={{ padding: '16px' }}>ALAMAT</th>
              <th style={{ padding: '16px' }}>NOMOR HP</th>
              <th style={{ padding: '16px' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Tidak ada data pengurus.</td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-glass)', background: selectedIds.includes(u.id) ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td style={{ padding: '16px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>{index + 1}</td>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.profile?.namaLengkap || "Tanpa Nama"}</td>
                  <td style={{ padding: '16px' }}>{u.profile?.nik || "-"}</td>
                  <td style={{ padding: '16px' }}>{u.profile?.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{u.profile?.alamat || "-"}</td>
                  <td style={{ padding: '16px' }}>{u.profile?.nomorHp || "-"}</td>
                  <td style={{ padding: '16px' }}>
                    <UserActions 
                      userId={u.id} 
                      userName={u.profile?.namaLengkap || "Tanpa Nama"} 
                      editUrl={`/dashboard/pengurus/edit/${u.id}`} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
