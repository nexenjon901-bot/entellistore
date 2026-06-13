import React from 'react';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '36px', height: '36px', flexShrink: 0 }}
    >
      <rect width="48" height="48" rx="10" fill="#F2A900" opacity="0.12" />
      <path
        d="M10 14h18l5 6H20l-2 4 2 4h13l-5 6H10l4-6-2-4 2-4-4-6z"
        fill="#F2A900"
      />
      <path
        d="M24 22h8l4 5-4 5h-8l4-5-4-5z"
        fill="#FFC72C"
        opacity="0.8"
      />
    </svg>
    <span style={{
      fontSize: '1.25rem',
      fontWeight: 900,
      letterSpacing: '0.5px',
      fontFamily: 'Outfit, sans-serif',
      lineHeight: 1,
    }}>
      ENTELLI<span style={{ color: 'var(--accent-primary)' }}>STORE</span>
    </span>
  </div>
);

export default Logo;
