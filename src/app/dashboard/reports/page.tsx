"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";


type SummaryData = {
  id: string;
  name: string;
  role: string;
  present: number;
  total: number;
  percentage: number;
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SummaryData[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeRole, setActiveRole] = useState<"SISWA" | "PENGURUS">("SISWA");

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports?month=${month}&year=${year}&role=${activeRole}`);
        const result = await res.json();
        setData(result);
      } catch (e) {
        console.error("Failed to fetch report", e);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [month, year, activeRole]);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return "#10b981"; // Good
    if (percentage >= 50) return "#f59e0b"; // Warning
    return "#ef4444"; // Danger
  };

  const handleDownloadExcel = () => {
    const fileName = `Rekap_Absensi_${activeRole}_${months[month]}_${year}.xlsx`;
    
    const excelData = data.map(item => ({
      "ID": item.id.split('-')[0].toUpperCase(),
      "Nama Lengkap": item.name,
      "Role": item.role === "SISWA" ? "Siswa" : "Pelatih",
      "Kehadiran": item.present,
      "Total Sesi": item.total,
      "Persentase": `${item.percentage}%`
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Absensi");
    XLSX.writeFile(workbook, fileName);
  };


  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Rekap Absensi</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Laporan kehadiran bulanan otomatis</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={month} 
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="input-field"
            style={{ width: '150px', background: 'var(--bg-secondary)' }}
          >
            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="input-field"
            style={{ width: '120px', background: 'var(--bg-secondary)' }}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button 
            onClick={handleDownloadExcel}
            disabled={data.length === 0}
            className="btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0 20px',
              opacity: data.length === 0 ? 0.5 : 1,
              cursor: data.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📥</span>
            Download Excel
          </button>

        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '12px', width: 'fit-content', border: '1px solid var(--border-glass)' }}>
        <button 
          onClick={() => setActiveRole("SISWA")}
          style={{ 
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeRole === "SISWA" ? 'var(--accent-primary)' : 'transparent',
            color: activeRole === "SISWA" ? 'white' : 'var(--text-secondary)',
            fontWeight: 600, transition: 'all 0.3s'
          }}
        >
          Siswa
        </button>
        <button 
          onClick={() => setActiveRole("PENGURUS")}
          style={{ 
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeRole === "PENGURUS" ? 'var(--accent-primary)' : 'transparent',
            color: activeRole === "PENGURUS" ? 'white' : 'var(--text-secondary)',
            fontWeight: 600, transition: 'all 0.3s'
          }}
        >
          Pelatih
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Memuat data rekap...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
          <h3 style={{ color: 'var(--text-primary)' }}>Belum Ada Data</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Tidak ditemukan riwayat absensi untuk bulan {months[month-1]} {year}.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {data.map((item) => (
            <div key={item.id} className="glass-card" style={{ position: 'relative', padding: '24px 24px 24px 32px' }}>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', 
                background: getStatusColor(item.percentage) 
              }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 800, 
                    marginBottom: '4px', 
                    color: 'var(--text-primary)',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{item.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ID: {item.id.split('-')[0].toUpperCase()}</p>
                </div>
                <div style={{ textAlign: 'right', minWidth: '70px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: getStatusColor(item.percentage), lineHeight: 1 }}>{item.percentage}%</div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px' }}>Hadir</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.present} / {item.total} Sesi</span>
                  <span style={{ fontWeight: 700, color: item.total - item.present > 0 ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
                    {item.total - item.present} Absen
                  </span>
                </div>
                <div style={{ height: '10px', background: 'var(--bg-primary)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                  <div style={{ 
                    width: `${item.percentage}%`, height: '100%', 
                    background: getStatusColor(item.percentage),
                    borderRadius: '10px',
                    boxShadow: `0 0 10px ${getStatusColor(item.percentage)}44`,
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--status-hadir)', fontWeight: 800, letterSpacing: '0.05em' }}>HADIR</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{item.present}</div>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--status-alpa)', fontWeight: 800, letterSpacing: '0.05em' }}>ABSEN</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{item.total - item.present}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
