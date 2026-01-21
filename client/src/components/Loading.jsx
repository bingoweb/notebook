const Loading = ({ message = 'Yükleniyor...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem'
    }}>
      <div className="spinner" style={{
        width: '50px',
        height: '50px',
        border: '4px solid var(--border-color)',
        borderTop: '4px solid var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.95rem'
      }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
