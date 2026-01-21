import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, user } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search will be handled by parent component
    window.location.href = `/?search=${searchTerm}`;
  };

  return (
    <nav className="site-nav" role="navigation" aria-label="Ana navigasyon">
      <button
        className="menu-toggle"
        aria-label="Menüyü aç/kapat"
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        <span className="hamburger"></span>
      </button>

      <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link></li>
        <li><Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>Hakkımda</Link></li>
        <li><Link to="/categories" className="nav-link" onClick={() => setMenuOpen(false)}>Kategoriler</Link></li>
        {isAuthenticated && isAdmin && (
          <li><Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Admin</Link></li>
        )}
        {isAuthenticated ? (
          <li><Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>Profil</Link></li>
        ) : (
          <li><Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Giriş</Link></li>
        )}
      </ul>

      <div className="nav-actions">
        <button
          className="search-toggle"
          aria-label="Arama"
          title="Arama"
          onClick={toggleSearch}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="8" cy="8" r="6"/>
            <path d="M12.5 12.5l5 5"/>
          </svg>
        </button>

        <button
          className="theme-toggle"
          aria-label={theme === 'dark' ? 'Aydınlık mod' : 'Karanlık mod'}
          title="Tema değiştir"
          onClick={toggleTheme}
        >
          <svg className="sun-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style={{ display: theme === 'dark' ? 'none' : 'block' }}>
            <circle cx="10" cy="10" r="4"/>
            <path d="M10 1v2m0 14v2M3.93 3.93l1.41 1.41m9.9 9.9l1.41 1.41M1 10h2m14 0h2M3.93 16.07l1.41-1.41m9.9-9.9l1.41-1.41"/>
          </svg>
          <svg className="moon-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style={{ display: theme === 'dark' ? 'block' : 'none' }}>
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </button>
      </div>

      {searchOpen && (
        <div className="search-bar" role="search">
          <input
            type="search"
            placeholder="Blog yazılarında ara..."
            aria-label="Blog yazılarında ara"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            autoFocus
          />
          <button
            className="search-close"
            aria-label="Aramayı kapat"
            onClick={() => {
              setSearchOpen(false);
              setSearchTerm('');
            }}
          >
            ×
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
