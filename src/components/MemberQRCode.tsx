"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";

interface MemberQRCodeProps {
  userId: string;
  nama: string;
  role: string;
}

export default function MemberQRCode({ userId, nama, role }: MemberQRCodeProps) {
  const qrData = JSON.stringify({ userId, nama, role });
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `QR-${nama.replace(/\s+/g, "-")}.png`;
      a.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const roleLabel: Record<string, string> = {
    SISWA: "Siswa",
    SENIOR: "Senior",
    PENGURUS: "Pengurus",
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-glass)',
      borderRadius: '16px',
      padding: '28px',
      textAlign: 'center',
      maxWidth: '280px',
    }}>
      <h4 style={{ fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
        QR Code Anggota
      </h4>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Tunjukkan kode ini saat absensi
      </p>

      {/* QR Code Box */}
      <div ref={qrRef} style={{
        background: 'white',
        padding: '16px',
        borderRadius: '12px',
        display: 'inline-block',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <QRCode
          value={qrData}
          size={180}
          bgColor="#ffffff"
          fgColor="#0f172a"
          level="M"
        />
      </div>

      {/* Nama & Role */}
      <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '2px' }}>
        {nama}
      </p>
      <p style={{
        fontSize: '0.75rem', fontWeight: 600,
        color: 'var(--accent-primary)',
        background: 'rgba(14,165,233,0.1)',
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '20px',
        marginBottom: '16px'
      }}>
        {roleLabel[role] || role}
      </p>

      {/* Tombol Download */}
      <div>
        <button
          onClick={handleDownload}
          style={{
            width: '100%',
            padding: '10px',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download QR
        </button>
      </div>
    </div>
  );
}
