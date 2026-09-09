import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Tag, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              🛒
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight flex items-center gap-2">
                GA4 TrackLab
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  GTM Demo
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">GTM & GA4 DataLayer Testing Sandbox</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Products
            </Link>

            <Link
              to="/cart"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                isActive('/cart')
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-extrabold rounded-full bg-emerald-500 text-slate-950 font-mono shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              to="/checkout"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/checkout')
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Checkout</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Link>
          </nav>

          {/* GTM Tag Placeholder Display */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Container ID:</span>
            <span className="text-amber-400 font-bold">GTM-KB5PV3ZB</span>
          </div>
        </div>
      </div>
    </header>
  );
};
