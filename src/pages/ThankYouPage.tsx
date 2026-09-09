import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ShieldCheck, Copy, Check } from 'lucide-react';

export const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || 'ORD-984210';
  const [orderData, setOrderData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('last_ga4_order');
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalAmount = orderData?.total ? `$${orderData.total.toFixed(2)} USD` : '$249.99 USD';

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-emerald-500 to-purple-500" />

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Thank You For Your Order!
        </h1>
        <p className="text-slate-300 text-sm max-w-md mx-auto mb-8">
          Your order has been placed successfully in this test sandbox environment.
        </p>

        {/* GA4 Purchase Event Summary Badge */}
        <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 mb-8 text-left max-w-md mx-auto space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> GA4 Event Triggered
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
              event: "purchase"
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">transaction_id:</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">{orderId}</span>
              <button
                onClick={copyOrderId}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title="Copy Transaction ID"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">value:</span>
            <span className="text-white font-bold">{totalAmount}</span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">currency:</span>
            <span className="text-white">"USD"</span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">dataLayer status:</span>
            <span className="text-emerald-400">ecommerce: null reset + Pushed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Testing (Back to Products)</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
