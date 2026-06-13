import React, { useContext, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { Clock, CheckCircle, ArrowLeft, Upload, X } from 'lucide-react';
import PriceDisplay from '../components/PriceDisplay';
import { getPaymentAmount, formatMoney, convertFromUsd } from '../utils/currency';

const PAYMENT_METHODS = [
  { id: 'uzcard', label: 'Uzcard / Humo', icon: '💳', detail: '5614 6803 7074 0553', owner: 'MILYAZOV UCHQUNBEK', currency: 'UZS' },
  { id: 'visa', label: 'Visa (USD)', icon: '💳', detail: '4916 9903 2963 7877', owner: 'MILYAZOVA DILFUZA', currency: 'USD' },
  { id: 'binance', label: 'Binance (USDT)', icon: '🪙', detail: '866038150', owner: 'KNOWME707', currency: 'USD' },
];

const Payment = ({ lang }) => {
  const { id } = useParams();
  const { user, products, addOrder } = useContext(AuthContext);
  const [selectedMethod, setSelectedMethod] = useState('uzcard');
  const [receiptSent, setReceiptSent] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const product = products?.find(p => p.id === id);
  const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);

  const handleFile = f => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeFile = e => {
    e.stopPropagation();
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(method.detail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '60px 0 80px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '640px' }}>

        {/* Back link */}
        <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '32px', transition: 'var(--transition)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        {/* Title */}
        <div style={{ marginBottom: '28px' }}>
          <div className="section-label">Checkout</div>
          <h1 style={{ fontSize: '1.75rem' }}>
            Payment <span className="gradient-text">#{id}</span>
          </h1>
          {product && (
            <div style={{ marginTop: '12px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{product.title}</p>
              <PriceDisplay usdPrice={product.price} primary={lang === 'uz' ? 'UZS' : lang === 'ru' ? 'RUB' : 'USD'} />
            </div>
          )}
        </div>

        {!receiptSent ? (
          <div className="glass-panel" style={{ padding: '32px' }}>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {['Payment Method', 'Send Receipt', 'Confirmation'].map((s, i) => (
                <React.Fragment key={s}>
                  <span style={{ color: i === 0 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: i === 0 ? 700 : 400 }}>
                    {s}
                  </span>
                  {i < 2 && <span>›</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Payment method tabs */}
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>
              To'lov usulini tanlang
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    fontFamily: 'Outfit, sans-serif',
                    border: `2px solid ${selectedMethod === m.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    background: selectedMethod === m.id ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
                    color: selectedMethod === m.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {product && (
              <div className="payment-price-box">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To'lov summasi ({method.label})</div>
                <div className="payment-amount-highlight">
                  {formatMoney(getPaymentAmount(product.price, selectedMethod).amount, getPaymentAmount(product.price, selectedMethod).currency)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Barcha valyutalar: {formatMoney(product.price, 'USD')} · {formatMoney(convertFromUsd(product.price, 'UZS'), 'UZS')} · {formatMoney(convertFromUsd(product.price, 'RUB'), 'RUB')}
                </div>
              </div>
            )}

            {/* Account info */}
            <div style={{
              background: 'var(--bg-tertiary)',
              borderRadius: '14px',
              padding: '20px 24px',
              marginBottom: '20px',
              border: '1px solid var(--border-color)',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Hamyon / Karta raqami
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                    {method.detail}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '6px' }}>
                    Egasi: {method.owner}
                  </div>
                </div>
                <button onClick={copyToClipboard} className="btn btn-sm btn-secondary" style={{ flexShrink: 0 }}>
                  {copied ? '✓ Nusxa' : 'Nusxa'}
                </button>
              </div>
            </div>

            {/* Warning */}
            <div style={{
              background: 'rgba(242,169,0,0.06)',
              border: '1px solid rgba(242,169,0,0.2)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '24px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}>
              <Clock size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                To'lovni amalga oshirgach, chekni (rasmini) yuborishingiz kerak.
                Agar to'lov cheki <strong style={{ color: 'var(--accent-primary)' }}>5–15 daqiqa</strong> ichida yuborilmasa,
                to'lov avtomatik bekor qilinadi.
              </p>
            </div>

            {/* Upload zone */}
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>
              To'lov chekini yuklang
            </label>
            <div
              onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => !preview && document.getElementById('payment-upload').click()}
              style={{
                border: `2px dashed ${isDragging ? 'var(--accent-primary)' : preview ? 'var(--success)' : 'var(--border-color)'}`,
                borderRadius: '14px',
                background: isDragging ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
                transition: 'var(--transition)',
                cursor: preview ? 'default' : 'pointer',
                overflow: 'hidden',
                marginBottom: '20px',
                minHeight: preview ? 'auto' : '130px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!preview ? (
                <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <Upload size={28} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                    To'lov chekini bu yerga tashlang yoki tanlang
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>PNG, JPG, WEBP</p>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%' }}>
                  <img src={preview} alt="Receipt" style={{ width: '100%', maxHeight: '220px', objectFit: 'contain', background: '#000', display: 'block' }} />
                  <button onClick={removeFile} style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', cursor: 'pointer',
                  }}>
                    <X size={16} />
                  </button>
                </div>
              )}
              <input id="payment-upload" type="file" accept="image/*"
                onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
                style={{ display: 'none' }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={async () => {
                if (!file) {
                  alert("Iltimos, avval to'lov chekini yuklang!");
                  return;
                }
                const orderId = await addOrder({
                  productId: product.id,
                  productTitle: product.title,
                  user: user.username,
                  userId: user.id,
                  amount: product.price,
                  paymentMethod: selectedMethod,
                  receiptImage: preview,
                });
                if (orderId) setReceiptSent(true);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '15px', fontSize: '1rem' }}
            >
              To'lov qildim — Chekni yuborish
            </button>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', animation: 'pulse-glow 2s infinite',
            }}>
              <CheckCircle size={40} color="var(--success)" />
            </div>
            <h2 style={{ marginBottom: '16px' }}>Chek muvaffaqiyatli yuborildi!</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 32px' }}>
              Admin to'lovni tekshirmoqda. Bu <strong style={{ color: 'var(--text-primary)' }}>5–15 daqiqa</strong> vaqt olishi mumkin.
              Tasdiqlangach, akkaunt ma'lumotlari yuboriladi.
            </p>
            <Link to="/catalog" className="btn btn-secondary" style={{ padding: '12px 32px' }}>
              Katalogga qaytish
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
