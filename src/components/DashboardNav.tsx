"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const SectionLabel = ({ label }: { label: string }) => (
  <div className="nav-section-label">
    {label}
  </div>
);

const NavItem = ({ href, icon, label, isActive, onClick }: { href: string, icon: React.ReactNode, label: string, isActive: boolean, onClick?: () => void }) => (
  <Link 
    href={href} 
    className={`nav-item ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </Link>
);

export default function DashboardNav({ role, onNavClick }: { role: string, onNavClick?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (path: string) => pathname === path;

  

  
  return (
    <aside className="glass-sidebar" style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100vh' }}>

      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '4px' }}>
          <img   src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
          DATA PELITA<br/><span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>BONDOWOSO</span>
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 32px 16px' }}>
        <div className="nav-container">
          {role === "SENIOR" ? (
            <>
              <SectionLabel label="BIODATA" />
              <NavItem href="/dashboard/profile" icon="👤" label="Profil Saya" isActive={isActive("/dashboard/profile")} onClick={onNavClick} />
            </>
          ) : (
            <>
              <SectionLabel label="MENU UTAMA" />
              <NavItem href="/dashboard" icon="🏠" label="Dashboard" isActive={isActive("/dashboard")} onClick={onNavClick} />
              {role === "PENGURUS" && (
                <>
                  <NavItem href="/dashboard/members" icon="👥" label="Data Siswa" isActive={isActive("/dashboard/members") && !searchParams.get("gender")} onClick={onNavClick} />
                  <div style={{ paddingLeft: '24px', opacity: 0.9 }}>
                    <NavItem href="/dashboard/members?gender=L" icon="👦" label="Laki-laki" isActive={isActive("/dashboard/members") && searchParams.get("gender") === "L"} onClick={onNavClick} />
                    <NavItem href="/dashboard/members?gender=P" icon="👧" label="Perempuan" isActive={isActive("/dashboard/members") && searchParams.get("gender") === "P"} onClick={onNavClick} />
                  </div>
                </>
              )}

              <SectionLabel label="KEHADIRAN" />
              <NavItem href="/dashboard/attendance" icon="📋" label="Absen Siswa" isActive={isActive("/dashboard/attendance")} onClick={onNavClick} />
              <NavItem href="/dashboard/attendance/scan" icon="📷" label="Scan QR Absen" isActive={isActive("/dashboard/attendance/scan")} onClick={onNavClick} />
              {role === "PENGURUS" && (
                <>
                  <NavItem href="/dashboard/attendance/session" icon="🎫" label="Sesi QR" isActive={isActive("/dashboard/attendance/session")} onClick={onNavClick} />
                  <NavItem href="/dashboard/attendance/pelatih" icon="📋" label="Absen Pelatih" isActive={isActive("/dashboard/attendance/pelatih")} onClick={onNavClick} />
                  <NavItem href="/dashboard/reports" icon="📊" label="Rekap Absensi" isActive={isActive("/dashboard/reports")} onClick={onNavClick} />
                </>
              )}

              <SectionLabel label="EVENT CBB" />
              <NavItem href="/dashboard/attendance-cbb" icon="🏀" label="Absen Siswa CBB" isActive={isActive("/dashboard/attendance-cbb")} onClick={onNavClick} />
              <NavItem href="/dashboard/attendance-cbb/scan" icon="📷" label="Scan QR CBB" isActive={isActive("/dashboard/attendance-cbb/scan")} onClick={onNavClick} />
              {role === "PENGURUS" && (
                <>
                  <NavItem href="/dashboard/attendance-cbb/session" icon="🎫" label="Sesi QR CBB" isActive={isActive("/dashboard/attendance-cbb/session")} onClick={onNavClick} />
                  <NavItem href="/dashboard/attendance-cbb/pelatih" icon="📋" label="Absen Pelatih CBB" isActive={isActive("/dashboard/attendance-cbb/pelatih")} onClick={onNavClick} />
                  <NavItem href="/dashboard/attendance-cbb/recap" icon="📊" label="Rekap Absensi CBB" isActive={isActive("/dashboard/attendance-cbb/recap")} onClick={onNavClick} />
                </>
              )}

              <SectionLabel label="BIODATA" />
              <NavItem href="/dashboard/profile" icon="👤" label="Profil Saya" isActive={isActive("/dashboard/profile")} onClick={onNavClick} />
              {role === "PENGURUS" && (
                <>
                  <NavItem href="/dashboard/pengurus" icon="💼" label="Pengurus" isActive={isActive("/dashboard/pengurus")} onClick={onNavClick} />
                  <NavItem href="/dashboard/senior" icon="🏅" label="Senior" isActive={isActive("/dashboard/senior")} onClick={onNavClick} />
                  <SectionLabel label="PENGATURAN" />
                  <NavItem href="/dashboard/settings" icon="⚙️" label="Reset Akun Siswa" isActive={isActive("/dashboard/settings")} onClick={onNavClick} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
