import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { translations } from '../translations';
import { Send, MessageCircle, Shield, ArrowUpRight } from 'lucide-react';

const Footer = ({ lang }) => {
  const t = translations[lang] || translations['uz'];
  const year = new Date().getFullYear();

  return (
    <footer className="footer" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="footer-content">
          {/* Brand */}
          <div>
            <Logo />
            <p className="footer-desc">
              {t.footerDesc || 'EntelliStore — Premium PUBG Mobile account marketplace. Safe, verified, and trusted by thousands.'}
            </p>
            <div className="footer-socials">
              <a href="https://t.me/entelli88" target="_blank" rel="noopener noreferrer">
                <Send size={15} /> @entelli88
              </a>
              <a href="https://discord.gg/Qq88xrMYT" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={15} /> Discord
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-col">
            <h4>{t.links || 'Navigation'}</h4>
            <ul>
              <li><Link to="/">{t.home}</Link></li>
              <li><Link to="/catalog">{t.catalog}</Link></li>
              <li><Link to="/support">{t.support}</Link></li>
              <li><Link to="/support">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>{t.legal || 'Legal'}</h4>
            <ul>
              <li><Link to="/support">{t.terms || 'Terms of Service'}</Link></li>
              <li><Link to="/support">{t.privacy || 'Privacy Policy'}</Link></li>
              <li><Link to="/support">Refund Policy</Link></li>
              <li><Link to="/support">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Payment */}
          <div className="footer-col">
            <h4>{t.paymentMethods || 'Payment Methods'}</h4>
            <div className="footer-payments">
              <div className="payment-badge">💳 Uzcard / Humo</div>
              <div className="payment-badge">💳 Visa / Mastercard</div>
              <div className="payment-badge">🪙 Binance Pay (USDT)</div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Shield size={14} /> 100% Secure Payments
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} EntelliStore. All rights reserved.</span>
          <div className="footer-bottom-right">
            Made with <span style={{ color: 'var(--accent-primary)', margin: '0 2px' }}>♥</span> for PUBG players
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
