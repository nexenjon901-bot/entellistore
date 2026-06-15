import React, { useContext } from 'react';
import { translations } from '../translations';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ShieldCheck, Zap, Headphones, Users, CheckCircle, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const TRUST_CARDS = [
  {
    icon: ShieldCheck,
    title: 'Secure Trading',
    desc: 'All accounts are manually verified by our security team before listing. Zero scam guarantee.',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
  },
  {
    icon: Star,
    title: 'Verified Marketplace',
    desc: 'EntelliStore is a certified PUBG account marketplace trusted by thousands of buyers.',
    color: '#F2A900',
    bg: 'rgba(242,169,0,0.1)',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    desc: 'Receive your account credentials within 5-15 minutes after payment confirmation.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
  },
  {
    icon: Headphones,
    title: 'Real Human Support',
    desc: 'Our support team is available 24/7. Real people, not bots — always here to help you.',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.1)',
  },
];

const STATS = [
  { value: '500+', label: 'Successful Sales' },
  { value: '1,000+', label: 'Satisfied Customers' },
  { value: '24/7', label: 'Support' },
  { value: '100%', label: 'Manual Verification' },
];

const Home = ({ lang }) => {
  const t = translations[lang] || translations['uz'];
  const { products } = useContext(AuthContext);

  return (
    <div className="home-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
          <div className="hero-grid-overlay" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <ShieldCheck size={14} />
            {t.heroBadge}
          </div>

          <h1 className="hero-title">
            <span className="gradient-text">{t.heroTitle}</span>
          </h1>

          <p className="hero-subtitle">{t.heroSubtitle}</p>

          <div className="hero-cta">
            <Link to="/catalog" className="btn btn-primary hero-btn" style={{ padding: '18px 48px', fontSize: '1.1rem', boxShadow: '0 0 20px rgba(242,169,0,0.4)' }}>
              {t.exploreBtn} <ArrowRight size={20} />
            </Link>
            <Link to="/support" className="btn btn-secondary hero-btn" style={{ borderColor: 'var(--border-color)', padding: '14px 32px', fontSize: '0.95rem' }}>
              <Headphones size={18} /> Contact Support
            </Link>
          </div>

          {/* Stats strip */}
          <div className="hero-stats">
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="hero-stat-divider" />}
                <div className="hero-stat">
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ── */}
      <section className="trust-section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Why Choose Us</div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              The most <span className="gradient-text">trusted</span> PUBG marketplace
            </h2>
          </div>
          <div className="trust-grid">
            {TRUST_CARDS.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="trust-card">
                  <div className="trust-icon" style={{ background: card.bg, color: card.color }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4>{card.title}</h4>
                    <p>{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon-green"><ShieldCheck size={22} /></div>
              <div>
                <h4>100% Secure</h4>
                <p>All accounts verified before listing. No scams, full guarantee.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-yellow"><Zap size={22} /></div>
              <div>
                <h4>{t.delivery}</h4>
                <p>Automated delivery system. Get credentials instantly.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-blue"><Headphones size={22} /></div>
              <div>
                <h4>24/7 Support</h4>
                <p>Our multilingual support team is ready to help you anytime.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-purple"><Users size={22} /></div>
              <div>
                <h4>Real Community</h4>
                <p>Join 1,000+ satisfied gamers who trust EntelliStore.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── CTA BANNER ── */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, rgba(242,169,0,0.06) 0%, transparent 60%)',
        borderTop: '1px solid var(--border-color)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Get Started Today</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '16px' }}>
            Ready to find your perfect <span className="gradient-text">PUBG account?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Browse hundreds of verified accounts. Safe, instant, and hassle-free.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalog" className="btn btn-primary btn-lg">
              Browse All Accounts <ArrowRight size={20} />
            </Link>
            <Link to="/support" className="btn btn-ghost btn-lg">
              <Headphones size={20} /> Talk to Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
