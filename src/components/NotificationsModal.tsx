import React from 'react';
import { Advisory } from '../types';
import { Bell, AlertTriangle, FileText, CheckCircle2, X } from 'lucide-react';

interface NotificationsModalProps {
  advisories: Advisory[];
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ advisories, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs border border-emerald-100 max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-serif">Notifications & Advisories</h3>
              <p className="text-[11px] text-slate-500">Government bulletins and weather warnings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {advisories.length > 0 ? (
            advisories.map((adv) => (
              <div
                key={adv.id}
                className={`p-4 rounded-xl border space-y-1.5 transition-all ${
                  adv.urgency === 'Critical Emergency'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">{adv.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      adv.urgency === 'Critical Emergency'
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {adv.urgency}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs">{adv.content}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1 flex justify-between">
                  <span>Issued by: {adv.officerName}</span>
                  <span>{adv.publishedDate}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">No active notifications.</div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 text-center shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
