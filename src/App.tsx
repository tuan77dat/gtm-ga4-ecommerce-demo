import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { FloatingDebugPanel } from './components/FloatingDebugPanel';
import { EventToast } from './components/EventToast';

import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ThankYouPage } from './pages/ThankYouPage';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
          <div>
            <Navbar />
            <EventToast />
            <main>
              <Routes>
                <Route path="/" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
              </Routes>
            </main>
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-800 bg-slate-900/60 py-8 mt-16 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-200">GTM & GA4 E-Commerce DataLayer Sandbox</span>
                <p className="text-slate-500 mt-0.5">
                  Built for testing Google Tag Manager triggers, GA4 Ecommerce tags, and dataLayer.push resets.
                </p>
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span className="bg-slate-800 border border-slate-700/60 px-2.5 py-1 rounded-md">
                  Container: <span className="text-amber-400">GTM-KB5PV3ZB</span>
                </span>
                <span className="bg-slate-800 border border-slate-700/60 px-2.5 py-1 rounded-md text-emerald-400">
                  GA4 Schema Validated
                </span>
              </div>
            </div>
          </footer>

          {/* On-Screen Floating Inspector */}
          <FloatingDebugPanel />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
