"use client";

import { useState } from "react";
import UserActions from "./UserActions";

export default function SeniorTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter(u => 
    (u.profile?.namaLengkap || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Hapus ${selectedIds.length} akun senior yang dipilih?`)) return;
    
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
      }
      setUsers(users.filter((u: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      alert("Berhasil menghapus senior terpilih");
    } catch (error) {
      alert("Gagal menghapus beberapa akun");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Cari nama atau email senior..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field" 
            style={{ width: '100%', paddingLeft: '48px', background: 'var(--bg-secondary)' }} 
          />
        </div>
        
        {selectedIds.length > 0 && (
          <button 
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="btn" 
            style={{ background: 'var(--accent-danger)', color: 'white' }}
          >
            {isDeleting ? "Menghapus..." : `Hapus ${selectedIds.length} Terpilih`}
          </button>
        )}
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-subtle)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px', width: '50px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </th>
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {searchTerm ? "Tidak ada senior yang cocok dengan pencarian." : "Tidak ada data senior."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr 
                    key={u.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-glass)',
                      background: selectedIds.includes(u.id) ? 'rgba(2, 132, 199, 0.05)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(u.id)}
                        onChange={() => handleSelectOne(u.id)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>{index + 1}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.profile?.namaLengkap || "Tanpa Nama"}</td>
                    <td style={{ padding: '16px' }}>{u.profile?.nik || "-"}</td>
                    <td style={{ padding: '16px' }}>{u.profile?.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.profile?.alamat || "-"}</td>
                    <td style={{ padding: '16px' }}>{u.profile?.nomorHp || "-"}</td>
                    <td style={{ padding: '16px' }}>
                      <UserActions 
                        userId={u.id} 
                        userName={u.profile?.namaLengkap || "Tanpa Nama"} 
                        editUrl={`/dashboard/senior/edit/${u.id}`} 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
