import React, { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { translations } from '../translations';
import { User, CreditCard, ArrowUpRight, LogOut, ShoppingBag, Package, Clock, Star, Zap } from 'lucide-react';

const Profile = ({ lang }) => {
  const { user, logout, orders } = useContext(AuthContext);
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

  // Fallback translations if not present in translations.js
  const t_profile = t.profile || "Shaxsiy Kabinet";
  const t_logout = t.logout || "Chiqish";
  const t_topup = t.topup || "Hisobni to'ldirish";
  const t_sellAccount = t.sellAccount || "Akkaunt Sotish";
  const t_balance = lang === 'uz' ? 'Balans' : lang === 'ru' ? 'Баланс' : lang === 'ar' ? 'الرصيد' : 'Balance';
  const t_purchases = lang === 'uz' ? 'Xaridlar' : lang === 'ru' ? 'Покупки' : lang === 'ar' ? 'المشتريات' : 'Purchases';
  const t_account = lang === 'uz' ? 'Akkaunt' : lang === 'ru' ? 'Аккаунт' : lang === 'ar' ? 'الحساب' : 'Account';
  const t_active = lang === 'uz' ? 'Faol' : lang === 'ru' ? 'Активен' : lang === 'ar' ? 'نشط' : 'Active';
  const t_admin = lang === 'uz' ? 'Administrator' : lang === 'ru' ? 'Администратор' : lang === 'ar' ? 'المسؤول' : 'Administrator';
  const t_member = lang === 'uz' ? 'Foydalanuvchi' : lang === 'ru' ? 'Участник' : lang === 'ar' ? 'عضو' : 'Member';
  const t_recentActivity = lang === 'uz' ? "So'nggi faollik" : lang === 'ru' ? 'Последняя активность' : lang === 'ar' ? 'النشاط الأخير' : 'Recent Activity';
  const t_noPurchases = lang === 'uz' ? "Hali xaridlar yo'q" : lang === 'ru' ? 'Пока нет покупок' : lang === 'ar' ? 'لا توجد مشتريات بعد' : 'No purchases yet';
  const t_accountDetails = lang === 'uz' ? "Akkaunt ma'lumotlari:" : lang === 'ru' ? 'Данные аккаунта:' : lang === 'ar' ? 'تفاصيل الحساب:' : 'Account details:';
  const t_adminMessageInfo = lang === 'uz' ? "Admin tomonidan yuborilgan akkaunt login/paroli Telegram botingizga yoki shu yerga yoziladi." : lang === 'ru' ? "Логин/пароль от аккаунта, отправленные админом, будут написаны в ваш Telegram бот или сюда." : lang === 'ar' ? "سيتم كتابة بيانات تسجيل الدخول التي يرسلها المسؤول في بوت تيليجرام الخاص بك أو هنا." : "Account login/password sent by admin will be written to your Telegram bot or here.";
  const t_contactAdmin = lang === 'uz' ? 'Log/Parol olish uchun "Adminga yozish" tugmasi orqali aloqaga chiqing va Order ID ni ayting.' : lang === 'ru' ? 'Для получения логина/пароля свяжитесь через кнопку "Написать админу" и назовите Order ID.' : lang === 'ar' ? 'للحصول على بيانات تسجيل الدخول، تواصل عبر زر "مراسلة المسؤول" واذكر رقم الطلب.' : 'To get login/password, contact via "Message Admin" button and provide Order ID.';
  const t_messageAdmin = lang === 'uz' ? 'Adminga yozish' : lang === 'ru' ? 'Написать админу' : lang === 'ar' ? 'مراسلة المسؤول' : 'Message Admin';

  const stats = [
    { label: 'User ID', value: user.id, icon: User },
    { label: t_balance, value: `$${user.balance || '0.00'}`, icon: CreditCard, color: 'var(--accent-primary)' },
    { label: t_purchases, value: `${myOrders.length}`, icon: ShoppingBag },
  ];

  return (
    <div style={{ padding: '80px 0', minHeight: '80vh', position: 'relative' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="hero-bg" style={{ opacity: 0.4 }}>
        <div className="hero-glow-1" style={{ top: '-10%', left: '-10%', width: '500px', height: '500px' }} />
        <div className="hero-glow-2" style={{ bottom: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)' }} />
      </div>

      <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
        
        {/* Page Title */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Star size={28} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }} className="gradient-text">{t_profile}</h1>
        </div>

        {/* Header card */}
        <div className="glass-panel hover-glow" style={{ padding: '40px', marginBottom: '32px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '30%', background: 'linear-gradient(90deg, transparent, rgba(242,169,0,0.05))' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <label htmlFor="profile-img-input" style={{ cursor: 'pointer', position: 'relative' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '20px',
                  background: 'var(--bg-tertiary)',
                  border: '2px solid var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 0 25px rgba(242,169,0,0.3)',
                  transition: 'transform 0.3s ease',
                }} className="profile-img-wrap">
                  {profileImage
                    ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <User size={48} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
                  }
                  <div className="profile-img-overlay" style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s',
                    fontSize: '0.8rem', color: '#fff', fontWeight: 600, backdropFilter: 'blur(2px)'
                  }}>
                    EDIT
                  </div>
                </div>
                <input id="profile-img-input" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              
              <div>
                <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '4px' }}>{t_account}</div>
                <h2 style={{ fontSize: '2rem', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{user.username}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px rgba(34,197,94,0.6)' }} />
                  {t_active} • <span style={{ color: user.role === 'admin' ? 'var(--warning)' : 'inherit' }}>{user.role === 'admin' ? t_admin : t_member}</span>
                </div>
              </div>
            </div>
            
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
              <LogOut size={18} color="var(--danger)" /> 
              <span style={{ color: 'var(--text-primary)' }}>{t_logout}</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', transition: 'transform 0.2s', cursor: 'default' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color || 'var(--text-muted)' }}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <Zap size={20} color="var(--accent-primary)" /> {t_recentActivity}
            </h3>
          </div>
          
          {myOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myOrders.map(order => (
              <React.Fragment key={order.id}>
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '20px', background: 'rgba(255,255,255,0.02)', 
                  borderRadius: order.status === 'Completed' ? '16px 16px 0 0' : '16px', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'background 0.2s'
                }} className="order-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={20} color="var(--accent-primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '1.05rem' }}>{order.productTitle}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={12} /> {new Date(order.date).toLocaleDateString()} • ID: {order.id}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '6px', fontSize: '1.1rem' }}>${order.amount}</div>
                    <div style={{ 
                      fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                      background: order.status === 'Completed' ? 'rgba(34,197,94,0.1)' : order.status === 'Cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(242,169,0,0.1)',
                      color: order.status === 'Completed' ? '#4ade80' : order.status === 'Cancelled' ? '#f87171' : '#facc15'
                    }}>
                      {order.status}
                    </div>
                  </div>
                </div>
                {/* Account details for completed orders */}
                {order.status === 'Completed' && (
                  <div style={{ 
                    marginTop: '-12px', padding: '20px', 
                    background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)', 
                    borderRadius: '0 0 16px 16px', border: '1px solid rgba(34, 197, 94, 0.2)', borderTop: 'none' 
                  }}>
                    <div style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                      {t_accountDetails}
                    </div>
                    <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {t_adminMessageInfo} <br/><br/>
                      <strong style={{color: 'var(--text-primary)'}}>{t_contactAdmin}</strong>
                    </div>
                  </div>
                )}
              </React.Fragment>
              ))}
            </div>
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Package size={32} color="var(--text-muted)" />
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{t_noPurchases}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <button className="btn btn-primary" style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '16px', boxShadow: '0 0 20px rgba(242,169,0,0.3)' }}>
            <CreditCard size={20} /> {t_topup}
          </button>
          <Link to="/sell-request" className="btn btn-secondary" style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <ArrowUpRight size={20} color="var(--success)" /> {t_sellAccount}
          </Link>
          <Link to="/chat" className="btn btn-secondary" style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)' }}>
            <LogOut size={20} style={{ transform: 'rotate(180deg)', color: 'var(--info)' }} /> {t_messageAdmin}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Profile;
