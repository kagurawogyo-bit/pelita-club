"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchStudents = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await fetch("/api/admin/students");
      if (res.ok) {
        const data = await res.json();
        // Sort A-Z by name
        const sortedData = data.sort((a: any  , b: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => a.namaLengkap.localeCompare(b.namaLengkap));
        setStudents(sortedData);
      }
    } catch (err) {
      console.error("Fetch students error:", err);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map(s => s.id));
    }
  };

  const handleReset = async () => {
    if (selectedIds.length === 0) return;
    
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/reset-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedIds })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setSelectedIds([]);
        setShowConfirm(false);
        fetchStudents(); // Refresh list
      } else {
        throw new Error(data.error || "Gagal menghapus data");
      }
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Reset Akun Siswa</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Pilih akun siswa yang ingin dihapus secara permanen dari sistem.</p>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              type="checkbox" 
              checked={students.length > 0 && selectedIds.length === students.length}
              onChange={toggleSelectAll}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 600 }}>Pilih Semua ({selectedIds.length} Terpilih)</span>
          </div>
          
          <button 
            disabled={selectedIds.length === 0 || loading}
            onClick={() => setShowConfirm(true)}
            className="btn" 
            style={{ 
              background: selectedIds.length > 0 ? 'var(--accent-danger)' : 'var(--bg-secondary)', 
              color: 'white',
              opacity: selectedIds.length > 0 ? 1 : 0.5,
              cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            Hapus Akun Terpilih
          </button>
        </div>

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-secondary)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            ✅ {message}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            ❌ {error}
          </div>
        )}

        {fetchLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data siswa...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {students.length === 0 ? (
              <div style={{ gridColumn: '1/-1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Tidak ada akun siswa terdaftar.</div>
            ) : (
              students.map(student => (
                <div 
                  key={student.id}
                  onClick={() => toggleSelect(student.id)}
                  style={{ 
                    padding: '16px', 
                    borderRadius: '12px', 
                    background: selectedIds.includes(student.id) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: selectedIds.includes(student.id) ? 'var(--accent-danger)' : 'var(--border-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(student.id)}
                    readOnly
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{student.namaLengkap}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showConfirm && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{ maxWidth: '500px', padding: '32px', border: '1px solid var(--accent-danger)' }}>
            <h3 style={{ color: 'var(--accent-danger)', marginBottom: '16px' }}>⚠️ Konfirmasi Penghapusan</h3>
            <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>
              Anda akan menghapus **{selectedIds.length} akun siswa** secara permanen. Data biodata dan absensi mereka juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={handleReset}
                disabled={loading}
                className="btn"
                style={{ background: 'var(--accent-danger)', color: 'white', flex: 1 }}
              >
                {loading ? "Menghapus..." : "Ya, Hapus Sekarang"}
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
