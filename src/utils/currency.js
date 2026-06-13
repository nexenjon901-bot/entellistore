export const RATES = {
  USD: 1,
  UZS: 12600,
  RUB: 92,
};

export function convertFromUsd(usd, currency) {
  const amount = Number(usd) || 0;
  if (currency === 'USD') return amount;
  if (currency === 'UZS') return Math.round(amount * RATES.UZS);
  if (currency === 'RUB') return Math.round(amount * RATES.RUB);
  return amount;
}

export function formatMoney(amount, currency) {
  const n = Number(amount) || 0;
  if (currency === 'USD') return `$${n.toLocaleString('en-US')}`;
  if (currency === 'UZS') return `${n.toLocaleString('uz-UZ')} so'm`;
  if (currency === 'RUB') return `${n.toLocaleString('ru-RU')} ₽`;
  return String(n);
}

export function getPriceLines(usdPrice) {
  return [
    { currency: 'USD', amount: convertFromUsd(usdPrice, 'USD'), label: 'USD' },
    { currency: 'UZS', amount: convertFromUsd(usdPrice, 'UZS'), label: "So'm" },
    { currency: 'RUB', amount: convertFromUsd(usdPrice, 'RUB'), label: 'Rubl' },
  ];
}

export function getPaymentAmount(usdPrice, methodId) {
  if (methodId === 'uzcard') return { currency: 'UZS', amount: convertFromUsd(usdPrice, 'UZS') };
  if (methodId === 'visa') return { currency: 'USD', amount: convertFromUsd(usdPrice, 'USD') };
  return { currency: 'USD', amount: convertFromUsd(usdPrice, 'USD') };
}
