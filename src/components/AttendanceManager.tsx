"use client";

import { useState, useEffect } from "react";

interface Student {
  id: string;
  namaLengkap: string;
  kelompokUmur: string;
}

export default function AttendanceManager({ 
  initialStudents, 
  customGroups,
  title = "Absensi Siswa",
  showCoachSelection = false,
  coaches = [],
  readOnly = false,
  eventType = "REGULAR",
  customColumns
}: { 
  initialStudents: any[], 
  customGroups?: string[] 
  title?: string
  showCoachSelection?: boolean
  coaches?: { id: string, namaLengkap: string }[]
  readOnly?: boolean
  eventType?: string
  customColumns?: string[]
}) {
  const [selectedGroup, setSelectedGroup] = useState("Semua Kelompok");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCoachIds, setSelectedCoachIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, string>>>({});

  // Load from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/attendance/grid?month=${selectedMonth}&year=${selectedYear}&eventType=${eventType}`);
        if (res.ok) {
          const data = await res.json();
          setAttendanceData(data);
        }
      } catch (error) {
        console.error("Fetch attendance error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  const groups = customGroups || [
    "Semua Kelompok",
    "Di bawah 7 tahun",
    "7-8 tahun",
    "9-10 tahun",
    "11-12 tahun",
    "13-14 tahun",
    "15-16 tahun",
    "17 tahun ke atas"
  ];

  const columns = customColumns || [
    "M1P1", "M1P2", "M1P3", "M1P4", "M1P5", 
    "M2P1", "M2P2", "M2P3", "M2P4", "M2P5", 
    "M3P1", "M3P2", "M3P3", "M3P4", "M3P5", 
    "M4P1", "M4P2", "M4P3", "M4P4", "M4P5",
    "M5P1", "M5P2", "M5P3", "M5P4", "M5P5"
  ];

  const statuses = ["-", "✓"];

  const statusStyles: Record<string, { bg: string, color: string, border: string, shadow: string }> = {
    "-": { 
      bg: "var(--status-none-bg)", 
      color: "var(--status-none)", 
      border: "1px solid var(--border-glass)",
      shadow: "none"
    },
    "✓": { 
      bg: "var(--status-hadir)", 
      color: "white", 
      border: "1px solid rgba(16, 185, 129, 0.5)",
      shadow: "0 0 12px rgba(16, 185, 129, 0.4)"
    },
  };

  const toggleCoach = (id: string) => {
    if (readOnly) return;
    setSelectedCoachIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const selectAllCoaches = () => {
    if (readOnly) return;
    if (selectedCoachIds.length === coaches.length) {
      setSelectedCoachIds([]);
    } else {
      setSelectedCoachIds(coaches.map(c => c.id));
    }
  };

  const handleToggle = async (studentId: string, col: string) => {
    if (readOnly) return;
    const studentData = attendanceData[studentId] || {};
    const currentStatus = studentData[col] || "-";
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    // Optimistic update
    const newData = {
      ...attendanceData,
      [studentId]: {
        ...studentData,
        [col]: nextStatus
      }
    };

    // If it's Student Attendance and coaches are selected, automatically mark coaches as "✓"
    if (title === "Absensi Siswa" && selectedCoachIds.length > 0 && nextStatus === "✓") {
        selectedCoachIds.forEach(coachId => {
            if (!newData[coachId]) newData[coachId] = {};
            newData[coachId][col] = "✓";
        });
    }
    
    setAttendanceData(newData);

    try {
      await fetch('/api/attendance/grid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: studentId,
          month: selectedMonth,
          year: selectedYear,
          column: col,
          status: nextStatus,
          coachIds: title === "Absensi Siswa" ? selectedCoachIds : undefined,
          eventType
        })
      });
    } catch (error) {
      console.error("Save attendance error:", error);
    }
  };


  // Filter students by group (if the data has it)
  const filteredStudents = initialStudents.filter(s => {
    if (selectedGroup === "Semua Kelompok") return true;
    return s.kelompokUmur === selectedGroup;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', opacity: loading ? 0.7 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>{title}</h2>
        {showCoachSelection && (
          <button 
            onClick={selectAllCoaches}
            className="btn btn-primary"
            style={{ fontSize: '0.875rem', padding: '10px 20px' }}
          >
            {selectedCoachIds.length === coaches.length ? '✕ Batal Pilih Semua' : '✓ Pilih Semua Pelatih'}
          </button>
        )}
      </div>

      {showCoachSelection && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '4px', borderRadius: '6px' }}>📋</span>
             <span>Daftar Pelatih (Opsional)</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {coaches.map(coach => {
              const isSelected = selectedCoachIds.includes(coach.id);
              return (
                <div 
                  key={coach.id}
                  onClick={() => toggleCoach(coach.id)}
                  style={{ 
                    padding: '12px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--accent-primary)' : 'var(--bg-primary)',
                    color: isSelected ? 'white' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-glass)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                    boxShadow: isSelected ? '0 4px 15px rgba(14, 165, 233, 0.3)' : 'none',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    border: '2px solid currentColor',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px'
                  }}>
                    {isSelected && "✓"}
                  </div>
                  {coach.namaLengkap}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {groups.length > 1 && (
            <select 
              className="input-field" 
              style={{ width: '220px', cursor: 'pointer' }}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          )}

          <select 
            className="input-field" 
            style={{ width: '160px', cursor: 'pointer' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>

          <select 
            className="input-field" 
            style={{ width: '120px', cursor: 'pointer' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Keterangan</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'var(--status-hadir)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}></div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hadir</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: 'var(--status-none-bg)', border: '1px solid var(--border-glass)' }}></div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>None</span>
          </div>
        </div>
      </div>


      <div className="glass-card">
        <div style={{ overflowX: 'auto', padding: '1px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '1200px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '20px 16px', textAlign: 'left', width: '60px' }}>NO</th>
                <th style={{ padding: '20px 16px', textAlign: 'left', minWidth: '200px' }}>{title === "Absensi Pelatih" ? "NAMA PELATIH" : "NAMA SISWA"}</th>
                {columns.map(col => (
                  <th key={col} style={{ padding: '20px 8px', fontWeight: 700 }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} style={{ padding: '48px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    {title === "Absensi Pelatih" ? "Tidak ada data pelatih ditemukan." : "Tidak ada data siswa untuk kelompok ini."}
                  </td>
                </tr>

              ) : (
                filteredStudents.map((student: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, index: number) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{index + 1}</td>
                    <td style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{student.profile?.namaLengkap || student.namaLengkap}</td>
                    {columns.map((col) => {
                      const status = (attendanceData[student.id] && attendanceData[student.id][col]) || "-";
                      const style = statusStyles[status];
                      
                      return (
                        <td key={col} style={{ padding: '8px 4px' }}>
                          <div 
                            onClick={() => handleToggle(student.id, col)}
                            style={{ 
                              width: '36px', height: '36px', 
                              margin: '0 auto', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              borderRadius: '8px',
                              background: style.bg,
                              color: style.color,
                              border: style.border,
                              boxShadow: style.shadow,
                              cursor: readOnly ? 'default' : 'pointer',
                              userSelect: 'none',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              fontWeight: 800,
                              fontSize: '1rem'
                            }}
                            onMouseOver={(e) => {
                                if (status === "-" && !readOnly) {
                                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (status === "-" && !readOnly) {
                                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }
                            }}
                          >
                            {status === "✓" ? "✓" : "-"}
                          </div>

                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
