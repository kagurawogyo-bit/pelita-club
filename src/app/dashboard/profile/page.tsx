"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MemberQRCode from "@/components/MemberQRCode";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>Memuat profil...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Profil Saya</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Detail informasi biodata diri Anda.</p>
      </div>

      <div className="glass-panel">
        <h3 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Data Pribadi
          <button 
            onClick={() => router.push("/dashboard/profile/edit")}
            className="btn btn-outline" 
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Edit Data
          </button>
        </h3>
        
        {!user.profile ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Biodata Anda belum lengkap. Silakan isi biodata terlebih dahulu.</p>
            <button 
              onClick={() => router.push("/dashboard/profile/edit")}
              className="btn btn-primary"
            >
              Lengkapi Biodata
            </button>
          </div>
        ) : (
          <div className="grid-cols-2" style={{ gap: '24px' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Nama Lengkap</strong> {user.profile.namaLengkap || '-'}</div>
              <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Nama Panggilan</strong> {user.profile.namaPanggilan || '-'}</div>
              <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>NIK</strong> {user.profile.nik || '-'}</div>
              <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Nomor HP</strong> {user.profile.nomorHp || '-'}</div>
              <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Alamat Lengkap</strong> {user.profile.alamat || '-'}</div>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Tempat, Tanggal Lahir</strong> {user.profile.tempatLahir || '-'}, {user.profile.tanggalLahir ? new Date(user.profile.tanggalLahir).toLocaleDateString('id-ID') : '-'}</div>
              <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Jenis Kelamin</strong> {user.profile.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : user.profile.jenisKelamin === 'PEREMPUAN' ? 'Perempuan' : '-'}</div>
              <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Agama</strong> {user.profile.agama || '-'}</div>
              <div className="grid-cols-2">
                <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Tinggi Badan</strong> {user.profile.tinggiBadan || '-'} cm</div>
                <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Berat Badan</strong> {user.profile.beratBadan || '-'} kg</div>
              </div>
              <div className="grid-cols-2">
                <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Nama Ayah</strong> {user.profile.namaAyah || '-'}</div>
                <div><strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Nama Ibu</strong> {user.profile.namaIbu || '-'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Section */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <MemberQRCode
          userId={user.id}
          nama={user.profile?.namaLengkap || user.email}
          role={user.role}
        />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '1rem' }}>
              📱 Cara Menggunakan QR Code
            </h4>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li>Tampilkan QR Code ini kepada petugas saat jadwal latihan.</li>
              <li>Petugas akan menscan QR Code Anda menggunakan halaman <strong>Scan QR Absen</strong>.</li>
              <li>Kehadiran Anda akan tercatat secara otomatis.</li>
              <li>Anda juga bisa men-download QR Code ini dan menyimpannya di galeri HP.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
