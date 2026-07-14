"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserEditForm({ user, roleLabel, redirectUrl }: { user: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, roleLabel: string, redirectUrl: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [foto, setFoto] = useState<string | null>(user.profile?.foto || null);
  const [dokKK, setDokKK] = useState<string | null>(user.profile?.dokumenKK || null);
  const [dokAkte, setDokAkte] = useState<string | null>(user.profile?.dokumenAkte || null);
  const [dokKtp, setDokKtp] = useState<string | null>(user.profile?.dokumenKtp || null);
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null);

  const handleDeleteDoc = async (field: 'foto' | 'dokumenKK' | 'dokumenAkte' | 'dokumenKtp', label: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${label}?`)) return;
    setDeletingDoc(field);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: null }),
      });
      if (!res.ok) throw new Error(`Gagal menghapus ${label}`);
      if (field === 'foto') setFoto(null);
      if (field === 'dokumenKK') setDokKK(null);
      if (field === 'dokumenAkte') setDokAkte(null);
      if (field === 'dokumenKtp') setDokKtp(null);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      alert(err.message);
    } finally {
      setDeletingDoc(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Handle file uploads
      const uploadFile = async (fileKey: string, type: string) => {
        const file = formData.get(fileKey) as File;
        if (file && file.size > 0) {
          const uploadData = new FormData();
          uploadData.append('file', file);
          uploadData.append('type', type);
          
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData,
          });
          
          const uploadResult = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadResult.error || `Gagal upload ${type}`);
          return uploadResult.url;
        }
        return undefined;
      };

      const fotoUrl = await uploadFile('fileFoto', 'Foto');
      if (fotoUrl) data.foto = fotoUrl;

      const dokumenKKUrl = await uploadFile('fileKK', 'KK');
      if (dokumenKKUrl) data.dokumenKK = dokumenKKUrl;
      
      const dokumenAkteUrl = await uploadFile('fileAkte', 'Akte');
      if (dokumenAkteUrl) data.dokumenAkte = dokumenAkteUrl;
      
      const dokumenKtpUrl = await uploadFile('fileKtp', 'Ktp');
      if (dokumenKtpUrl) data.dokumenKtp = dokumenKtpUrl;

      // Clean up file inputs from JSON data
      delete data.fileFoto;
      delete data.fileKK;
      delete data.fileAkte;
      delete data.fileKtp;

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
          
          {/* Foto Profil 3x4 Section */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '24px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '6px' }}>Foto Profil 3x4 (Opsional)</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Unggah pas foto ukuran 3x4. Format gambar (JPG, JPEG, PNG) dengan ukuran maksimal 2MB.
              </p>
              <input 
                type="file" 
                name="fileFoto" 
                accept="image/jpeg,image/png,image/jpg" 
                className="input-field" 
                style={{ padding: '8px', cursor: 'pointer', background: 'var(--bg-secondary)' }} 
              />
              {foto && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <a href={foto} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    👁️ Lihat Foto
                  </a>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteDoc('foto', 'Foto Profil')} 
                    disabled={deletingDoc === 'foto'}
                    className="btn"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    {deletingDoc === 'foto' ? 'Menghapus...' : '🗑️ Hapus Foto'}
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '105px', flexShrink: 0, margin: '0 auto' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pratinjau</span>
              <div style={{ 
                width: '90px', 
                height: '120px', 
                borderRadius: '6px', 
                border: '2px solid var(--border-glass)', 
                overflow: 'hidden', 
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative'
              }}>
                {foto ? (
                  <img src={foto} alt="Foto Profil 3x4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <span style={{ fontSize: '1.8rem', display: 'block' }}>👤</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>3 x 4</span>
                  </div>
                )}
              </div>
            </div>
          </div>

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
              
              <h3 style={{ margin: '24px 0 16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', fontSize: '1.1rem' }}>Dokumen Pendukung (Opsional)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Format file: PDF, JPG, PNG. Maksimal 2MB.</p>
              
              <div className="grid-cols-2">
                {/* KK */}
                <div className="input-group">
                  <label className="input-label">Kartu Keluarga (KK)</label>
                  {dokKK ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600, flex: 1 }}>✓ Dokumen KK tersimpan</span>
                      <a href={dokKK} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Lihat</a>
                      <button type="button" onClick={() => handleDeleteDoc('dokumenKK', 'KK')} disabled={deletingDoc === 'dokumenKK'} style={{ fontSize: '0.8rem', color: 'var(--accent-danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                        {deletingDoc === 'dokumenKK' ? '...' : 'Hapus'}
                      </button>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Belum ada dokumen</p>
                  )}
                  <input type="file" name="fileKK" accept=".pdf,image/jpeg,image/png,image/jpg" className="input-field" style={{ padding: '8px', cursor: 'pointer' }} />
                </div>

                {/* Akte */}
                <div className="input-group">
                  <label className="input-label">Akte Kelahiran</label>
                  {dokAkte ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600, flex: 1 }}>✓ Dokumen Akte tersimpan</span>
                      <a href={dokAkte} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Lihat</a>
                      <button type="button" onClick={() => handleDeleteDoc('dokumenAkte', 'Akte')} disabled={deletingDoc === 'dokumenAkte'} style={{ fontSize: '0.8rem', color: 'var(--accent-danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                        {deletingDoc === 'dokumenAkte' ? '...' : 'Hapus'}
                      </button>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Belum ada dokumen</p>
                  )}
                  <input type="file" name="fileAkte" accept=".pdf,image/jpeg,image/png,image/jpg" className="input-field" style={{ padding: '8px', cursor: 'pointer' }} />
                </div>

                {/* KTP */}
                <div className="input-group">
                  <label className="input-label">KTP / Kartu Pelajar</label>
                  {dokKtp ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600, flex: 1 }}>✓ Dokumen KTP tersimpan</span>
                      <a href={dokKtp} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Lihat</a>
                      <button type="button" onClick={() => handleDeleteDoc('dokumenKtp', 'KTP/Kartu Pelajar')} disabled={deletingDoc === 'dokumenKtp'} style={{ fontSize: '0.8rem', color: 'var(--accent-danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                        {deletingDoc === 'dokumenKtp' ? '...' : 'Hapus'}
                      </button>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Belum ada dokumen</p>
                  )}
                  <input type="file" name="fileKtp" accept=".pdf,image/jpeg,image/png,image/jpg" className="input-field" style={{ padding: '8px', cursor: 'pointer' }} />
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
