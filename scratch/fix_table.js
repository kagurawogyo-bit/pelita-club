const fs = require('fs');
let code = fs.readFileSync('src/components/StudentTable.tsx', 'utf-8');

// 1. Add new state for pagination
code = code.replace(
  /const \[searchTerm, setSearchTerm\] = useState\(""\);\n  const \[ageFilter, setAgeFilter\] = useState\("Semua Umur"\);/,
  `const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("Semua Umur");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);`
);

// 2. Compute pagination
code = code.replace(
  /const handleDownloadExcel/,
  `const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadExcel`
);

// 3. Reset currentPage when search or filter changes
code = code.replace(
  /onChange=\{\(e\) => setSearchTerm\(e\.target\.value\)\}/,
  `onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}`
);
code = code.replace(
  /onChange=\{\(e\) => setAgeFilter\(e\.target\.value\)\}/,
  `onChange={(e) => { setAgeFilter(e.target.value); setCurrentPage(1); }}`
);

// 4. Add itemsPerPage select dropdown
code = code.replace(
  /<select \n          value=\{ageFilter\}/,
  `<select 
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
          value={ageFilter}`
);

// 5. Replace mapped array in table body
code = code.replace(/filteredStudents\.map\(\(s, index\)/g, 'paginatedStudents.map((s, index)');
// Ensure index shows correct number globally, not per page
code = code.replace(/\{index \+ 1\}/g, '{(currentPage - 1) * itemsPerPage + index + 1}');

// 6. Font size update on table
code = code.replace(/<table style=\{\{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' \}\}>/, 
"<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px', fontSize: '0.85rem' }}>");
code = code.replace(/padding: '16px'/g, "padding: '12px 16px'");

// 7. Add pagination controls below table
const paginationHtml = `
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
    </div>`;

code = code.replace(/<\/div>\n    <\/div>\n  \);\n\}/, paginationHtml + '\n  );\n}');

fs.writeFileSync('src/components/StudentTable.tsx', code);
console.log('Updated StudentTable.tsx');
