import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../translations';
import { Shield, Trophy, Star, Gem, Clock, UserCheck, Eye } from 'lucide-react';
import PriceDisplay from './PriceDisplay';

const ProductCard = ({ product, lang }) => {
  const t = translations[lang] || translations['uz'];

  let tierClass = 'tier-budget';
  let tierText = t.tierBudget;

  if (product.price >= 100) {
    tierClass = 'tier-premium';
    tierText = t.tierPremium;
  } else if (product.price >= 20) {
    tierClass = 'tier-mid';
    tierText = t.tierMid;
  }

  return (
    <div className="product-card" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="card-header">
        <span className={`tier-badge ${tierClass}`}>{tierText}</span>
        <span className="card-id">#{product.id}</span>
      </div>

      {/* Image */}
      <div className="card-image">
        <div className="card-rating">
          <Star size={11} fill="currentColor" /> {product.rating || '4.5'}
        </div>
        {product.image ? (
          <img src={product.image} alt={product.title} className="card-img" />
        ) : (
          <div className="card-placeholder">
            <Trophy size={40} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {product.title}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="card-title">{product.title}</h3>

      {/* Stats */}
      <div className="card-stats">
        <div><Trophy size={13} color="var(--accent-primary)" /> <strong>{product.rank}</strong></div>
        <div><Shield size={13} color="#60a5fa" /> Lv: <strong>{product.level}</strong></div>
        <div><Gem size={13} color="#a855f7" /> <strong>{product.premiumSkins || 0}</strong> skins</div>
        <div><Clock size={13} color="#34d399" /> <strong>{product.age || '1 yil'}</strong></div>
      </div>

      {/* Tags */}
      <div className="card-tags">
        <span className="tag tag-verified">
          <UserCheck size={11} /> {product.loginType || 'Verified'}
        </span>
        {(product.skins || []).slice(0, 2).map((skin, idx) => (
          <span key={idx} className="tag">{skin}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div>
          <PriceDisplay usdPrice={product.price} compact primary={lang === 'uz' ? 'UZS' : lang === 'ru' ? 'RUB' : 'USD'} />
          <div className="card-views"><Eye size={11} /> {product.views || 0} views</div>
        </div>
        <Link to={`/payment/${product.id}`} className="btn btn-primary btn-buy">
          {t.buyNow}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
