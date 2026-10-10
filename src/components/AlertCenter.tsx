import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { ProactiveAlert } from '../types';
import {
  AlertTriangle,
  CloudRain,
  Droplets,
  Bug,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  Check,
  Filter,
} from 'lucide-react';

import { fetchAlertsFromSupabase } from '../lib/supabase';

interface AlertCenterProps {
  onNavigate: (tab: string) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<ProactiveAlert[]>(notificationService.getAlerts());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [supabaseAlertsCount, setSupabaseAlertsCount] = useState<number>(0);

  useEffect(() => {
    fetchAlertsFromSupabase().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSupabaseAlertsCount(res.data.length);
        const mappedDbAlerts: ProactiveAlert[] = res.data.map((row: any, idx: number) => ({
          id: row.id || `db-alert-${idx}`,
          category: (row.category || 'weather') as any,
          title: row.title || 'Agronomic Advisory',
          severity: (row.severity || 'info') as any,
          timestamp: row.created_at ? new Date(row.created_at).toLocaleTimeString() : 'Recent',
          description: row.description || row.message || '',
          recommendedAction: Array.isArray(row.actions) ? row.actions : [row.action || 'Monitor crop'],
          whyItMatters: row.why_it_matters || row.reason || 'Crucial for crop safety',
          source: row.source || 'Supabase alerts table',
          isRead: Boolean(row.is_read),
        }));

        setAlerts((prev) => {
          const ids = new Set(prev.map((a) => a.id));
          const newItems = mappedDbAlerts.filter((a) => !ids.has(a.id));
          return [...newItems, ...prev];
        });
      }
    }).catch((e) => console.warn('Supabase alerts table fetch note:', e));
  }, []);

  const categories = [
    { id: 'all', label: 'All Alerts', count: alerts.length },
    { id: 'weather', label: '🌧 Weather', count: alerts.filter((a) => a.category === 'weather').length },
    { id: 'irrigation', label: '💧 Irrigation', count: alerts.filter((a) => a.category === 'irrigation').length },
    { id: 'pest', label: '🐛 Pest & Disease', count: alerts.filter((a) => a.category === 'pest').length },
    { id: 'market', label: '💰 Market', count: alerts.filter((a) => a.category === 'market').length },
    { id: 'scheme', label: '📜 Schemes', count: alerts.filter((a) => a.category === 'scheme').length },
  ];

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setAlerts([...notificationService.getAlerts()]);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    setAlerts([...notificationService.getAlerts()]);
  };

  const filteredAlerts =
    selectedCategory === 'all' ? alerts : alerts.filter((a) => a.category === selectedCategory);

  const getSeverityBadge = (severity: ProactiveAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-200">🔴 CRITICAL ACTION REQUIRED</span>;
      case 'warning':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">🟡 WARNING / MONITORING</span>;
      case 'opportunity':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">🟢 FAVORABLE OPPORTUNITY</span>;
      case 'info':
      default:
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200">🔵 ADVISORY NOTICE</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
            </span>
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Proactive Alert Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Farm Risk & Opportunity Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            AgroSaarthi does not wait for you to ask — we monitor your farm context 24/7 and alert you proactively.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="self-start md:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Check className="w-4 h-4 text-slate-500" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Proactive Monitoring Statement Card */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 block mb-1">
            PROACTIVE FARM COPILOT
          </span>
          <p className="text-sm font-bold text-emerald-50">
            "AgroSaarthi monitors your farm conditions continuously and alerts you when something needs immediate attention."
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-emerald-200 flex-wrap">
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">✓ Weather</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">✓ Crop Stage</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">✓ Market Rates</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">✓ Government Subsidy</span>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-900">No alerts in this category</h3>
            <p className="text-xs mt-1">Your farm conditions are within normal baseline thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all ${
                alert.isRead ? 'border-slate-200 shadow-sm opacity-90' : 'border-emerald-300 shadow-md ring-2 ring-emerald-500/10'
              }`}
            >
              {/* Alert Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {getSeverityBadge(alert.severity)}
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {alert.timestamp}
                  </span>
                  {!alert.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" title="Unread" />
                  )}
                </div>

                {!alert.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="text-[11px] text-slate-500 hover:text-emerald-700 font-bold self-start sm:self-auto"
                  >
                    Mark as Read
                  </button>
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-serif">
                  {alert.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Recommended Action Box */}
              <div className="mt-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                <span className="font-extrabold text-emerald-900 block text-xs uppercase tracking-wider">
                  Recommended Action:
                </span>
                <ul className="space-y-1.5 text-slate-700">
                  {alert.recommendedAction.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span className="font-medium">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why It Matters */}
              <div className="mt-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs">
                <span className="font-bold text-slate-900 text-[11px] block mb-0.5">
                  Why this matters:
                </span>
                <p className="text-slate-600 leading-snug text-xs">
                  {alert.whyItMatters}
                </p>
              </div>

              {/* Footer Source */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">Source: {alert.source}</span>
                <button
                  onClick={() => onNavigate('askAgroSaarthi')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Ask AI About This Alert →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
