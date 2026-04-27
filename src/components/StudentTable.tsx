"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import UserActions from "./UserActions";

export default function StudentTable({ students }: { students: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("Semua Umur");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (student.namaPanggilan && student.namaPanggilan.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesAge = true;
    if (ageFilter !== "Semua Umur") {
      if (ageFilter === "Di bawah 7 tahun") matchesAge = student.kelompokUmur === "Di bawah 7 tahun";
      else if (ageFilter === "7-8 tahun") matchesAge = student.kelompokUmur === "7-8 tahun";
      else if (ageFilter === "9-10 tahun") matchesAge = student.kelompokUmur === "9-10 tahun";
      else if (ageFilter === "11-12 tahun") matchesAge = student.kelompokUmur === "11-12 tahun";
      else if (ageFilter === "13-14 tahun") matchesAge = student.kelompokUmur === "13-14 tahun";
      else if (ageFilter === "15-16 tahun") matchesAge = student.kelompokUmur === "15-16 tahun";
      else if (ageFilter === "17-18 tahun") matchesAge = student.kelompokUmur === "17-18 tahun";
      else if (ageFilter === "19+ tahun") matchesAge = student.kelompokUmur === "19+ tahun";
    }

    return matchesSearch && matchesAge;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadExcel = () => {
    const fileName = `Data_Siswa_Pelita_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    const excelData = paginatedStudents.map((s, index) => ({
      "No": index + 1,
      "Nama Lengkap": s.namaLengkap.toUpperCase(),
      "Nama Panggilan": s.namaPanggilan.toUpperCase(),
      "Tempat, Tgl Lahir": s.ttl,
      "Umur": s.umurText,
      "Kelompok Umur": s.kelompokUmur,
      "Jenis Kelamin": s.jk,
      "TB/BB": s.tbbb,
      "Asal Sekolah": s.asalSekolah,
      "Nomor HP": s.hp
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Cari siswa..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="input-field" 
            style={{ width: '100%', paddingLeft: '48px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} 
          />
        </div>
        
        <select 
          value={itemsPerPage}
          onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          className="input-field" 
          style={{ width: '130px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', cursor: 'pointer', borderRadius: '8px' }}
        >
          <option value={5}>5 Baris</option>
          <option value={10}>10 Baris</option>
          <option value={25}>25 Baris</option>
          <option value={100}>100 Baris</option>
        </select>
        
        <select 
          value={ageFilter}
          onChange={(e) => { setAgeFilter(e.target.value); setCurrentPage(1); }}
          className="input-field" 
          style={{ width: '200px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', cursor: 'pointer', borderRadius: '8px' }}
        >
          <option>Semua Umur</option>
          <option>Di bawah 7 tahun</option>
          <option>7-8 tahun</option>
          <option>9-10 tahun</option>
          <option>11-12 tahun</option>
          <option>13-14 tahun</option>
          <option>15-16 tahun</option>
          <option>17-18 tahun</option>
          <option>19+ tahun</option>
        </select>

        <button 
          onClick={handleDownloadExcel}
          disabled={filteredStudents.length === 0}
          className="btn-primary"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '0 20px',
            height: '42px',
            opacity: filteredStudents.length === 0 ? 0.5 : 1,
            cursor: filteredStudents.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📥</span>
          Excel
        </button>
      </div>


      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px', width: '50px' }}>NO</th>
                <th style={{ padding: '12px 16px' }}>NAMA</th>
                <th style={{ padding: '12px 16px' }}>PANGGILAN</th>
                <th style={{ padding: '12px 16px' }}>TTL</th>
                <th style={{ padding: '12px 16px' }}>UMUR</th>
                <th style={{ padding: '12px 16px' }}>KELOMPOK</th>
                <th style={{ padding: '12px 16px' }}>JK</th>
                <th style={{ padding: '12px 16px' }}>TB/BB</th>
                <th style={{ padding: '12px 16px' }}>ASAL SEKOLAH</th>
                <th style={{ padding: '12px 16px' }}>HP</th>
                <th style={{ padding: '12px 16px' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Tidak ada data siswa ditemukan.</td>
                </tr>
              ) : (
                paginatedStudents.map((s, index) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '12px 16px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.namaLengkap}</td>
                    <td style={{ padding: '12px 16px' }}>{s.namaPanggilan}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.ttl}</td>
                    <td style={{ padding: '12px 16px' }}>{s.umurText}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        background: (s.kelompokUmur === '17-18 tahun' || s.kelompokUmur === '19+ tahun') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                        color: (s.kelompokUmur === '17-18 tahun' || s.kelompokUmur === '19+ tahun') ? '#dc2626' : '#2563eb', 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                      }}>
                        {s.kelompokUmur}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{s.jk}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.tbbb}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.asalSekolah}</td>
                    <td style={{ padding: '12px 16px' }}>{s.hp}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <UserActions 
                        userId={s.id} 
                        userName={s.namaLengkap} 
                        editUrl={`/dashboard/members/edit/${s.id}`} 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 8px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredStudents.length)} dari {filteredStudents.length} data
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)' }}
            >
              Sebelumnya
            </button>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '0.85rem', fontWeight: 600 }}>
              Halaman {currentPage} dari {totalPages}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)' }}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
