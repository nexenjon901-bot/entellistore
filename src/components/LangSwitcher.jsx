import React from 'react';

export const LANG_OPTIONS = [
  { value: 'uz', label: "O'zbek", short: 'UZ' },
  { value: 'ru', label: 'Русский', short: 'RU' },
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'ar', label: 'العربية', short: 'AR' },
];

const LangSwitcher = ({ lang, setLang, onSelect }) => (
  <select
    className="lang-select"
    value={lang}
    onChange={e => {
      setLang(e.target.value);
      onSelect?.(e.target.value);
    }}
    aria-label="Tilni tanlash"
  >
    {LANG_OPTIONS.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.short}
      </option>
    ))}
  </select>
);

export default LangSwitcher;
