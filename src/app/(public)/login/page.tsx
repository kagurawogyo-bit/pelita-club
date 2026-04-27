"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== num1 + num2) {
      setError("Jawaban keamanan salah. Silakan coba lagi.");
      generateCaptcha();
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Gagal masuk");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '420px', margin: '0 auto' }}>
      <div style={{
        background: 'rgba(5, 10, 28, 0.75)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '44px 40px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        {/* Header dengan logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '84px', height: '84px',
            background: 'white',
            borderRadius: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(249,115,22,0.2)',
            overflow: 'hidden', padding: '8px'
          }}>
            <img   src="/images/logo.png" alt="Logo Pelita" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{
            fontSize: '1.6rem', fontWeight: 900,
            color: 'white', marginBottom: '4px',
            letterSpacing: '-0.02em'
          }}>DATA ADMINISTRASI</h2>
          <p style={{
            fontSize: '0.8rem', color: 'rgba(249,115,22,0.9)',
            fontWeight: 700, letterSpacing: '0.18em'
          }}>PELITA BONDOWOSO</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', borderLeft: '3px solid #ef4444', padding: '14px 16px', marginBottom: '20px', borderRadius: '8px' }}>
            <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(148,163,184,0.9)', letterSpacing: '0.1em' }}>EMAIL</label>
            <input
              type="email" name="email" required
              className="input-field"
              placeholder="Masukkan email"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '12px',
              }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(148,163,184,0.9)', letterSpacing: '0.1em' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password" required
                className="input-field"
                placeholder="Masukkan password"
                style={{
                  paddingRight: '50px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '12px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(148,163,184,0.7)',
                  cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <a href="/forgot-password" style={{ color: 'rgba(249,115,22,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>
              Lupa password?
            </a>
          </div>

          <div className="input-group" style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(148,163,184,0.9)', letterSpacing: '0.1em' }}>
              KEAMANAN: BERAPA HASIL {num1} + {num2}? <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="number" required
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              className="input-field"
              placeholder="Masukkan jawaban"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '12px',
              }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? "MEMPROSES..." : "MASUK"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', color: 'rgba(148,163,184,0.7)', fontSize: '0.875rem' }}>
          Belum punya akun?{' '}
          <a href="/register" style={{ color: '#38bdf8', fontWeight: 700 }}>Daftar</a>
        </p>
      </div>
    </div>
  );
}
