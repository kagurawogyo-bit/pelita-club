"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email Check, 2: New Password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Email tidak ditemukan");
      }

      setStep(2);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal mereset password");
      }

      setMessage("Password berhasil diperbarui! Silakan login kembali.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '450px', margin: '0 auto' }}>
      <div style={{
        background: 'rgba(21, 30, 50, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
            {step === 1 ? "Lupa Password?" : "Atur Password Baru"}
          </h2>
          <p style={{ color: '#8b9bb4', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {step === 1 
              ? "Masukkan email Anda untuk memulihkan akun." 
              : "Masukkan password baru yang kuat untuk akun " + email}
          </p>
        </div>

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981', padding: '16px', marginBottom: '24px', borderRadius: '4px' }}>
            <p style={{ color: '#10b981', fontSize: '0.9rem' }}>{message}</p>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-danger)', padding: '16px', marginBottom: '24px', borderRadius: '4px' }}>
            <p style={{ color: 'var(--accent-danger)', fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleCheckEmail}>
            <div className="input-group" style={{ marginBottom: '32px' }}>
              <label className="input-label" style={{ color: '#8b9bb4' }}>EMAIL AKUN</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontWeight: 800 }}>
              {loading ? "MENGECEK..." : "LANJUTKAN"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label className="input-label" style={{ color: '#8b9bb4' }}>PASSWORD BARU</label>
              <input 
                type="password" 
                required 
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Buat password baru"
                className="input-field"
              />
            </div>
            <div className="input-group" style={{ marginBottom: '32px' }}>
              <label className="input-label" style={{ color: '#8b9bb4' }}>KONFIRMASI PASSWORD</label>
              <input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontWeight: 800 }}>
              {loading ? "MEMPROSES..." : "SIMPAN PASSWORD"}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
            Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
}
