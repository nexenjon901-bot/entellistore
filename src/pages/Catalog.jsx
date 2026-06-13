import React, { useContext, useState } from 'react';
import { translations } from '../translations';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { AuthContext } from '../AuthContext';

const Catalog = ({ lang }) => {
  const t = translations[lang] || translations['uz'];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLogin, setFilterLogin] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const { products } = useContext(AuthContext);

  let filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLogin = filterLogin === 'all' || p.loginType === filterLogin;
    return matchSearch && matchLogin;
  });

  if (sortBy === 'price-asc')  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'level-desc') filtered = [...filtered].sort((a, b) => b.level - a.level);

  const loginTypes = ['all', ...new Set(products.map(p => p.loginType).filter(Boolean))];

  return (
    <div className="catalog-page">
      <div className="container">

        {/* Header */}
        <div className="catalog-header">
          <div className="section-label">Marketplace</div>
          <h1>{t.catalog} <span className="gradient-text">Accounts</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9375rem' }}>
            {products.length} verified accounts available
          </p>
        </div>

        {/* Filters */}
        <div className="catalog-filters">
          {/* Search */}
          <div className="catalog-search-wrap">
            <Search size={16} className="catalog-search-icon" />
            <input
              type="text"
              className="catalog-search"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Login Type Filter */}
          <select
            className="filter-select"
            value={filterLogin}
            onChange={e => setFilterLogin(e.target.value)}
          >
            {loginTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="level-desc">Level: High → Low</option>
          </select>

          {/* Results count */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            <SlidersHorizontal size={14} />
            {filtered.length} results
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Package size={36} />
            </div>
            <h3>No accounts found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Try adjusting your filters or search term
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Catalog;
