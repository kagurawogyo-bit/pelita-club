export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '60vh',
      gap: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '5px solid var(--bg-secondary)',
        borderBottomColor: 'var(--accent-primary)',
        borderRadius: '50%',
        display: 'inline-block',
        boxSizing: 'border-box',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Memuat data...</p>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}

