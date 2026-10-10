import React from 'react';
import { User, FarmDetails, Language } from '../types';
import {
  CloudRain,
  TrendingUp,
  Sprout,
  Bot,
  AlertTriangle,
  Mic,
  ArrowLeft,
  CheckCircle,
  Phone,
  MapPin,
  Volume2,
} from 'lucide-react';

interface MobileFarmerModeProps {
  user: User;
  farm: FarmDetails;
  language: Language;
  onNavigate: (tab: string) => void;
  onExit: () => void;
}

export const MobileFarmerMode: React.FC<MobileFarmerModeProps> = ({
  user,
  farm,
  language,
  onNavigate,
  onExit,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAF6] text-slate-900 p-4 max-w-md mx-auto space-y-4">
      {/* Top Bar with Exit */}
      <div className="flex items-center justify-between bg-emerald-900 text-white p-4 rounded-3xl shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl"
            title="Return to standard dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-extrabold text-sm tracking-wide">AgroSaarthi Farmer Mode</h1>
            <span className="text-[10px] text-emerald-300 font-mono">Simple Touch & Voice</span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-3 py-1 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-sm"
        >
          Standard View
        </button>
      </div>

      {/* Greeting Banner */}
      <div className="bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-1">
        <span className="text-xs text-slate-500 font-bold">Good morning,</span>
        <h2 className="text-xl font-extrabold text-slate-900">{user.name || user.fullName}</h2>
        <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold pt-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{user.village || 'Shamshabad'}, {user.district}</span>
          <span>•</span>
          <span>{user.crop || 'Tomato'} ({user.farm_size || '2.0 Acres'})</span>
        </div>
      </div>

      {/* Primary Voice Action Banner */}
      <div
        onClick={() => onNavigate('askAgroSaarthi')}
        className="bg-emerald-800 text-white p-6 rounded-3xl shadow-lg border-2 border-emerald-600 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
      >
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-300">
            SPEAK TO AI COPILOT
          </span>
          <h3 className="text-lg font-bold">Ask Anything By Voice</h3>
          <p className="text-xs text-emerald-100">Tap mic to ask in Telugu, Hindi or English</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white text-emerald-900 flex items-center justify-center shadow-md flex-shrink-0 animate-pulse">
          <Mic className="w-7 h-7 text-emerald-700" />
        </div>
      </div>

      {/* 5 Big High-Contrast Touch Cards */}
      <div className="grid grid-cols-2 gap-3 text-left">
        {/* 1. Weather */}
        <button
          onClick={() => onNavigate('weather')}
          className="p-5 bg-white rounded-3xl border-2 border-blue-200 shadow-sm hover:border-blue-400 active:scale-95 transition-transform flex flex-col justify-between h-36"
        >
          <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl w-fit">
            <CloudRain className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">🌦 Weather</h4>
            <span className="text-xs font-bold text-amber-700 block">Rain Alert (35mm)</span>
          </div>
        </button>

        {/* 2. Mandi Rates */}
        <button
          onClick={() => onNavigate('market')}
          className="p-5 bg-white rounded-3xl border-2 border-emerald-200 shadow-sm hover:border-emerald-400 active:scale-95 transition-transform flex flex-col justify-between h-36"
        >
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl w-fit">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">💰 Mandi Rates</h4>
            <span className="text-xs font-bold text-emerald-700 block">Tomato: ₹35/kg ↑</span>
          </div>
        </button>

        {/* 3. My Crop & Health */}
        <button
          onClick={() => onNavigate('cropAdvisor')}
          className="p-5 bg-white rounded-3xl border-2 border-amber-200 shadow-sm hover:border-amber-400 active:scale-95 transition-transform flex flex-col justify-between h-36"
        >
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl w-fit">
            <Sprout className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">🌱 My Crop</h4>
            <span className="text-xs font-bold text-slate-600 block">Flowering Stage</span>
          </div>
        </button>

        {/* 4. Alerts */}
        <button
          onClick={() => onNavigate('alerts')}
          className="p-5 bg-white rounded-3xl border-2 border-rose-200 shadow-sm hover:border-rose-400 active:scale-95 transition-transform flex flex-col justify-between h-36"
        >
          <div className="p-3 bg-rose-100 text-rose-800 rounded-2xl w-fit">
            <AlertTriangle className="w-6 h-6 text-rose-700" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">🚨 Alerts</h4>
            <span className="text-xs font-bold text-rose-700 block">3 Important</span>
          </div>
        </button>
      </div>

      {/* Quick Priority Notice */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl text-xs space-y-1">
        <span className="font-extrabold text-amber-950 block">⚡ TODAY'S URGENT ACTION</span>
        <p className="text-amber-900 font-medium">
          Check plot drainage furrows now. Delay today's watering pump.
        </p>
      </div>
    </div>
  );
};
