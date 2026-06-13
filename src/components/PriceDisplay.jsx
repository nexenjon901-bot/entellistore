import React from 'react';
import { getPriceLines, formatMoney } from '../utils/currency';

const PriceDisplay = ({ usdPrice, compact = false, primary = 'USD' }) => {
  const lines = getPriceLines(usdPrice);
  const ordered = [
    lines.find(l => l.currency === primary),
    ...lines.filter(l => l.currency !== primary),
  ].filter(Boolean);

  if (compact) {
    const main = ordered[0];
    return (
      <div className="price-display compact">
        <span className="price-main">{formatMoney(main.amount, main.currency)}</span>
        <span className="price-alt">
          {ordered.slice(1).map(l => formatMoney(l.amount, l.currency)).join(' · ')}
        </span>
      </div>
    );
  }

  return (
    <div className="price-display">
      {ordered.map(line => (
        <div key={line.currency} className={`price-line ${line.currency === primary ? 'primary' : ''}`}>
          <span className="price-label">{line.label}</span>
          <span className="price-value">{formatMoney(line.amount, line.currency)}</span>
        </div>
      ))}
    </div>
  );
};

export default PriceDisplay;
