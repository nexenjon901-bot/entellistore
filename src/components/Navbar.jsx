import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { translations } from '../translations';
import { User, Search, LogIn, Home, BookOpen, Headphones, X, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import LangSwitcher from './LangSwitcher';

const NAV_LINKS = [
  { key: 'home',    path: '/',        icon: Home },
  { key: 'catalog', path: '/catalog', icon: BookOpen },
  { key: 'support', path: '/support', icon: Headphones },
];

const Navbar = ({ lang, setLang }) => {
  const t = translations[lang] || translations['uz'];
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" style={{ flexShrink: 0 }}>
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="nav-links hide-mobile">
            {NAV_LINKS.map(({ key, path }) => (
              <Link
                key={key}
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                {t[key]}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="nav-actions hide-mobile">
            {/* Search */}
            <div className="nav-search-wrap">
              <Search size={16} className="nav-search-icon" />
              <input
                type="text"
                className="nav-search"
                placeholder={t.searchPlaceholder}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(242,169,0,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '';
                  e.target.style.boxShadow = '';
                }}
              />
            </div>

            <LangSwitcher lang={lang} setLang={setLang} />

            {/* Profile / Login */}
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/profile'}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                {user.role === 'admin' ? <LayoutDashboard size={16} /> : <User size={16} />}
                {user.username}
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <LogIn size={16} /> {t.login}
              </Link>
            )}
          </div>

          {/* Mobile right */}
          <div className="show-mobile nav-mobile-actions">
            {user && user.role === 'admin' && (
              <Link to="/admin" className="btn btn-primary btn-sm" style={{ padding: '6px 10px' }}>
                <LayoutDashboard size={16} />
              </Link>
            )}
            <LangSwitcher lang={lang} setLang={setLang} />
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Logo />
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search in mobile */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={16} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="catalog-search"
            placeholder={t.searchPlaceholder}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {NAV_LINKS.map(({ key, path, icon: Icon }) => (
          <Link
            key={key}
            to={path}
            className={`mobile-nav-link ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={18} /> {t[key]}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin' : '/profile'}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {user.role === 'admin' ? <LayoutDashboard size={18} /> : <User size={18} />}
              {user.username}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <LogIn size={18} /> {t.login}
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
