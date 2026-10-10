import React from 'react';
import { User, FarmDetails } from '../types';
import { cropService } from '../services/cropService';
import {
  Sparkles,
  Sprout,
  CloudRain,
  Droplets,
  Bug,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface FarmHealthPageProps {
  user: User;
  farm: FarmDetails;
  onNavigate: (tab: string) => void;
  onOpenExpertModal: () => void;
}

export const FarmHealthPage: React.FC<FarmHealthPageProps> = ({
  user,
  farm,
  onNavigate,
  onOpenExpertModal,
}) => {
  const farmHealth = cropService.getFarmHealth();

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Agronomic Health & Risk Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            🌱 Farm Health Diagnostic Report
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Live multi-factor composite index evaluating plant vegetative vigor, moisture threshold, thermal stress, disease sporulation conditions, and commercial market timing for {user.crop || 'Tomato'}.
          </p>
        </div>

        {/* Big Health Badge */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 text-center min-w-[180px] shadow-sm flex-shrink-0">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">Overall Score</span>
          <div className="text-4xl sm:text-5xl font-extrabold text-emerald-900 font-mono tracking-tight my-1">
            {farmHealth.overallScore}<span className="text-lg text-emerald-600 font-sans">/100</span>
          </div>
          <span className="inline-block bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
            GOOD (ATTENTION ON MOISTURE)
          </span>
        </div>
      </div>

      {/* 5 Deep-Dive Health Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Crop Health */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Crop Health & Canopy</h3>
              </div>
              <span className="text-base font-extrabold font-mono text-emerald-700">82/100</span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Healthy green leaf index. Active flower cluster development observed. Vegetative branches exhibit strong vascular rigidity with minimal early chlorosis.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-emerald-700">🟢 High Vigor</span>
            <span>Flowering (Day 52)</span>
          </div>
        </div>

        {/* 2. Weather Suitability */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                  <CloudRain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Thermal Suitability</h3>
              </div>
              <span className="text-base font-extrabold font-mono text-teal-700">88/100</span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Ambient daytime temperature (29°C–31°C) and nighttime thermal drop (22°C) support optimal tomato pollen tube growth and fruit set viability.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-teal-700">🟢 Optimal Temperature</span>
            <span>22°C - 31°C Window</span>
          </div>
        </div>

        {/* 3. Water Status & Moisture */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 bg-amber-50/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Water & Drainage Status</h3>
              </div>
              <span className="text-base font-extrabold font-mono text-amber-700">65/100</span>
            </div>
            <p className="text-xs text-slate-700 mt-3 leading-relaxed">
              <strong>Requires Attention:</strong> Incoming 35mm rain event will saturate root zones to ~92%. Excess moisture at flowering accelerates blossom drop and root asphyxiation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-amber-900 font-bold">
            <span>⚠️ Suspend Irrigation</span>
            <button onClick={() => onNavigate('weather')} className="underline">
              Check Rain Radar →
            </button>
          </div>
        </div>

        {/* 4. Pest & Disease Risk */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                  <Bug className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Pest & Fungal Risk</h3>
              </div>
              <span className="text-base font-extrabold font-mono text-slate-700">72/100</span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Relative humidity exceeding 78% creates microclimate favorable for Alternaria (Early Blight) and damping off. No active epidemic confirmed yet.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-amber-700">🟡 Moderate Fungal Risk</span>
            <span>Early Blight Alert</span>
          </div>
        </div>

        {/* 5. Market Timing */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Commercial Market Condition</h3>
              </div>
              <span className="text-base font-extrabold font-mono text-blue-700">75/100</span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Tomato prices at Bowenpally Mandi (₹35/kg, ₹3,500/quintal) are currently running 14% above monthly average. Favorable monetization opportunity.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-blue-700">🟢 Favorable Selling</span>
            <button onClick={() => onNavigate('market')} className="text-emerald-700 font-bold underline">
              View Advisor →
            </button>
          </div>
        </div>

        {/* 6. AI Confidence & Data Verification */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-emerald-200">AI CONFIDENCE ESTIMATE</span>
              <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">87% CONFIDENCE</span>
            </div>
            <p className="text-xs text-emerald-100 mt-3 leading-relaxed">
              Diagnostic synthesis backed by satellite precipitation telemetry, regional mandis, and ICAR agricultural algorithms.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
            <span>Verified Knowledge Base</span>
            <button onClick={() => onNavigate('trustCenter')} className="underline font-bold text-white">
              Data Sources →
            </button>
          </div>
        </div>
      </div>

      {/* Risk Forecast Timeline (Today, Tomorrow, 3 Days, 7 Days) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">7-Day Forward Agronomic Risk Outlook</h2>
            <p className="text-xs text-slate-500">Predictive risk forecast to schedule spraying, irrigation, and harvesting</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono px-3 py-1 rounded-xl">
            Live Radar Integration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {farmHealth.riskForecast.map((rf, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                rf.risk === 'high'
                  ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                  : rf.risk === 'moderate'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span>{rf.period}</span>
                <span
                  className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                    rf.risk === 'high'
                      ? 'bg-rose-600 text-white'
                      : rf.risk === 'moderate'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {rf.risk} Risk
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">{rf.label}</h4>
              <p className="text-xs text-slate-600 leading-snug">{rf.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prescribed Corrective Action Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-serif">Prescribed Actions to Improve Score to 90+</h2>
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block text-sm">Action 1: Dig/Clear Furrow Outlets</span>
              <p className="text-slate-600 mt-0.5">
                Ensuring smooth stormwater run-off improves the Soil Moisture Balance score from 65 to 84.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block text-sm">Action 2: Post-Rain Bio-fungicide Shield</span>
              <p className="text-slate-600 mt-0.5">
                Applying preventative 5% Neem extract or copper spray after rain subsides lifts Pest & Disease resistance score from 72 to 89.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
