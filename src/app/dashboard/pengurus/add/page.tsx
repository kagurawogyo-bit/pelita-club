"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPengurusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    data.role = "PENGURUS";
    if (!data.password) data.password = "pengurus123";

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Gagal menambahkan pengurus");
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/pengurus"), 2000);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ borderColor: 'var(--accent-secondary)' }}>
          <h2 style={{ color: 'var(--accent-secondary)', marginBottom: '16px', fontSize: '1.8rem' }}>Pengurus Berhasil Ditambahkan!</h2>
          <p>Mengarahkan kembali...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => router.back()} className="btn btn-outline" style={{ padding: '8px 12px' }}>← Kembali</button>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Tambah Pengurus Baru</h2>
      </div>

      <div className="glass-panel">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Input data pengurus baru ke dalam sistem. Password default akan diatur sebagai <strong>pengurus123</strong>.
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-danger)', padding: '16px', marginBottom: '24px', borderRadius: '4px' }}>
            <p style={{ color: 'var(--accent-danger)' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label">Email Pengurus</label>
              <input type="email" name="email" required className="input-field" placeholder="email@contoh.com" />
            </div>
            <div className="input-group">
              <label className="input-label">Password (Opsional)</label>
              <input type="text" name="password" className="input-field" placeholder="Biarkan kosong untuk pengurus123" minLength={6} />
            </div>
          </div>

          <h3 style={{ margin: '24px 0 16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', fontSize: '1.1rem' }}>Biodata Diri</h3>
          
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label">Nama Lengkap <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="namaLengkap" required className="input-field" placeholder="Sesuai KTP" />
            </div>
            <div className="input-group">
              <label className="input-label">Nama Panggilan <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="namaPanggilan" required className="input-field" placeholder="Nama panggilan" />
            </div>
            
            <div className="input-group">
              <label className="input-label">Nomor Induk Kependudukan (NIK) (Opsional)</label>
              <input type="text" name="nik" className="input-field" placeholder="16 Digit NIK" pattern="[0-9]{16}" title="Masukkan 16 digit NIK" />
            </div>
            <div className="input-group">
              <label className="input-label">Nomor HP <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="nomorHp" required className="input-field" placeholder="08..." />
            </div>

            <div className="input-group">
              <label className="input-label">Tempat Lahir <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="tempatLahir" required className="input-field" placeholder="Kota Kelahiran" />
            </div>
            <div className="input-group">
              <label className="input-label">Tanggal Lahir <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="date" name="tanggalLahir" required className="input-field" />
            </div>

            <div className="input-group">
              <label className="input-label">Jenis Kelamin <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <select name="jenisKelamin" required className="input-field" style={{ background: 'var(--bg-primary)' }}>
                <option value="">Pilih Jenis Kelamin</option>
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Agama <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <select name="agama" required className="input-field" style={{ background: 'var(--bg-primary)' }}>
                <option value="">Pilih Agama</option>
                <option value="ISLAM">Islam</option>
                <option value="KRISTEN">Kristen</option>
                <option value="KATOLIK">Katolik</option>
                <option value="HINDU">Hindu</option>
                <option value="BUDDHA">Buddha</option>
                <option value="KONGHUCU">Konghucu</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Tinggi Badan (cm) <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="number" name="tinggiBadan" required className="input-field" placeholder="Contoh: 170" />
            </div>
            <div className="input-group">
              <label className="input-label">Berat Badan (kg) <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="number" name="beratBadan" required className="input-field" placeholder="Contoh: 60" />
            </div>
            <div className="input-group">
              <label className="input-label">Sekolah Asal</label>
              <input type="text" name="sekolahAsal" className="input-field" placeholder="Nama sekolah" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Alamat Lengkap <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
            <textarea name="alamat" required className="input-field" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan" rows={3}></textarea>
          </div>

          <h3 style={{ margin: '24px 0 16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', fontSize: '1.1rem' }}>Data Orang Tua</h3>
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label">Nama Ayah (Opsional)</label>
              <input type="text" name="namaAyah" className="input-field" placeholder="Nama lengkap ayah" />
            </div>
            <div className="input-group">
              <label className="input-label">Nama Ibu (Opsional)</label>
              <input type="text" name="namaIbu" className="input-field" placeholder="Nama lengkap ibu" />
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.back()} className="btn btn-outline" style={{ padding: '12px 24px' }}>
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px 24px', minWidth: '150px' }}>
              {loading ? "Menyimpan..." : "Simpan Pengurus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
