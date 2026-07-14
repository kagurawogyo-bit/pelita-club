"use client";

import { useRouter } from "next/navigation";

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '0.78rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.95rem', color: '#111', borderBottom: '1px solid #ddd', paddingBottom: '6px' }}>
        {value || '-'}
      </div>
    </div>
  );
}

function DocBadge({ label, url, filename }: { label: string; url: string; filename: string }) {
  const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(filename)}`;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', border: '1px solid #3b82f6', borderRadius: '8px', overflow: 'hidden' }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: '#f0f7ff',
          color: '#1d4ed8',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 600,
          borderRight: '1px solid #93c5fd',
        }}
      >
        📄 {label}
      </a>
      <a
        href={downloadUrl}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 14px',
          background: '#dbeafe',
          color: '#1d4ed8',
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: 700,
        }}
        title={`Unduh ${label}`}
      >
        ⬇️ Unduh
      </a>
    </div>
  );
}

export default function PrintBiodata({ user }: { user: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) {
  const router = useRouter();
  const p = user.profile;

  const formatDate = (d?: Date | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-";

  const currentYear = new Date().getFullYear();
  let umur = "-";
  if (p?.tanggalLahir) {
    umur = `${currentYear - new Date(p.tanggalLahir).getFullYear()} tahun`;
  }

  const jenisKelamin = p?.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : p?.jenisKelamin === "PEREMPUAN" ? "Perempuan" : "-";

  const hasDokumen = p?.dokumenKK || p?.dokumenAkte || p?.dokumenKtp;
  const hasAnyFile = p?.foto || p?.dokumenKK || p?.dokumenAkte || p?.dokumenKtp;

  return (
    <div className="animate-fade-in">
      {/* Action Bar - Hidden on print */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => router.back()} className="btn btn-outline" style={{ padding: '8px 12px' }}>
          ← Kembali
        </button>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, flex: 1 }}>Biodata Siswa</h2>
        <button
          onClick={() => window.print()}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          🖨️ Cetak Biodata
        </button>
        <a
          href={`/dashboard/members/edit/${user.id}`}
          className="btn btn-outline"
          style={{ padding: '10px 20px' }}
        >
          ✏️ Edit Data
        </a>
      </div>

      {/* Panel Unduh Dokumen — Admin Only, Hidden on Print */}
      {hasAnyFile && (
        <div className="no-print" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.25rem' }}>📂</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Dokumen Lampiran</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Daftar dokumen pendukung siswa yang telah diunggah</span>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {/* Foto Profil */}
            {p?.foto && (
              <div className="glass-card" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '36px', height: '48px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-glass)', flexShrink: 0 }}>
                    <img src={p.foto} alt="Foto Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Foto Profil</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Pas Foto 3×4</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <a
                    href={p.foto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action-view"
                    title="Buka Foto"
                  >
                    👁️
                  </a>
                  <a
                    href={`/api/download?url=${encodeURIComponent(p.foto)}&name=${encodeURIComponent(`Foto_${p?.namaLengkap || 'profil'}.jpg`)}`}
                    className="btn-action-download"
                    title="Unduh Foto"
                  >
                    ⬇️
                  </a>
                </div>
              </div>
            )}

            {/* Kartu Keluarga */}
            {p?.dokumenKK && (
              <div className="glass-card" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1px solid rgba(59, 130, 246, 0.2)', flexShrink: 0 }}>
                    📄
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Kartu Keluarga (KK)</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Dokumen KK</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <a
                    href={p.dokumenKK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action-view"
                    title="Buka KK"
                  >
                    👁️
                  </a>
                  <a
                    href={`/api/download?url=${encodeURIComponent(p.dokumenKK)}&name=${encodeURIComponent(`KK_${p?.namaLengkap || 'siswa'}.${p.dokumenKK.split('.').pop()?.split('?')[0] || 'jpg'}`)}`}
                    className="btn-action-download"
                    title="Unduh KK"
                  >
                    ⬇️
                  </a>
                </div>
              </div>
            )}

            {/* Akte Kelahiran */}
            {p?.dokumenAkte && (
              <div className="glass-card" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1px solid rgba(16, 185, 129, 0.2)', flexShrink: 0 }}>
                    📄
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Akte Kelahiran</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Dokumen Akte</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <a
                    href={p.dokumenAkte}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action-view"
                    title="Buka Akte"
                  >
                    👁️
                  </a>
                  <a
                    href={`/api/download?url=${encodeURIComponent(p.dokumenAkte)}&name=${encodeURIComponent(`Akte_${p?.namaLengkap || 'siswa'}.${p.dokumenAkte.split('.').pop()?.split('?')[0] || 'jpg'}`)}`}
                    className="btn-action-download"
                    title="Unduh Akte"
                  >
                    ⬇️
                  </a>
                </div>
              </div>
            )}

            {/* KTP / Kartu Pelajar */}
            {p?.dokumenKtp && (
              <div className="glass-card" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1px solid rgba(245, 158, 11, 0.2)', flexShrink: 0 }}>
                    📄
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>KTP / Kartu Pelajar</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Identitas Diri</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <a
                    href={p.dokumenKtp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action-view"
                    title="Buka KTP"
                  >
                    👁️
                  </a>
                  <a
                    href={`/api/download?url=${encodeURIComponent(p.dokumenKtp)}&name=${encodeURIComponent(`KTP_${p?.namaLengkap || 'siswa'}.${p.dokumenKtp.split('.').pop()?.split('?')[0] || 'jpg'}`)}`}
                    className="btn-action-download"
                    title="Unduh KTP"
                  >
                    ⬇️
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Print-ready card */}
      <div
        id="print-area"
        style={{
          background: 'white',
          color: '#111',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          maxWidth: '900px',
          margin: '0 auto',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '2px solid #2563eb', paddingBottom: '20px', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px', flexShrink: 0 }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em' }}>DATA PELITA BONDOWOSO</div>
            <div style={{ fontSize: '0.9rem', color: '#2563eb', marginTop: '2px' }}>Formulir Biodata Anggota</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: '0.8rem', color: '#666' }}>
            <div>Dicetak pada</div>
            <div style={{ fontWeight: 600 }}>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Name badge */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', marginBottom: '32px' }}>
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: 'white', borderRadius: '10px', padding: '20px 28px' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {p?.namaLengkap || '-'}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.85, marginTop: '4px' }}>
              {p?.namaPanggilan ? `"${p.namaPanggilan}"` : ''} · {jenisKelamin} · {umur}
            </div>
          </div>

          {/* Foto Profil 3x4 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <div style={{
              width: '90px',
              height: '120px',
              border: '2px solid #cbd5e1',
              borderRadius: '6px',
              overflow: 'hidden',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {p?.foto ? (
                <img src={p.foto} alt="Foto Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '4px' }}>
                  <span style={{ fontSize: '1.6rem', display: 'block' }}>👤</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 600, display: 'block' }}>FOTO 3x4</span>
                </div>
              )}
            </div>
            <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pas Foto</span>
          </div>
        </div>

        {/* Data grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
          {/* Left column */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
              Data Pribadi
            </div>
            <InfoField label="Nama Lengkap" value={p?.namaLengkap?.toUpperCase()} />
            <InfoField label="Nama Panggilan" value={p?.namaPanggilan} />
            <InfoField label="Tempat Lahir" value={p?.tempatLahir} />
            <InfoField label="Tanggal Lahir" value={formatDate(p?.tanggalLahir)} />
            <InfoField label="Jenis Kelamin" value={jenisKelamin} />
            <InfoField label="Agama" value={p?.agama} />
            <InfoField label="NIK" value={p?.nik} />
            <InfoField label="Nomor HP" value={p?.nomorHp} />
          </div>

          {/* Right column */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
              Data Tambahan
            </div>
            <InfoField label="Tinggi Badan" value={p?.tinggiBadan ? `${p.tinggiBadan} cm` : undefined} />
            <InfoField label="Berat Badan" value={p?.beratBadan ? `${p.beratBadan} kg` : undefined} />
            <InfoField label="Asal Sekolah" value={p?.sekolahAsal} />
            <InfoField label="Nama Ayah" value={p?.namaAyah} />
            <InfoField label="Nama Ibu" value={p?.namaIbu} />
            <InfoField label="Email Akun" value={user.email} />
          </div>
        </div>

        {/* Alamat */}
        <div style={{ marginTop: '20px' }}>
          <InfoField label="Alamat Lengkap" value={p?.alamat} />
        </div>

        {/* Dokumen Pendukung */}
        {hasDokumen && (
          <div className="no-print" style={{ marginTop: '28px', borderTop: '2px solid #e2e8f0', paddingTop: '24px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Dokumen Pendukung
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {p?.dokumenKK && <DocBadge label="Kartu Keluarga (KK)" url={p.dokumenKK} filename={`KK_${p?.namaLengkap || 'siswa'}.${p.dokumenKK.split('.').pop()?.split('?')[0] || 'jpg'}`} />}
              {p?.dokumenAkte && <DocBadge label="Akte Kelahiran" url={p.dokumenAkte} filename={`Akte_${p?.namaLengkap || 'siswa'}.${p.dokumenAkte.split('.').pop()?.split('?')[0] || 'jpg'}`} />}
              {p?.dokumenKtp && <DocBadge label="KTP / Kartu Pelajar" url={p.dokumenKtp} filename={`KTP_${p?.namaLengkap || 'siswa'}.${p.dokumenKtp.split('.').pop()?.split('?')[0] || 'jpg'}`} />}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#666', marginTop: '10px' }}>
              * Klik tombol dokumen untuk membuka / mengunduh file aslinya.
            </p>
          </div>
        )}

        {/* Status dokumen jika belum ada */}
        {!hasDokumen && (
          <div className="no-print" style={{ marginTop: '28px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              Dokumen Pendukung
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Kartu Keluarga (KK)', value: p?.dokumenKK },
                { label: 'Akte Kelahiran', value: p?.dokumenAkte },
                { label: 'KTP / Kartu Pelajar', value: p?.dokumenKtp },
              ].map(doc => (
                <div key={doc.label} style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📋</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{doc.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Belum diunggah</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '48px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.82rem', color: '#666' }}>
          <div>
            <div>Data Pelita Bondowoso</div>
            <div style={{ marginTop: '2px' }}>Sistem Manajemen Anggota</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '48px' }}>Tanda Tangan Pengurus,</div>
            <div style={{ minWidth: '160px', display: 'inline-block', textAlign: 'center' }}>(...................................)</div>
          </div>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        .btn-action-view {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none !important;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          color: var(--text-primary);
          cursor: pointer;
        }
        .btn-action-view:hover {
          background: var(--border-glass);
          transform: translateY(-1px);
        }
        .btn-action-download {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--accent-primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none !important;
          color: white !important;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .btn-action-download:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
        }

        @media print {
          .no-print,
          header,
          .glass-sidebar-container,
          .sidebar-overlay {
            display: none !important;
          }
          body, html {
            background: white !important;
            height: auto !important;
            overflow: visible !important;
          }
          .dashboard-theme-container {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
          }
          .dashboard-theme-container > div {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
          }
          main {
            padding: 0 !important;
            overflow: visible !important;
          }
          #print-area {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 20px !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
