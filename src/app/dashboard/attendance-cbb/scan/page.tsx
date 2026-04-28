"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type ScanResult = {
  userId: string;
  nama: string;
  role: string;
};

type LogEntry = {
  nama: string;
  status: string;
  waktu: string;
};

const STATUS_OPTIONS = [
  { value: "✓", label: "Hadir", color: "#10b981" },
  { value: "S", label: "Sakit", color: "#f59e0b" },
  { value: "I", label: "Izin", color: "#3b82f6" },
];

const statusLabel: Record<string, { label: string; color: string }> = {
  "✓": { label: "Hadir", color: "#10b981" },
  "S": { label: "Sakit", color: "#f59e0b" },
  "I": { label: "Izin", color: "#3b82f6" },
  "A": { label: "Alpa", color: "#ef4444" },
};

export default function CbbQRScanPage() {
  const [isActive, setIsActive] = useState(false);
  const [scanned, setScanned] = useState<ScanResult | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("✓");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [camError, setCamError] = useState("");

  const scannerInstanceRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  const [activeSession, setActiveSession] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [loadingSession, setLoadingSession] = useState(false);

  const cleanupScanner = useCallback(() => {
    const instance = scannerInstanceRef.current;
    if (instance) {
      instance.stop()
        .then(() => instance.clear())
        .catch(() => {
          try { instance.clear(); } catch (_) {}
        });
      scannerInstanceRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanupScanner();
    };
  }, [cleanupScanner]);

  const fetchSessionInfo = async (sessionId: string) => {
    setLoadingSession(true);
    try {
      const res = await fetch(`/api/attendance/session?id=${sessionId}`);
      const data = await res.json();
      if (res.ok) {
        if (data.eventType !== "CBB") {
            throw new Error("QR Code ini bukan untuk Sesi CBB!");
        }
        setActiveSession(data);
      } else {
        throw new Error(data.error || "Gagal memuat info sesi");
      }
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoadingSession(false);
    }
  };

  const startScanner = useCallback(async () => {
    setCamError("");
    setMessage("");
    setScanned(null);
    setActiveSession(null);

    const { Html5Qrcode } = await import("html5-qrcode");
    const el = document.getElementById("qr-reader-container");
    if (!el) return;

    try {
      const scanner = new Html5Qrcode("qr-reader-container");
      scannerInstanceRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (text: string) => {
          try {
            const data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = JSON.parse(text);
            
            // Handle Session QR (CBB Flow)
            if (data.sessionId && data.type === "attendance_session_cbb" && isMountedRef.current) {
              scanner.stop().then(() => {
                scannerInstanceRef.current = null;
                if (isMountedRef.current) {
                  setIsActive(false);
                  fetchSessionInfo(data.sessionId);
                }
              });
              return;
            }

            // Reject if it's regular session
            if (data.sessionId && data.type === "attendance_session" && isMountedRef.current) {
              setMessage("❌ Ini QR Absen Reguler. Silakan scan QR Absen CBB.");
              scanner.stop().then(() => {
                scannerInstanceRef.current = null;
                setIsActive(false);
              });
              return;
            }

          } catch {
            // ignore invalid QR
          }
        },
        () => {}
      );

      if (isMountedRef.current) setIsActive(true);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setCamError("Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.");
      setIsActive(false);
    }
  }, []);

  const stopScanner = useCallback(() => {
    cleanupScanner();
    setIsActive(false);
  }, [cleanupScanner]);

  const handleSave = async () => {
    if (!scanned && !activeSession) return;
    setSaving(true);
    setMessage("");

    try {
      const payload = activeSession 
        ? { sessionId: activeSession.id } 
        : { userId: scanned?.userId, status: selectedStatus };

      const res = await fetch("/api/attendance/qr-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan");

      const waktu = new Date().toLocaleTimeString("id-ID");
      const logName = activeSession 
        ? `Sesi CBB ${activeSession.column} oleh ${activeSession.coach?.profile?.namaLengkap}`
        : scanned?.nama || "Anggota";
        
      setLog(prev => [{ nama: logName, status: "✓", waktu }, ...prev]);
      setMessage(`✅ Absensi CBB berhasil dicatat!`);
      setScanned(null);
      setActiveSession(null);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>📷 Scan QR Absen Event CBB</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Arahkan kamera ke QR Code sesi CBB untuk mencatat kehadiran secara otomatis.
        </p>
      </div>

      <div className="responsive-grid">

        {/* Panel Kamera */}
        <div className={`glass-card ${isActive ? 'scanner-active-mode' : ''}`} style={{ padding: '24px', position: 'relative' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }} className="hide-on-scanner">Kamera Scanner</h3>

          {/* Container kamera */}
          <div
            id="qr-reader-container"
            className={isActive ? 'full-screen-scanner' : ''}
            style={{
              width: '100%',
              minHeight: '280px',
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid var(--border-glass)',
              marginBottom: '16px',
              position: 'relative',
            }}
          />

          {isActive && (
            <button 
              onClick={stopScanner}
              className="scanner-close-btn"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 101,
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)'
              }}
            >
              ✕
            </button>
          )}

          {/* Placeholder jika belum aktif */}
          {!isActive && !scanned && (
            <div style={{
              position: 'relative',
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginBottom: '8px',
              marginTop: '-248px',
              pointerEvents: 'none',
              zIndex: 1,
            }}>
              <div style={{ fontSize: '2.5rem' }}>📷</div>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Klik tombol di bawah untuk mulai</p>
            </div>
          )}

          {/* Spacer agar layout tidak goyang */}
          {!isActive && <div style={{ minHeight: '160px' }} />}

          {camError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', color: '#ef4444', marginBottom: '12px' }}>
              {camError}
            </div>
          )}

          {!isActive ? (
            <button
              onClick={startScanner}
              disabled={!!scanned}
              style={{
                width: '100%', padding: '12px',
                background: scanned ? 'var(--text-muted)' : 'var(--accent-primary)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontWeight: 700, fontSize: '0.9rem',
                cursor: scanned ? 'default' : 'pointer',
                opacity: scanned ? 0.5 : 1,
              }}
            >
              {scanned ? "✓ QR Berhasil Discan" : "Mulai Scan CBB"}
            </button>
          ) : (
            <div className="scanner-ui-overlay">
              <div className="scanner-target-box"></div>
              <p className="scanner-instruction">Arahkan kamera ke QR Code Sesi CBB</p>
              <button
                onClick={stopScanner}
                style={{
                  width: 'calc(100% - 40px)', padding: '16px',
                  background: '#ef4444',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                  position: 'absolute', bottom: '40px', left: '20px',
                  zIndex: 101, boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                Hentikan Kamera
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .responsive-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            align-items: start;
          }

          @media (max-width: 768px) {
            .responsive-grid {
              grid-template-columns: 1fr;
            }

            .full-screen-scanner {
              position: fixed !important;
              inset: 0 !important;
              z-index: 100 !important;
              height: 100vh !important;
              width: 100vw !important;
              border-radius: 0 !important;
              margin: 0 !important;
              border: none !important;
              background: #000 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }

            :global(.full-screen-scanner video) {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
            }

            /* Hide library's default UI elements */
            :global(.full-screen-scanner > div:first-child) {
              display: none !important;
            }

            .scanner-active-mode .hide-on-scanner {
              display: none;
            }

            .scanner-ui-overlay {
              position: fixed;
              inset: 0;
              z-index: 101;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              pointer-events: none;
            }
            
            .scanner-ui-overlay > * {
              pointer-events: auto;
            }

            .scanner-target-box {
              width: 260px;
              height: 260px;
              border: 3px solid var(--accent-primary);
              border-radius: 28px;
              box-shadow: 0 0 0 4000px rgba(0,0,0,0.6);
              position: relative;
              margin-top: -60px; /* Offset to center more visually */
            }

            .scanner-target-box::after {
              content: '';
              position: absolute;
              top: 0; left: 0; right: 0; height: 3px;
              background: var(--accent-primary);
              box-shadow: 0 0 15px var(--accent-primary);
              animation: scan-line 2.5s ease-in-out infinite;
            }

            @keyframes scan-line {
              0% { top: 5%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 95%; opacity: 0; }
            }

            .scanner-instruction {
              color: white;
              margin-top: 40px;
              font-weight: 700;
              text-shadow: 0 2px 8px rgba(0,0,0,0.8);
              background: rgba(14, 165, 233, 0.2);
              padding: 10px 24px;
              border-radius: 24px;
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255,255,255,0.1);
            }

            .scanner-close-btn {
              display: flex !important;
            }
          }

          .scanner-close-btn {
            display: none;
          }

          .scanner-ui-overlay {
            display: none;
          }
          
          @media (max-width: 768px) {
            .scanner-ui-overlay {
               display: flex;
            }
          }
        `}</style>



        {/* Panel Konfirmasi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loadingSession && (
             <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ fontSize: '2rem' }}>⌛</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Memuat informasi sesi CBB...</p>
             </div>
          )}

          {activeSession && !loadingSession && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>🎫 Sesi CBB Terdeteksi</h3>

              <div style={{ background: 'var(--bg-primary)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.05em' }}>PERTEMUAN CBB</p>
                <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{activeSession.column}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Pelatih: <strong>{activeSession.coach?.profile?.namaLengkap}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveSession(null)}
                  style={{
                    flex: 1, padding: '11px',
                    background: 'transparent', border: '1px solid var(--border-glass)',
                    color: 'var(--text-secondary)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer'
                  }}
                >Batal</button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 2, padding: '11px',
                    background: 'var(--accent-primary)', color: 'white',
                    border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  {saving ? "Memproses..." : "Konfirmasi Hadir CBB"}
                </button>
              </div>
            </div>
          )}

          {!scanned && !activeSession && !loadingSession && (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
              <p style={{ fontSize: '0.85rem' }}>Scan QR Code CBB dari Pelatih untuk absen otomatis</p>
            </div>
          )}

          {message && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px',
              background: message.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${message.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              fontSize: '0.875rem', fontWeight: 600,
              color: message.startsWith('✅') ? '#10b981' : '#ef4444'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Log Absensi */}
      {log.length > 0 && (
        <div className="glass-card" style={{ marginTop: '24px', padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>
            📋 Log Absensi CBB Sesi Ini — {log.length} Anggota
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {log.map((entry, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: 'var(--bg-primary)',
                borderRadius: '8px', fontSize: '0.875rem'
              }}>
                <span style={{ fontWeight: 600 }}>{entry.nama}</span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{
                    fontWeight: 700, fontSize: '0.75rem',
                    color: statusLabel[entry.status]?.color || '#94a3b8',
                    background: `${statusLabel[entry.status]?.color}22`,
                    padding: '3px 10px', borderRadius: '20px'
                  }}>
                    {statusLabel[entry.status]?.label || entry.status}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{entry.waktu}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
