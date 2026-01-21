import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          margin: '2rem'
        }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Bir şeyler yanlış gitti
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {this.state.error?.message || 'Beklenmeyen bir hata oluştu'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
