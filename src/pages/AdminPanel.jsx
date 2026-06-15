import React, { useState, useContext, useEffect } from 'react';
import { ShieldAlert, Users, TrendingUp, Trash2, Send, Eye, DollarSign, ShoppingBag, Upload, Edit, CheckCircle, XCircle, Home, LogOut, Menu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AuthContext, getSessionUser } from '../AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { formatMoney, convertFromUsd } from '../utils/currency';


// removed MOCK_CHATS

const SALES_DATA = [
  { name: 'Dush', sales: 4000, revenue: 2400 },
  { name: 'Sesh', sales: 3000, revenue: 1398 },
  { name: 'Chor', sales: 2000, revenue: 9800 },
  { name: 'Pay', sales: 2780, revenue: 3908 },
  { name: 'Juma', sales: 1890, revenue: 4800 },
  { name: 'Shan', sales: 2390, revenue: 3800 },
  { name: 'Yak', sales: 3490, revenue: 4300 },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    user, products, addProduct, deleteProduct,
    orders, updateOrderStatus, supportChats, sendSupportMessage,
    registeredUsers, updateUserStatus, apiOnline,
  } = useContext(AuthContext);

  const [newTitle, setNewTitle] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [newRank, setNewRank] = useState('');
  const [newSkins, setNewSkins] = useState('');
  const [newPremiumSkins, setNewPremiumSkins] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newLoginType, setNewLoginType] = useState('Twitter');
  const [newRating, setNewRating] = useState('4.8');
  const [isDragging, setIsDragging] = useState(false);

  // Chat state
  const [activeChatId, setActiveChatId] = useState('');
  const [chatInput, setChatInput] = useState('');
  
  // Set initial active chat if none selected and chats exist
  useEffect(() => {
    if (!activeChatId && supportChats.length > 0) {
      setActiveChatId(supportChats[0].userId);
    }
  }, [supportChats, activeChatId]);
  
  const [receiptModalImage, setReceiptModalImage] = useState(null);

  const regularUsers = registeredUsers.filter(u => u.role !== 'admin');
  const pendingOrders = orders.filter(o => !['Completed', 'Cancelled'].includes(o.status)).length;
  const totalRevenue = orders
    .filter(o => ['Completed', 'Approved', 'Account Sent'].includes(o.status))
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  const toggleUserStatus = (id, currentStatus) => {
    updateUserStatus(id, currentStatus === 'Active' ? 'Banned' : 'Active');
  };

  const sessionUser = user || getSessionUser();

  if (!sessionUser || sessionUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleAddProduct = async () => {
    if (!newTitle || !newPrice) return alert("Nomi va narxini kiriting");
    const ok = await addProduct({
      title: newTitle,
      level: Number(newLevel) || 1,
      rank: newRank || 'Bronze',
      skins: newSkins ? newSkins.split(',').map(s => s.trim()) : [],
      premiumSkins: Number(newPremiumSkins) || 0,
      age: newAge || '1 yil',
      price: Number(newPrice),
      image: newImage || '',
      loginType: newLoginType,
      rating: Number(newRating) || 4.8,
    });
    if (!ok) return;
    setNewTitle('');
    setNewLevel('');
    setNewRank('');
    setNewSkins('');
    setNewPremiumSkins('');
    setNewAge('');
    setNewPrice('');
    setNewImage('');
    setNewLoginType('Twitter');
    setNewRating('4.8');
    setActiveTab('accounts');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeChatId) return;
    sendSupportMessage(activeChatId, 'admin', chatInput.trim());
    setChatInput('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let scale = 1;
        if (img.width > MAX_WIDTH) {
          scale = MAX_WIDTH / img.width;
        }
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Compress to WebP at 70% quality
        setNewImage(canvas.toDataURL('image/webp', 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '4px' }}>Boshqaruv Paneli</div>
            <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 2.5rem)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldAlert color="var(--accent-primary)" size={32} />
              Admin Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: apiOnline ? '#22c55e' : '#ef4444' }}></div>
              {apiOnline ? 'Server on' : 'Server off'}
            </div>
            <Link to="/" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}>
              <Home size={16} /> <span className="hide-mobile">Saytga qaytish</span>
            </Link>
            <button onClick={() => window.location.href = '/login'} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px', color: '#ff4444', borderColor: 'rgba(255,68,68,0.3)' }}>
              <LogOut size={16} /> <span className="hide-mobile">Chiqish</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['dashboard', 'accounts', 'add-cookie', 'orders', 'user-management', 'users'].map(tab => (
            <button key={tab} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab(tab)} style={{ fontSize: '0.875rem' }}>
              {tab === 'dashboard' ? 'Statistika' : tab === 'accounts' ? 'Moderatsiya' : tab === 'add-cookie' ? "Yangi Cookie" : tab === 'orders' ? 'Buyurtmalar' : tab === 'user-management' ? 'Foydalanuvchilar' : 'Muloqot'}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="admin-stats-grid">
              <div className="glass-panel admin-stat"><div className="admin-stat-label"><Users size={18} /> Jami Foydalanuvchilar</div><div className="admin-stat-value">{regularUsers.length}</div></div>
              <div className="glass-panel admin-stat"><div className="admin-stat-label"><ShoppingBag size={18} /> Faol Listinglar</div><div className="admin-stat-value">{products.length}</div></div>
              <div className="glass-panel admin-stat"><div className="admin-stat-label"><TrendingUp size={18} /> Kutilayotgan</div><div className="admin-stat-value" style={{ color: 'var(--warning)' }}>{pendingOrders}</div></div>
              <div className="glass-panel admin-stat"><div className="admin-stat-label"><DollarSign size={18} /> Daromad</div><div className="admin-stat-value" style={{ color: 'var(--success)' }}>${totalRevenue.toLocaleString()}</div></div>
            </div>
            <div className="admin-charts-grid">
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Kunlik Daromad ($)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" />
                      <RechartsTooltip contentStyle={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Sotuvlar (dona)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" />
                      <RechartsTooltip contentStyle={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '8px' }} />
                      <Bar dataKey="sales" fill="var(--warning)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'add-cookie' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '24px' }}>Saytga yangi cookie joylash</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>Rasm joylash (Screnshot)</label>
                <div 
                  onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement('canvas');
                          const MAX_WIDTH = 800;
                          let scale = 1;
                          if (img.width > MAX_WIDTH) scale = MAX_WIDTH / img.width;
                          canvas.width = img.width * scale;
                          canvas.height = img.height * scale;
                          const ctx = canvas.getContext('2d');
                          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                          setNewImage(canvas.toDataURL('image/webp', 0.7));
                        };
                        img.src = reader.result;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onClick={() => document.getElementById('admin-file-upload').click()}
                  style={{ 
                    border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-color)'}`, 
                    background: isDragging ? 'var(--accent-muted)' : 'transparent',
                    padding: '32px', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  {newImage ? (
                    <div style={{ position: 'relative' }}>
                      <img src={newImage} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()} />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setNewImage(''); }} className="btn btn-secondary" style={{ marginTop: '12px', display: 'block', margin: '12px auto 0' }}>Boshqa rasm yuklash</button>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} style={{ margin: '0 auto 12px', color: 'var(--accent-primary)' }} />
                      <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>Rasmni shu yerga tashlang yoki tanlang</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>PNG, JPG, WEBP (Maks: 5MB)</p>
                    </>
                  )}
                  <input id="admin-file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>Nomi</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Twitter Session..." className="admin-input" />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Daraja (Level)</label>
                  <input type="number" value={newLevel} onChange={(e) => setNewLevel(e.target.value)} placeholder="75" className="admin-input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Rank</label>
                  <input type="text" value={newRank} onChange={(e) => setNewRank(e.target.value)} placeholder="Conqueror" className="admin-input" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>Skinlar (vergul bilan)</label>
                <textarea rows="3" value={newSkins} onChange={(e) => setNewSkins(e.target.value)} placeholder="M416 Glacier, Blood Raven..." className="admin-input" style={{ resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Premium Skinlar soni</label>
                  <input type="number" value={newPremiumSkins} onChange={(e) => setNewPremiumSkins(e.target.value)} placeholder="Misol uchun: 5" className="admin-input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Ochilgan yili</label>
                  <input type="text" value={newAge} onChange={(e) => setNewAge(e.target.value)} placeholder="Misol uchun: 2 yil" className="admin-input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Ulangan turi</label>
                  <select value={newLoginType} onChange={(e) => setNewLoginType(e.target.value)} className="admin-input">
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google">Google</option>
                    <option value="VK">VK</option>
                    <option value="GameCenter">GameCenter</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Baho (Rating)</label>
                  <input type="number" step="0.1" value={newRating} onChange={(e) => setNewRating(e.target.value)} placeholder="4.8" className="admin-input" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>Narxi ($)</label>
                <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="350" className="admin-input" />
              </div>
              <button type="button" onClick={handleAddProduct} className="btn btn-primary" style={{ marginTop: '8px' }}>Saytga joylash</button>
            </form>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>Barcha Cookie Akkauntlar</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Nomi</th><th>Narxi</th><th>Ko'rishlar</th><th>Harakat</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(acc => (
                    <tr key={acc.id}>
                      <td>{acc.id}</td>
                      <td>{acc.title}</td>
                      <td style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {formatMoney(acc.price, 'USD')}<br/>
                        <small style={{ color: 'var(--text-muted)' }}>{formatMoney(convertFromUsd(acc.price, 'UZS'), 'UZS')}</small>
                      </td>
                      <td>{acc.views} <Eye size={14} style={{ display: 'inline', color: 'var(--text-secondary)' }} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn" style={{ padding: '6px 12px', background: 'var(--success)', color: '#fff', borderRadius: '4px', fontSize: '0.875rem' }}><CheckCircle size={14} /> Approve</button>
                          <button className="btn" style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', color: '#fff', borderRadius: '4px', fontSize: '0.875rem' }}><Edit size={14} /> Edit</button>
                          <button onClick={() => deleteProduct(acc.id)} className="btn" style={{ padding: '6px 12px', background: 'var(--accent-primary)', color: '#fff', borderRadius: '4px', fontSize: '0.875rem' }}><Trash2 size={14} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3>Order Management</h3>
            <table className="admin-table" style={{ marginTop: '20px' }}>
              <thead>
                <tr><th>Order ID</th><th>User</th><th>Amount</th><th>Status</th><th>Receipt</th><th>Action</th></tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}<br/><small style={{color: 'var(--text-muted)'}}>{order.productTitle}</small></td>
                    <td>{order.user}</td>
                    <td style={{ color: 'var(--success)' }}>${order.amount}</td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateOrderStatus(order.id, val);
                          if (val === 'Approved') {
                            sendSupportMessage(order.userId || order.user, 'admin', `Tabriklaymiz! Sizning to'lovingiz tasdiqlandi. ${order.productTitle} akkaunti ma'lumotlari tez orada yuboriladi.`);
                          } else if (val === 'Account Sent') {
                            sendSupportMessage(order.userId || order.user, 'admin', `✅ Buyurtma qilingan akkaunt ma'lumotlari:\nLogin: cookie_user_${order.id.split('-')[1]}\nParol: pass_${Math.floor(1000 + Math.random() * 9000)}\n\nIltimos, akkauntga kirib ma'lumotlarni o'zgartiring va tasdiqlang!`);
                          }
                        }}
                        className="admin-input"
                        style={{
                           padding: '4px 8px', 
                           background: order.status === 'Completed' ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-tertiary)',
                           color: order.status === 'Completed' ? 'var(--success)' : 'var(--text-primary)',
                           border: 'none',
                           width: 'auto'
                        }}
                      >
                        <option value="Pending Payment">Kutilmoqda</option>
                        <option value="Payment Review">Tekshirilmoqda</option>
                        <option value="Approved">Tasdiqlandi (Xabar yuborish)</option>
                        <option value="Account Sent">Berildi (Ma'lumot yuborish)</option>
                        <option value="Completed">Yakunlandi</option>
                        <option value="Cancelled">Bekor qilindi</option>
                      </select>
                    </td>
                    <td>
                      {order.receiptImage ? (
                        <button 
                          onClick={() => setReceiptModalImage(order.receiptImage)}
                          className="btn btn-secondary" 
                          style={{ color: 'var(--accent-primary)', padding: '4px 8px', fontSize: '0.875rem' }}
                        >
                          Chekni ko'rish
                        </button>
                      ) : (
                        <span style={{color: 'var(--text-muted)'}}>Yuklanmagan</span>
                      )}
                    </td>
                    <td><button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.875rem' }}>View</button></td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>Hozircha buyurtmalar yo'q</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'user-management' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3>User Management</h3>
            <table className="admin-table" style={{ marginTop: '20px' }}>
              <thead>
                <tr><th>User ID</th><th>Name</th><th>Status</th><th>Verified</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {regularUsers.length > 0 ? regularUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}{u.email ? <><br/><small style={{color: 'var(--text-muted)'}}>{u.email}</small></> : null}</td>
                    <td><span style={{ color: u.status === 'Active' ? '#22c55e' : '#ff3333' }}>{u.status}</span></td>
                    <td>{u.verified ? 'Yes' : 'No'}</td>
                    <td>
                      {u.status === 'Active' ? (
                        <button onClick={() => toggleUserStatus(u.id, u.status)} className="btn btn-secondary" style={{ color: '#ff3333', padding: '4px 8px', fontSize: '0.875rem' }}><XCircle size={14} /> Ban</button>
                      ) : (
                        <button onClick={() => toggleUserStatus(u.id, u.status)} className="btn btn-secondary" style={{ color: '#22c55e', padding: '4px 8px', fontSize: '0.875rem' }}><CheckCircle size={14} /> Unban</button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>Hozircha ro'yxatdan o'tgan foydalanuvchilar yo'q</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-panel admin-chat-panel">
            <div className="chat-sidebar">
              <h4 style={{ marginBottom: '16px' }}>Foydalanuvchilar</h4>
              {supportChats.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chatlar yo'q</div>}
              {supportChats.map(chat => (
                <div key={chat.userId} onClick={() => setActiveChatId(chat.userId)} className={`chat-user-item ${activeChatId === chat.userId ? 'active' : ''}`}>
                  {chat.label}
                </div>
              ))}
            </div>
            <div className="chat-main">
              <h4 style={{ marginBottom: '16px' }}>Muloqot: {activeChatId}</h4>
              <div className="chat-messages" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {supportChats.find(c => c.userId === activeChatId)?.messages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.from === 'admin' ? 'admin' : 'user'}`} style={{ maxWidth: '85%', alignSelf: msg.from === 'admin' ? 'flex-end' : 'flex-start' }}>
                    {msg.text}
                    <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '4px', textAlign: msg.from === 'admin' ? 'right' : 'left' }}>
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input
                  type="text"
                  placeholder="Xabar yozish..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="admin-input"
                />
                <button onClick={handleSendMessage} className="btn btn-primary" style={{ padding: '12px 24px' }}><Send size={18} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {receiptModalImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setReceiptModalImage(null)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button 
              onClick={() => setReceiptModalImage(null)}
              style={{
                position: 'absolute', top: '-40px', right: 0,
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <XCircle size={24} /> Yopish
            </button>
            <img 
              src={receiptModalImage} 
              alt="To'lov cheki" 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} 
              onClick={e => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
