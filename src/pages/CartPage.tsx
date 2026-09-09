import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { trackViewCart } from '../utils/gtm';
import { Trash2, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, itemCount } = useCart();
  const navigate = useNavigate();
  const hasFiredRef = useRef(false);

  useEffect(() => {
    // Fire view_cart ONCE on page mount regardless of whether cart is empty or not
    if (!hasFiredRef.current) {
      trackViewCart(cartItems, cartTotal);
      hasFiredRef.current = true;
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-indigo-400" /> Shopping Cart
            <span className="text-sm font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
              {itemCount} Items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Triggered GA4 Event on Mount: <code className="text-emerald-400 font-mono font-bold">view_cart</code>
          </p>
        </div>

        <Link
          to="/"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl inline-flex items-center gap-2 border border-slate-700/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 text-2xl">
            🛒
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Note: The <code className="text-emerald-400 font-mono">view_cart</code> event has fired with an empty items array so you can test empty cart tracking.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            Explore Catalog & Add Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div
                key={item.product.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {item.product.category}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1 mb-1 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="text-xs font-mono text-slate-400">
                      ${item.product.price.toFixed(2)} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 font-medium">Qty:</label>
                    <select
                      value={item.quantity}
                      onChange={e => updateQuantity(item.product.id, Number(e.target.value))}
                      className="bg-slate-800 text-white font-mono text-xs border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-white font-mono">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    title="Remove item"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 h-fit sticky top-24 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-mono font-bold text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated Shipping</span>
                <span className="font-mono text-emerald-400">$5.00</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-slate-300">${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between text-sm font-extrabold text-white">
                <span>Total Amount</span>
                <span className="font-mono text-indigo-400 text-base">
                  ${(cartTotal + 5 + cartTotal * 0.08).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GA4 Event <code className="font-mono text-indigo-300">begin_checkout</code> will trigger on the next page.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
