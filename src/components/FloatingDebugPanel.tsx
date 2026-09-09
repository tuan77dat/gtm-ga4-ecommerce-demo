import React, { useState, useEffect } from 'react';
import { Terminal, X, Copy, Check, Trash2, Bug, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { LoggedDataLayerEvent } from '../types';

export const FloatingDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<LoggedDataLayerEvent[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [consentStatus, setConsentStatus] = useState<'unset' | 'granted' | 'denied'>('unset');

  useEffect(() => {
    // Check initial consent status
    if ((window as any).gtmInterceptor) {
      const state = (window as any).gtmInterceptor.getConsentState();
      if (state.analytics_storage) {
        setConsentStatus(state.analytics_storage);
      }
    }
  }, []);

  useEffect(() => {
    // Collect pre-existing window.dataLayer events on mount if any
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      const initialLogs: LoggedDataLayerEvent[] = window.dataLayer.map((item, idx) => ({
        id: `init-${idx}-${Date.now()}`,
        event: item.event || (item.ecommerce === null ? '(clear:ecommerce)' : 'gtm.init'),
        timestamp: new Date().toLocaleTimeString(),
        payload: item
      }));
      setEvents(initialLogs);
    }

    // Listen for real-time events
    const handleGtmPush = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newLog: LoggedDataLayerEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        event: customEvent.detail.event,
        timestamp: customEvent.detail.timestamp,
        payload: customEvent.detail.payload
      };
      setEvents(prev => [newLog, ...prev]);
    };

    window.addEventListener('gtm_data_layer_push', handleGtmPush);
    return () => window.removeEventListener('gtm_data_layer_push', handleGtmPush);
  }, []);

  const handleConsoleLogDataLayer = () => {
    console.group('%c 🚀 [GTM & GA4 DataLayer Dump] ', 'background: #4f46e5; color: #fff; font-weight: bold; font-size: 13px; padding: 4px 8px; rounded: 4px;');
    console.log('Timestamp:', new Date().toISOString());
    console.log('window.dataLayer contents:', window.dataLayer);
    console.table(
      (window.dataLayer || []).map((item, index) => ({
        Index: index,
        Event: item.event || (item.ecommerce === null ? '(clear:ecommerce)' : 'N/A'),
        PayloadKeys: Object.keys(item).join(', ')
      }))
    );
    console.groupEnd();
  };

  const handleCopyJson = (log: LoggedDataLayerEvent) => {
    navigator.clipboard.writeText(JSON.stringify(log.payload, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearLogs = () => {
    setEvents([]);
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="btn-open-inspector"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-700/70 hover:border-indigo-500/50 shadow-2xl rounded-full backdrop-blur-md transition-all duration-200"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide font-sans">
            GTM DataLayer Inspector
          </span>
          <span className="text-[11px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
            {events.length}
          </span>
        </button>
      </div>

      {/* Drawer Overlay Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] md:w-[580px] bg-slate-900/95 border-l border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col transition-transform duration-300 ease-out">
          {/* Panel Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Bug className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  DataLayer Inspector
                  <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                    {events.length} events
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">Live GA4 Ecommerce Push Monitor</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleConsoleLogDataLayer}
                title="Print full window.dataLayer to DevTools Console"
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                Console.log
              </button>

              <button
                onClick={clearLogs}
                title="Clear Log View"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Consent Mode Controls */}
          <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-2 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Consent Mode:</span>
              <span id="consent-badge-text" className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                consentStatus === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : consentStatus === 'denied'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {consentStatus === 'granted' ? 'GRANTED' : consentStatus === 'denied' ? 'DENIED' : 'UNSET (IMPLICIT)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                id="btn-deny-consent"
                onClick={() => {
                  (window as any).simulateConsentDenial?.();
                  setConsentStatus('denied');
                }}
                className="px-2 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded text-[11px] font-semibold transition-colors"
              >
                🔒 Deny Consent
              </button>
              <button
                id="btn-grant-consent"
                onClick={() => {
                  (window as any).simulateConsentGrant?.();
                  setConsentStatus('granted');
                }}
                className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-semibold transition-colors"
              >
                🔓 Grant Consent
              </button>
            </div>
          </div>

          {/* DataLayer Logs Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-mono text-xs max-h-[60vh]">
            {events.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs font-sans">
                No dataLayer events recorded yet. Perform actions on the page to trigger events!
              </div>
            ) : (
              events.map(log => {
                const isExpanded = expandedId === log.id;
                const isEcommerceReset = log.payload?.ecommerce === null;

                return (
                  <div
                    key={log.id}
                    className={`rounded-xl border transition-all ${
                      isEcommerceReset
                        ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                        : 'bg-slate-950 border-indigo-900/40 hover:border-indigo-500/50'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      className="p-2.5 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}

                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isEcommerceReset
                              ? 'bg-slate-800 text-slate-400'
                              : log.event === 'purchase'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {log.event}
                        </span>

                        <span className="text-[10px] text-slate-500 truncate">
                          {log.timestamp}
                        </span>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleCopyJson(log);
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
                        title="Copy JSON Payload"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Json Details Body */}
                    {isExpanded && (
                      <div className="p-3 border-t border-slate-800 bg-slate-950/80 rounded-b-xl overflow-x-auto">
                        <pre className="text-[11px] text-indigo-200 leading-relaxed">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Helper Bar */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>window.dataLayer length: {window.dataLayer?.length || 0}</span>
            <span className="text-slate-500 flex items-center gap-1">
              Press F12 for DevTools <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}
    </>
  );
};
