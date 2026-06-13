import React, { useState } from 'react';
import { MessageCircle, Phone, FileText, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react';
import { translations } from '../translations';

const TELEGRAM_USER = '@entelli_support';
const TELEGRAM_URL = 'https://t.me/entelli_support';
const PHONE_DISPLAY = '+998 90 810 76 00';
const PHONE_RAW = '+998908107600';

const FAQS_UZ = [
  { q: "Akkaunt sotib olgach qachon ma'lumotlari beriladi?", a: "To'lovni amalga oshirib, chekni yuborganingizdan so'ng, admin 5-15 daqiqa ichida tekshirib tasdiqlaydi va sizga login/parol yuboriladi." },
  { q: "Men o'z akkauntimni qanday sotsam bo'ladi?", a: '"Akkaunt Sotish" bo\'limiga kirib, akkauntingiz rasmlari, ma\'lumotlari va narxini kiritib adminga yuborasiz.' },
  { q: "Akkaunt ishonchliligiga qanday kafolat bor?", a: "Saytdagi barcha akkauntlar sotuvga qo'yilishidan oldin biz tomondan to'liq tekshiruvdan o'tkaziladi." },
  { q: "Cookie akkauntlar haqida nima bilishim kerak?", a: "Cookie random akkauntlarga garant berilmaydi. Akkaountni olganingizdan keyin barcha ma'lumotlarni tezda xavfsiz qilib oling." },
  { q: "Qanday to'lov usullari mavjud?", a: "Uzcard, Humo, Visa, Mastercard va Binance Pay (USDT) orqali to'lov qilish mumkin." },
];

const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };
  return (
    <button type="button" className="support-copy-btn" onClick={copy} aria-label={label}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'Nusxa olindi' : 'Nusxa olish'}
    </button>
  );
};

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`support-faq-item ${open ? 'open' : ''}`}>
      <button type="button" className="support-faq-trigger" onClick={() => setOpen(v => !v)}>
        <span>{q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="support-faq-body">{a}</div>}
    </div>
  );
};

const Support = ({ lang }) => {
  const t = translations[lang] || translations['uz'];
  const faqs = t.supportFaqs || FAQS_UZ;

  return (
    <div className="support-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container support-container">

        <div className="support-header">
          <div className="section-label" style={{ justifyContent: 'center' }}>{t.supportTitle}</div>
          <h1>{t.supportHeading} <span className="gradient-text">{t.supportHeadingAccent}</span></h1>
          <p>{t.supportSubtitle}</p>
        </div>

        {/* Quick contact bar — mobile sticky feel */}
        <div className="support-quick-bar">
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="support-quick-btn support-quick-telegram">
            <MessageCircle size={20} />
            <span>Telegram</span>
          </a>
          <a href={`tel:${PHONE_RAW}`} className="support-quick-btn support-quick-phone">
            <Phone size={20} />
            <span>{t.callUs}</span>
          </a>
        </div>

        {/* Contact cards */}
        <div className="support-contact-grid">
          <div className="support-contact-card support-contact-telegram">
            <div className="support-contact-icon telegram">
              <MessageCircle size={28} />
            </div>
            <h3>{t.contactTelegram}</h3>
            <p>{t.contactTelegramDesc}</p>
            <div className="support-contact-value">
              <span className="support-contact-label">Telegram</span>
              <strong>{TELEGRAM_USER}</strong>
            </div>
            <div className="support-contact-actions">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary support-action-btn">
                {t.writeTelegram} <ExternalLink size={16} />
              </a>
              <CopyButton text={TELEGRAM_USER} label="Telegram nusxalash" />
            </div>
          </div>

          <div className="support-contact-card support-contact-phone">
            <div className="support-contact-icon phone">
              <Phone size={28} />
            </div>
            <h3>{t.contactPhone}</h3>
            <p>{t.contactPhoneDesc}</p>
            <div className="support-contact-value">
              <span className="support-contact-label">{t.phoneNumber}</span>
              <strong dir="ltr">{PHONE_DISPLAY}</strong>
            </div>
            <div className="support-contact-actions">
              <a href={`tel:${PHONE_RAW}`} className="btn btn-primary support-action-btn">
                {t.callNow} <Phone size={16} />
              </a>
              <CopyButton text={PHONE_RAW} label="Telefon nusxalash" />
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="support-notice">
          <h4>⚠️ {t.cookieNoticeTitle}</h4>
          <p>{t.cookieNotice1}</p>
          <p>{t.cookieNotice2}</p>
          <p className="support-notice-strong">{t.cookieNotice3}</p>
        </div>

        {/* FAQ */}
        <div className="glass-panel support-faq-panel">
          <h3>
            <FileText size={20} color="var(--accent-primary)" />
            {t.faqTitle}
          </h3>
          <div className="support-faq-list">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
