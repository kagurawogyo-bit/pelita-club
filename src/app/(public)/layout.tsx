import React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-auth-bg">
      {/* Logo watermark pojok kanan bawah */}
      <div className="logo-watermark" />

      {/* Elemen dekoratif bola basket - kiri atas */}
      <div style={{
        position: 'fixed', top: '-60px', left: '-60px',
        width: '280px', height: '280px',
        borderRadius: '50%',
        border: '2px solid rgba(249, 115, 22, 0.12)',
        zIndex: 0, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', top: '20px', left: '20px',
        width: '160px', height: '160px',
        borderRadius: '50%',
        border: '1px solid rgba(249, 115, 22, 0.08)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Elemen dekoratif bola basket - kanan atas */}
      <div style={{
        position: 'fixed', top: '100px', right: '-80px',
        width: '300px', height: '300px',
        borderRadius: '50%',
        border: '2px solid rgba(14, 165, 233, 0.10)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Garis lapangan basket dekoratif */}
      <div style={{
        position: 'fixed', bottom: '0', left: '50%',
        transform: 'translateX(-50%)',
        width: '400px', height: '200px',
        borderRadius: '400px 400px 0 0',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderBottom: 'none',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div className="auth-container">
        {children}
      </div>
    </div>
  );
}
