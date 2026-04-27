"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserEditForm({ user, roleLabel, redirectUrl }: { user: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, roleLabel: string, redirectUrl: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Gagal memperbarui data");

      router.push(redirectUrl);
      router.refresh();
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => router.back()} className="btn btn-outline" style={{ padding: '8px 12px' }}>← Kembali</button>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Edit Data {roleLabel}</h2>
      </div>

      <div className="glass-panel">
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-danger)', padding: '16px', marginBottom: '24px', borderRadius: '4px' }}>
            <p style={{ color: 'var(--accent-danger)' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email (Tidak dapat diubah)</label>
            <input type="email" value={user.email} disabled className="input-field" style={{ opacity: 0.6 }} />
          </div>

          <h3 style={{ margin: '24px 0 16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', fontSize: '1.1rem' }}>Biodata Diri</h3>
          
          <div className="grid-cols-2">
            <div className="input-group">
              <label className="input-label">Nama Lengkap <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="namaLengkap" defaultValue={user.profile?.namaLengkap || ""} required className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">Nama Panggilan <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="namaPanggilan" defaultValue={user.profile?.namaPanggilan || ""} required className="input-field" />
            </div>
            
            <div className="input-group">
              <label className="input-label">NIK (Opsional)</label>
              <input type="text" name="nik" defaultValue={user.profile?.nik || ""} className="input-field" pattern="[0-9]{16}" title="NIK harus 16 digit angka" />
            </div>
            <div className="input-group">
              <label className="input-label">Asal Sekolah</label>
              <input type="text" name="sekolahAsal" defaultValue={user.profile?.sekolahAsal || ""} className="input-field" placeholder="Nama sekolah" />
            </div>
            <div className="input-group">
              <label className="input-label">Nomor HP <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="nomorHp" defaultValue={user.profile?.nomorHp || ""} required className="input-field" />
            </div>

            <div className="input-group">
              <label className="input-label">Tempat Lahir <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="text" name="tempatLahir" defaultValue={user.profile?.tempatLahir || ""} required className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">Tanggal Lahir <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="date" name="tanggalLahir" defaultValue={user.profile?.tanggalLahir ? new Date(user.profile.tanggalLahir).toISOString().split('T')[0] : ""} required className="input-field" />
            </div>

            <div className="input-group">
              <label className="input-label">Jenis Kelamin <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <select name="jenisKelamin" defaultValue={user.profile?.jenisKelamin || ""} required className="input-field" style={{ background: 'var(--bg-primary)' }}>
                <option value="">Pilih Jenis Kelamin</option>
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Agama <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <select name="agama" defaultValue={user.profile?.agama || ""} required className="input-field" style={{ background: 'var(--bg-primary)' }}>
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
              <input type="number" name="tinggiBadan" defaultValue={user.profile?.tinggiBadan || ""} required className="input-field" />
            </div>
            <div className="input-group">
              <label className="input-label">Berat Badan (kg) <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
              <input type="number" name="beratBadan" defaultValue={user.profile?.beratBadan || ""} required className="input-field" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Alamat Lengkap <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
            <textarea name="alamat" defaultValue={user.profile?.alamat || ""} required className="input-field" rows={3}></textarea>
          </div>

          {user.role === "SISWA" && (
            <>
              <h3 style={{ margin: '24px 0 16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', fontSize: '1.1rem' }}>Data Orang Tua</h3>
              <div className="grid-cols-2">
                <div className="input-group">
                  <label className="input-label">Nama Ayah (Opsional)</label>
                  <input type="text" name="namaAyah" defaultValue={user.profile?.namaAyah || ""} className="input-field" />
                </div>
                <div className="input-group">
                  <label className="input-label">Nama Ibu (Opsional)</label>
                  <input type="text" name="namaIbu" defaultValue={user.profile?.namaIbu || ""} className="input-field" />
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.back()} className="btn btn-outline">Batal</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
