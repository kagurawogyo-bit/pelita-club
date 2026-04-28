"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
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
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            padding: '8px'
          }}>
            <img   src="/images/logo.png" alt="Logo Pelita" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>

        <h1 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px', letterSpacing: '1px' }}>DATA ADMINISTRASI</h1>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#8b9bb4', marginBottom: '40px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>PELITA BONDOWOSO</p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-danger)', padding: '16px', marginBottom: '24px', borderRadius: '4px' }}>
            <p style={{ color: 'var(--accent-danger)', fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" style={{ color: '#8b9bb4' }}>EMAIL</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="Masukkan email"
              className="input-field"
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: '8px' }}>
            <label className="input-label" style={{ color: '#8b9bb4' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                required 
                placeholder="Masukkan password"
                className="input-field"
                style={{ paddingRight: '50px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8b9bb4',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <a href="/forgot-password" style={{ color: '#8b9bb4', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Lupa password?
            </a>
          </div>

          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label className="input-label" style={{ color: '#8b9bb4' }}>
              KEAMANAN: BERAPA HASIL {num1} + {num2}? <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="number" 
              required 
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="Masukkan jawaban"
              className="input-field"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}
          >
            {loading ? "MEMPROSES..." : "MASUK"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ color: '#8b9bb4', fontSize: '0.9rem' }}>
            Belum punya akun? <a href="/register" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>Daftar</a>
          </p>
        </div>
      </div>
    </div>
  );
}
