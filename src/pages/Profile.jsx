import React, { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { translations } from '../translations';
import { User, CreditCard, ArrowUpRight, LogOut, ShoppingBag, Package, Clock } from 'lucide-react';

const Profile = ({ lang }) => {
  const { user, logout, setUser, orders } = useContext(AuthContext);
  const t = translations[lang] || translations['uz'];
  const [profileImage, setProfileImage] = useState(() =>
    localStorage.getItem('entelli_profile_img_' + (user?.id || '')) || null
  );

  if (!user) return <Navigate to="/login" />;

  const handleImageUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem('entelli_profile_img_' + user.id, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const myOrders = orders.filter(o => o.user === user.username || o.userId === user.id);

  const stats = [
    { label: 'User ID', value: user.id, icon: User },
    { label: 'Balance', value: `$${user.balance}`, icon: CreditCard, color: 'var(--accent-primary)' },
    { label: 'Purchases', value: `${myOrders.length} ta`, icon: ShoppingBag },
  ];

  return (
    <div style={{ padding: '60px 0 80px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>

        {/* Header card */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <label htmlFor="profile-img-input" style={{ cursor: 'pointer' }}>
                <div style={{
                  width: '88px', height: '88px', borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  border: '3px solid var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', position: 'relative',
                  boxShadow: 'var(--accent-glow-sm)',
                }}>
                  {profileImage
                    ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <User size={44} color="var(--text-muted)" />
                  }
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.65)',
                    textAlign: 'center', padding: '4px',
                    fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 700,
                  }}>EDIT</div>
                </div>
                <input id="profile-img-input" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              <div>
                <div className="section-label">Account</div>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{user.username}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
                  Active • {user.role === 'admin' ? 'Administrator' : 'Member'}
                </div>
              </div>
            </div>
            <button onClick={logout} className="btn btn-secondary" style={{ gap: '8px' }}>
              <LogOut size={16} /> {t.logout || 'Chiqish'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-panel" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--accent-primary)" /> Recent Activity
          </h3>
          
          {myOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myOrders.map(order => (
              <React.Fragment key={order.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: order.status === 'Completed' ? '12px 12px 0 0' : '12px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{order.productTitle}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{new Date(order.date).toLocaleDateString()} • {order.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '4px' }}>${order.amount}</div>
                    <div style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                      {order.status}
                    </div>
                  </div>
                </div>
                {/* Account details for completed orders */}
                {order.status === 'Completed' && (
                  <div style={{ marginTop: '-8px', padding: '16px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '0 0 12px 12px', border: '1px solid rgba(34, 197, 94, 0.2)', borderTop: 'none' }}>
                    <div style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>🎉 Akkaunt ma'lumotlari:</div>
                    <div style={{ fontFamily: 'monospace', background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Admin tomonidan yuborilgan akkaunt login/paroli Telegram botingizga yoki shu yerga yoziladi. <br/>
                      <strong style={{color: 'var(--text-primary)'}}>Log/Parol olish uchun "Adminga yozish" tugmasi orqali aloqaga chiqing va Order ID ni ayting.</strong>
                    </div>
                  </div>
                )}
              </React.Fragment>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Package size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No purchases yet</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ flex: 1, minWidth: '200px', padding: '14px' }}>
            <CreditCard size={18} /> {t.topup || "Hisobni to'ldirish"}
          </button>
          <Link to="/sell-request" className="btn btn-secondary" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}>
            <ArrowUpRight size={18} /> {t.sellAccount || 'Akkaunt Sotish'}
          </Link>
          <Link to="/chat" className="btn btn-secondary" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
            <LogOut size={18} style={{ transform: 'rotate(180deg)' }} /> Adminga yozish
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Profile;
