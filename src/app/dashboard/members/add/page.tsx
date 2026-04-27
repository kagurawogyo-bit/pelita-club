"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMemberPage() {
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
    
    // Default values for admin-added students
    data.role = "SISWA";
    if (!data.password) data.password = "siswa123";

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Gagal menambahkan siswa");
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/members"), 2000);
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
          <h2 style={{ color: 'var(--accent-secondary)', marginBottom: '16px', fontSize: '1.8rem' }}>Siswa Berhasil Ditambahkan!</h2>
          <p>Mengarahkan kembali ke Data Siswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Tambah Siswa Baru</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Input data siswa baru ke dalam sistem manajemen.</p>
        </div>
        <button onClick={() => router.back()} className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}>
          ← Kembali
        </button>
      </div>

      <div className="form-card">
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-danger)', padding: '16px', marginBottom: '32px', borderRadius: '8px' }}>
            <p style={{ color: 'var(--accent-danger)', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="section-divider">
            <span>Informasi Akun</span>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Email Siswa</label>
              <input type="email" name="email" required className="input-field" placeholder="contoh: budi@gmail.com" />
            </div>
            <div className="input-group">
              <label className="input-label">Password (Opsional)</label>
              <input type="text" name="password" className="input-field" placeholder="Default: siswa123" minLength={6} />
            </div>
          </div>

          <div className="section-divider">
            <span>Biodata Diri</span>
          </div>
          
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Nama Lengkap</label>
              <input type="text" name="namaLengkap" required className="input-field" placeholder="Sesuai Akta/KTP" />
            </div>
            <div className="input-group">
              <label className="input-label">Nama Panggilan</label>
              <input type="text" name="namaPanggilan" required className="input-field" placeholder="Nama panggilan" />
            </div>
            
            <div className="input-group">
              <label className="input-label">NIK (Opsional)</label>
              <input type="text" name="nik" className="input-field" placeholder="Masukkan 16 digit NIK" pattern="[0-9]{16}" title="Masukkan 16 digit NIK" />
            </div>
            <div className="input-group">
              <label className="input-label">Sekolah Asal</label>
              <input type="text" name="sekolahAsal" className="input-field" placeholder="Nama sekolah" />
            </div>
            <div className="input-group">
              <label className="input-label">Nomor WhatsApp</label>
              <input type="text" name="nomorHp" required className="input-field" placeholder="Contoh: 08123456789" />
            </div>

            <div className="input-group">
              <label className="input-label">Tempat Lahir</label>
              <input type="text" name="tempatLahir" required className="input-field" placeholder="Kota Kelahiran" />
            </div>
            <div className="input-group">
              <label className="input-label">Tanggal Lahir</label>
              <input type="date" name="tanggalLahir" required className="input-field" />
            </div>

            <div className="input-group">
              <label className="input-label">Jenis Kelamin</label>
              <select name="jenisKelamin" required className="input-field">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Agama</label>
              <select name="agama" required className="input-field">
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
              <label className="input-label">Tinggi Badan (cm)</label>
              <input type="number" name="tinggiBadan" required className="input-field" placeholder="Contoh: 160" />
            </div>
            <div className="input-group">
              <label className="input-label">Berat Badan (kg)</label>
              <input type="number" name="beratBadan" required className="input-field" placeholder="Contoh: 55" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Alamat Lengkap</label>
            <textarea name="alamat" required className="input-field" placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan" rows={3}></textarea>
          </div>

          <div className="section-divider">
            <span>Data Orang Tua</span>
          </div>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Nama Ayah (Opsional)</label>
              <input type="text" name="namaAyah" className="input-field" placeholder="Nama lengkap ayah" />
            </div>
            <div className="input-group">
              <label className="input-label">Nama Ibu (Opsional)</label>
              <input type="text" name="namaIbu" className="input-field" placeholder="Nama lengkap ibu" />
            </div>
          </div>

          <div style={{ marginTop: '48px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.back()} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
              Batalkan
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '200px' }}>
              {loading ? "Menyimpan..." : "Simpan Data Siswa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
