import React, { useEffect, useState, useRef } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { trackViewItemList } from '../utils/gtm';
import { Tag, Sparkles, Filter } from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const hasFiredRef = useRef(false);

  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

  useEffect(() => {
    // Fire view_item_list ONCE when page loads
    if (!hasFiredRef.current) {
      trackViewItemList(MOCK_PRODUCTS, 'homepage_grid', 'Homepage Product Grid');
      hasFiredRef.current = true;
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/60 border border-slate-800 p-8 sm:p-10 mb-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> GA4 Tracking Test Environment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            GTM & GA4 E-Commerce Catalog
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Test and verify all GA4 E-commerce dataLayer events in real time. Hover over products, click to trigger <code className="text-amber-400 font-mono text-xs">select_item</code>, or view detail pages to trigger <code className="text-amber-400 font-mono text-xs">view_item</code>.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Event Fired on Load:</span>
              <span className="font-mono text-emerald-400 font-bold">view_item_list</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-2">
              <Tag className="w-3 h-3 text-amber-400" />
              <span>Container:</span>
              <span className="font-mono text-amber-400">GTM-KB5PV3ZB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Filter:</span>
        </div>
        <div className="flex items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            listId="homepage_grid"
            listName="Homepage Product Grid"
          />
        ))}
      </div>
    </div>
  );
};
