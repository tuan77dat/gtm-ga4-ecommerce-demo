import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface ToastItem {
  id: string;
  event: string;
  timestamp: string;
}

export const EventToast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handlePush = (e: Event) => {
      const customEvent = e as CustomEvent;
      const eventName = customEvent.detail.event;

      // Don't toast internal ecommerce:null reset to keep UI clean
      if (!eventName) return;

      const newToast: ToastItem = {
        id: `toast-${Date.now()}-${Math.random()}`,
        event: eventName,
        timestamp: customEvent.detail.timestamp
      };

      setToasts(prev => [...prev.slice(-3), newToast]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 3500);
    };

    window.addEventListener('gtm_data_layer_push', handlePush);
    return () => window.removeEventListener('gtm_data_layer_push', handlePush);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-slate-900/95 border border-emerald-500/40 text-white px-4 py-2.5 rounded-xl shadow-xl backdrop-blur flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>dataLayer.push</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                event: "{toast.event}"
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Reset executed ({'{ ecommerce: null }'}) & payload pushed at {toast.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
