"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Gagal mendaftar");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container animate-fade-in" style={{ maxWidth: '600px', textAlign: 'center', marginTop: '60px', position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{ 
          borderColor: 'var(--accent-secondary)',
          background: 'rgba(21, 30, 50, 0.6)',
          backdropFilter: 'blur(20px)',
          color: 'white'
        }}>
          <h2 style={{ color: 'var(--accent-secondary)', marginBottom: '16px', fontSize: '2rem' }}>Pendaftaran Berhasil!</h2>
          <p style={{ color: '#8b9bb4' }}>Akun Anda telah dibuat. Anda akan dialihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div className="glass-panel" style={{ 
        padding: '40px',
        background: 'rgba(21, 30, 50, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center', color: '#ffffff' }}>Pendaftaran Anggota</h2>
        <p style={{ textAlign: 'center', color: '#8b9bb4', marginBottom: '32px', fontSize: '1rem' }}>
          Lengkapi form di bawah ini untuk bergabung dengan club olahraga kami.
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-danger)', padding: '16px', marginBottom: '24px', borderRadius: '4px' }}>
            <p style={{ color: 'var(--accent-danger)', fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>EMAIL <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="email" name="email" required className="input-field" placeholder="email@contoh.com" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>PASSWORD <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required 
                  className="input-field" 
                  placeholder="Buat password" 
                  minLength={6} 
                  style={{ paddingRight: '50px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}
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
                    color: 'var(--text-muted)',
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
          </div>

          <h3 style={{ margin: '24px 0 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px', color: '#ffffff' }}>Biodata Diri</h3>
          
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Nama Lengkap <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="namaLengkap" required className="input-field" placeholder="Sesuai KTP" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Nama Panggilan <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="namaPanggilan" required className="input-field" placeholder="Nama panggilan" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Nomor Induk Kependudukan (NIK)</label>
              <input type="text" name="nik" className="input-field" placeholder="16 Digit NIK (Opsional)" pattern="[0-9]{16}" title="Masukkan 16 digit NIK" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Nomor HP <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="nomorHp" required className="input-field" placeholder="08..." style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Tempat Lahir <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="tempatLahir" required className="input-field" placeholder="Kota Kelahiran" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Tanggal Lahir <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="date" name="tanggalLahir" required className="input-field" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Jenis Kelamin <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <select name="jenisKelamin" required className="input-field" style={{ background: 'rgba(21, 30, 50, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <option value="" style={{ background: '#1e293b' }}>Pilih Jenis Kelamin</option>
                <option value="LAKI_LAKI" style={{ background: '#1e293b' }}>Laki-laki</option>
                <option value="PEREMPUAN" style={{ background: '#1e293b' }}>Perempuan</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Agama <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <select name="agama" required className="input-field" style={{ background: 'rgba(21, 30, 50, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <option value="" style={{ background: '#1e293b' }}>Pilih Agama</option>
                <option value="ISLAM" style={{ background: '#1e293b' }}>Islam</option>
                <option value="KRISTEN" style={{ background: '#1e293b' }}>Kristen</option>
                <option value="KATOLIK" style={{ background: '#1e293b' }}>Katolik</option>
                <option value="HINDU" style={{ background: '#1e293b' }}>Hindu</option>
                <option value="BUDDHA" style={{ background: '#1e293b' }}>Buddha</option>
                <option value="KONGHUCU" style={{ background: '#1e293b' }}>Konghucu</option>
                <option value="LAINNYA" style={{ background: '#1e293b' }}>Lainnya</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Tinggi Badan (cm) <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="number" name="tinggiBadan" required className="input-field" placeholder="Contoh: 170" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Berat Badan (kg) <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="number" name="beratBadan" required className="input-field" placeholder="Contoh: 60" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Sekolah Asal</label>
              <input type="text" name="sekolahAsal" className="input-field" placeholder="Nama sekolah" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#8b9bb4' }}>Alamat Lengkap <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
            <textarea name="alamat" required className="input-field" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan" rows={3} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}></textarea>
          </div>

          <h3 style={{ margin: '24px 0 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px', color: '#ffffff' }}>Data Orang Tua</h3>
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Nama Ayah</label>
              <input type="text" name="namaAyah" className="input-field" placeholder="Nama lengkap ayah (Opsional)" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#8b9bb4' }}>Nama Ibu</label>
              <input type="text" name="namaIbu" className="input-field" placeholder="Nama lengkap ibu (Opsional)" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }} />
            </div>
          </div>

          <h3 style={{ margin: '24px 0 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px', color: '#ffffff' }}>Peran Pendaftar</h3>
          <div className="input-group">
            <label className="input-label" style={{ color: '#8b9bb4' }}>Daftar Sebagai</label>
            <select name="role" required className="input-field" style={{ background: 'rgba(21, 30, 50, 0.8)', border: '2px solid var(--accent-primary)', color: 'white' }}>
              <option value="SISWA" style={{ background: '#1e293b' }}>Siswa (Anggota Baru)</option>
              <option value="SENIOR" style={{ background: '#1e293b' }}>Senior</option>
            </select>
          </div>

          <div style={{ marginTop: '32px' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
              {loading ? "Memproses..." : "Selesaikan Pendaftaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
