"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function CoachSessionPage() {
  const [activeSession, setActiveSession] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Coaches list and selection
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedCoachIds, setSelectedCoachIds] = useState<string[]>([]);
  
  // Selection states
  const [selectedColumn, setSelectedColumn] = useState("M1P1");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const columns = [
    "M1P1", "M1P2", "M1P3", "M1P4", "M1P5", 
    "M2P1", "M2P2", "M2P3", "M2P4", "M2P5", 
    "M3P1", "M3P2", "M3P3", "M3P4", "M3P5", 
    "M4P1", "M4P2", "M4P3", "M4P4", "M4P3",
    "M4P4", "M4P5", "M5P1", "M5P2", "M5P3", "M5P4", "M5P5"
  ];

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);


  const fetchActiveSession = async () => {
    try {
      const res = await fetch("/api/attendance/session");
      if (res.ok) {
        const data = await res.json();
        if (data) setActiveSession(data);
      }
    } catch (err) {
      console.error("Fetch session error:", err);
    }
  };

  const fetchCoaches = async () => {
    try {
      const res = await fetch("/api/attendance/coaches");
      if (res.ok) {
        const data = await res.json();
        setCoaches(data);
      }
    } catch (err) {
      console.error("Fetch coaches error:", err);
    }
  };

  useEffect(() => {
    fetchActiveSession();
    fetchCoaches();
  }, []);

  const toggleCoachSelection = (id: string) => {
    setSelectedCoachIds(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleCreateSession = async () => {
    if (selectedCoachIds.length === 0) {
      setError("Pilih minimal satu pelatih yang melatih hari ini.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/attendance/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          column: selectedColumn,
          month: selectedMonth,
          year: selectedYear,
          coachIds: selectedCoachIds
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat sesi");
      
      setActiveSession(data);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStopSession = async () => {
    try {
      await fetch("/api/attendance/session", { method: "DELETE" });
      setActiveSession(null);
    } catch (err) {
      console.error("Stop session error:", err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>🎫 Sesi QR Absen</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Buat sesi latihan agar siswa bisa scan dan absen otomatis.
        </p>
      </div>

      {!activeSession ? (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '24px' }}>Konfigurasi Sesi Latihan</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Pilih Bulan</label>
              <select 
                className="input-field" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Pilih Tahun</label>
              <select 
                className="input-field" 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>Pilih Pelatih Yang Melatih (Bisa lebih dari satu)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {coaches.map(coach => {
                const isSelected = selectedCoachIds.includes(coach.id);
                return (
                  <div 
                    key={coach.id}
                    onClick={() => toggleCoachSelection(coach.id)}
                    style={{ 
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-primary)',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-glass)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {isSelected && "✓ "} {coach.namaLengkap}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>Pilih Kolom Pertemuan (M=Minggu, P=Pertemuan)</label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', 
              gap: '8px',
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '12px',
              background: 'var(--bg-primary)',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)'
            }}>
              {columns.map(col => (
                <button
                  key={col}
                  onClick={() => setSelectedColumn(col)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedColumn === col ? 'var(--accent-primary)' : 'var(--border-glass)',
                    background: selectedColumn === col ? 'var(--accent-primary)' : 'transparent',
                    color: selectedColumn === col ? 'white' : 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: 'var(--accent-danger)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

          <button
            onClick={handleCreateSession}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            {loading ? "Memproses..." : "Mulai Sesi & Tampilkan QR"}
          </button>
        </div>
      ) : (
        <div className="glass-card qr-card-responsive">
          <div style={{ marginBottom: '24px' }}>
             <span style={{ 
               background: 'rgba(16, 185, 129, 0.1)', 
               color: '#10b981', 
               padding: '6px 16px', 
               borderRadius: '20px', 
               fontSize: '0.85rem', 
               fontWeight: 700,
               border: '1px solid rgba(16, 185, 129, 0.2)'
             }}>
               ● SESI AKTIF
             </span>
          </div>

          <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '8px' }}>
            Pertemuan {activeSession.column}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {months[activeSession.month]} {activeSession.year}
          </p>

          <div className="qr-wrapper-responsive">
            <div className="qr-svg-container">
              <QRCode 
                value={JSON.stringify({ sessionId: activeSession.id, type: "attendance_session" })} 
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
                level="H"
              />
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
            Minta siswa untuk membuka menu <strong>Scan Absen</strong> di HP mereka dan arahkan ke kode QR di atas.
          </p>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '24px', marginTop: '24px' }}>
             <button
               onClick={handleStopSession}
               style={{ 
                 background: 'transparent', 
                 color: 'var(--accent-danger)', 
                 border: '1px solid var(--accent-danger)',
                 padding: '10px 24px',
                 borderRadius: '10px',
                 fontWeight: 700,
                 cursor: 'pointer'
               }}
             >
               Hentikan Sesi
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
