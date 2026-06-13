import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { translations } from '../translations';
import { User, Lock, Globe, Eye, EyeOff, ShieldCheck, Mail, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('uzb');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, register, loginWithGoogle } = useContext(AuthContext);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const navigate = useNavigate();
  const t = translations[lang] || translations['uz'];
  const [error, setError] = useState('');

  const resetForm = () => {
    setError('');
    setPassword('');
    setConfirmPassword('');
    setAgreedTerms(false);
  };

  const validateRegister = () => {
    const normalized = username.trim().toLowerCase();
    if (normalized.length < 3) {
      setError(t.errUsernameShort);
      return false;
    }
    if (!/^[a-z0-9_]+$/.test(normalized)) {
      setError(t.errUsernameFormat);
      return false;
    }
    if (password.length < 8) {
      setError(t.errPasswordShort);
      return false;
    }
    if (password !== confirmPassword) {
      setError(t.errPasswordMismatch);
      return false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.errEmailInvalid);
      return false;
    }
    if (!agreedTerms) {
      setError(t.errTermsRequired);
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLogin) {
        if (!username.trim() || !password) {
          setError(t.errFieldsRequired);
          return;
        }
        const result = await login(username.trim(), password);
        if (result.ok) {
          navigate(result.user.role === 'admin' ? '/admin' : '/profile');
        } else {
          setError(result.error || t.errLoginFailed);
        }
      } else {
        if (!validateRegister()) return;
        const result = await register(username.trim(), password, region, email.trim());
        if (result.ok) {
          navigate('/profile');
        } else {
          setError(result.error || t.errRegisterFailed);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  const strengthLabels = [t.strengthWeak, t.strengthFair, t.strengthGood, t.strengthStrong];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at center top, rgba(242,169,0,0.06) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={28} color="var(--accent-primary)" />
            </div>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            {isLogin ? t.welcomeBack : t.createAccount}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isLogin ? t.loginSubtitle : t.registerSubtitle}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{
            display: 'flex',
            background: 'var(--bg-primary)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '28px',
            border: '1px solid var(--border-color)',
          }}>
            {[
              { label: t.login, val: true },
              { label: t.register, val: false },
            ].map(({ label, val }) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => { setIsLogin(val); resetForm(); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'var(--transition)',
                  background: isLogin === val
                    ? 'linear-gradient(135deg, #F2A900, #FFC72C)'
                    : 'transparent',
                  color: isLogin === val ? '#0B0B0B' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                {t.usernameLabel}
              </label>
              <div style={{ position: 'relative' }}>
                <User size={17} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder={t.usernamePlaceholder}
                  className="input-field"
                  style={{ paddingLeft: '44px' }}
                  autoComplete="username"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                  {t.emailLabel} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({t.optional})</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                    autoComplete="email"
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                {t.passwordLabel}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {!isLogin && password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i < strength ? strengthColors[strength - 1] : 'var(--bg-tertiary)',
                        transition: 'var(--transition)',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strengthColors[Math.max(0, strength - 1)] || 'var(--text-muted)' }}>
                    {strength > 0 ? strengthLabels[strength - 1] : ''}
                  </span>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                  {t.confirmPasswordLabel}
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="input-field"
                    style={{ paddingLeft: '44px', paddingRight: '44px' }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(v => !v)}
                    style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    {showConfirmPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                  {t.regionLabel} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({t.regionHint})</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Globe size={17} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '44px', cursor: 'pointer' }}
                  >
                    <option value="uzb">Uzbekistan (O'zbek)</option>
                    <option value="rus">Russia (Русский)</option>
                    <option value="usa">USA (English)</option>
                    <option value="uae">UAE (العربية)</option>
                  </select>
                </div>
              </div>
            )}

            {!isLogin && (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--accent-primary)' }}
                />
                <span>{t.termsAgree}</span>
              </label>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ marginTop: '8px', width: '100%', padding: '14px', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  {t.processing}
                </span>
              ) : (
                isLogin ? t.login : t.register
              )}
            </button>

            {googleClientId && (
              <div className="google-login-wrap">
                <div className="login-divider">{t.orContinueWith}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={async (response) => {
                      setSubmitting(true);
                      setError('');
                      const result = await loginWithGoogle(response.credential);
                      if (result.ok) {
                        navigate(result.user.role === 'admin' ? '/admin' : '/profile');
                      } else {
                        setError(result.error);
                      }
                      setSubmitting(false);
                    }}
                    onError={() => setError('Google orqali kirish bekor qilindi')}
                    theme="filled_black"
                    size="large"
                    width="100%"
                    text={isLogin ? 'signin_with' : 'signup_with'}
                    locale={lang === 'uz' ? 'uz' : lang === 'ru' ? 'ru' : lang === 'ar' ? 'ar' : 'en'}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {t.termsFooter}
        </p>
      </div>
    </div>
  );
};

export default Login;
