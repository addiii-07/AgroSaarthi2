import React, { useState } from 'react';
import { User, FarmDetails, Language, PriorityAction } from '../types';
import { cropService } from '../services/cropService';
import {
  Sprout,
  Droplets,
  CloudRain,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  Bot,
  HelpCircle,
  Eye,
  CheckCircle,
  Store,
  Info,
} from 'lucide-react';

interface HomeDashboard2Props {
  user: User;
  farm: FarmDetails;
  language: Language;
  onNavigate: (tab: string) => void;
  onOpenExpertModal: () => void;
}

export const HomeDashboard2: React.FC<HomeDashboard2Props> = ({
  user,
  farm,
  language,
  onNavigate,
  onOpenExpertModal,
}) => {
  const farmHealth = cropService.getFarmHealth();
  const priorities = cropService.getTodayPriorities();

  const [expandedActionId, setExpandedActionId] = useState<string | null>(priorities[0]?.id || null);
  const [showHealthExplanation, setShowHealthExplanation] = useState(false);

  const toggleAction = (id: string) => {
    setExpandedActionId((prev) => (prev === id ? null : id));
  };

  const getPriorityBadge = (priority: PriorityAction['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200">HIGH PRIORITY</span>;
      case 'medium':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">MEDIUM PRIORITY</span>;
      case 'opportunity':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">OPPORTUNITY</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">ROUTINE</span>;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Header: Greeting & Proactive Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                AgroSaarthi Farm Copilot Active
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Good morning, {user.name || user.fullName} 👋
            </h1>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {user.village || user.villageMandal}, {user.district}, {user.state || 'Telangana'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                31°C · Heavy Rainfall Ahead (82%)
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate('askAgroSaarthi')}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>Ask AgroSaarthi</span>
            </button>

            <button
              onClick={() => onNavigate('alerts')}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-2xl text-xs font-bold border border-rose-200 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Alerts (3 Active)</span>
            </button>
          </div>
        </div>

        {/* Proactive Monitoring Statement Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Eye className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>AgroSaarthi is watching your farm 24/7:</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Weather telemetry
            </span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Crop stage lifecycle
            </span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Mandi rates
            </span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Pest risk
            </span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Government schemes
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary 2-Column Grid: Farm Summary & Farm Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: My Farm Summary */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                  <Sprout className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 font-serif">My Farm</h2>
                  <p className="text-[11px] text-slate-500">Active Crop & Land Holding</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('myFarm')}
                className="text-xs text-emerald-700 font-bold hover:underline bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                View Details →
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner border border-slate-200 flex-shrink-0">
                <img
                  src={
                    farm.farmImages && farm.farmImages.length > 0
                      ? farm.farmImages[0]
                      : 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={user.crop || user.primaryCrop}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {user.crop || user.primaryCrop || 'Tomato'}
                </h3>
                <p className="text-xs text-emerald-800 font-semibold">
                  {user.crop_variety || (user as any).cropVariety || 'Arka Rakshak (Hybrid)'}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-800">{user.farm_size || `${farm.landArea} Acres`}</span>
                  <span>•</span>
                  <span>{user.irrigation_type || farm.irrigationType}</span>
                </div>
              </div>
            </div>

            {/* Farm Attribute Grid */}
            <div className="mt-4 bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Growth Stage:
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {user.growth_stage || 'Flowering & Budding'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Sowing Date:
                </span>
                <span className="font-mono text-slate-800 font-semibold">{user.sowing_date || '2026-07-20'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Soil Type:
                </span>
                <span className="text-slate-800 font-semibold">{user.soil_type || farm.soilType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-slate-400" /> Target Mandi:
                </span>
                <span className="text-slate-800 font-semibold truncate max-w-[150px] text-right">
                  {user.preferred_market ? user.preferred_market.split(' ')[0] + ' APMC' : 'Bowenpally APMC'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">AgriStack ID: <span className="font-mono font-bold text-slate-700">{user.id}</span></span>
            <button
              onClick={() => onNavigate('myProfile')}
              className="text-emerald-700 font-bold hover:underline text-[11px]"
            >
              Edit 16 Fields →
            </button>
          </div>
        </div>

        {/* Right Card: 🌱 Farm Health Score Gauge & Diagnostics */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 font-serif">🌱 Farm Health Score</h2>
                  <p className="text-[11px] text-slate-500">Multi-factor Agronomic AI Index</p>
                </div>
              </div>

              <button
                onClick={() => setShowHealthExplanation(!showHealthExplanation)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHealthExplanation ? 'Hide Explanation' : 'Why this score?'}</span>
              </button>
            </div>

            {/* Score Showcase */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Gauge Representation */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                <div className="w-28 h-28 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#E2E8F0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#059669"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * farmHealth.overallScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {farmHealth.overallScore}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">out of 100</span>
                  </div>
                </div>
              </div>

              {/* Sub-Metric Bars */}
              <div className="flex-1 w-full space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Crop Health & Canopy Vigor</span>
                    <span className="font-mono text-emerald-800 font-bold">{farmHealth.cropHealth}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${farmHealth.cropHealth}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Weather Suitability (Thermal Sweetspot)</span>
                    <span className="font-mono text-emerald-800 font-bold">{farmHealth.weatherSuitability}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${farmHealth.weatherSuitability}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span className="text-amber-800 font-bold">Soil Moisture & Drainage Balance</span>
                    <span className="font-mono text-amber-800 font-bold">{farmHealth.soilMoisture}/100 (Attention)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${farmHealth.soilMoisture}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Pest & Disease Resistance Score</span>
                    <span className="font-mono text-slate-700 font-bold">{farmHealth.pestRisk}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${farmHealth.pestRisk}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                    <span>Market Condition & Timing Index</span>
                    <span className="font-mono text-slate-700 font-bold">{farmHealth.marketCondition}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${farmHealth.marketCondition}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-bold text-amber-900">{farmHealth.summaryStatus}</span>
              </div>
              <button
                onClick={() => onNavigate('farmHealth')}
                className="text-amber-900 font-bold underline text-[11px]"
              >
                Detailed Health Audit →
              </button>
            </div>

            {/* Expandable Explanation Panel */}
            {showHealthExplanation && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-700" />
                  Why 78 / 100? Agronomic Factor Breakdown:
                </div>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  {farmHealth.explanation.map((exp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-200">
                  Note: AgroSaarthi Farm Health is an AI-assisted diagnostic prototype indicator synthesized from weather, crop phenology, and soil balance. Not a lab soil certificate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. TODAY'S ACTIONS / PRIORITIES (Core Heart of AgroSaarthi 2.0) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <CheckCircle className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 font-serif">Today's Priorities</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable tasks calibrated to your farm context, current growth stage, and incoming rain forecast
            </p>
          </div>

          <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200 self-start sm:self-auto">
            4 Actionable Recommendations Today
          </span>
        </div>

        {/* 4 Action Cards with "Why am I seeing this?" expander */}
        <div className="space-y-3 mt-4">
          {priorities.map((item) => {
            const isExpanded = expandedActionId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleAction(item.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 flex-shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {getPriorityBadge(item.priority)}
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.expectedTime}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        {item.action}
                      </p>
                    </div>
                  </div>

                  <button className="p-1 rounded-lg text-slate-400 hover:text-slate-700 flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expandable "Why Am I Seeing This?" Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 sm:px-5 sm:pb-5 border-t border-slate-100 text-xs space-y-4">
                    {/* Reason Box */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1 text-xs">
                        Why this recommendation?
                      </span>
                      <p className="text-slate-700 leading-relaxed text-xs">
                        {item.reason}
                      </p>
                    </div>

                    {/* Context Factors: What? Why? When? What Next? */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {item.contextFactors.map((cf, idx) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-500 block">{cf.label}</span>
                          <span className="font-bold text-slate-800 text-[11px]">{cf.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Data Sources and Trust Tag */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-emerald-800">Verified Sources:</span>
                        {item.sources.map((s, idx) => (
                          <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-[10px]">
                            {s.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigate('askAgroSaarthi')}
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                        >
                          Ask AI about this task →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Nav Module Cards (Weather Risk, Market Advisor, Crop Advisor, Schemes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weather Risk Card */}
        <div
          onClick={() => onNavigate('weather')}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                ⚠️ MODERATE RISK
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              Weather & Crop Risk
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              35mm rainfall expected in 36h. Dig trenches to prevent root waterlogging.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Open Weather Risk →</span>
          </div>
        </div>

        {/* Market Advisor Card */}
        <div
          onClick={() => onNavigate('market')}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                🟢 CONSIDER SELLING
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              Market Intelligence
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tomato rate is ₹35/kg (+8.2% trend). Monetize before rainfall impacts.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Market Advisor & Rates →</span>
          </div>
        </div>

        {/* Crop Advisor Card */}
        <div
          onClick={() => onNavigate('cropAdvisor')}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                STAGE: FLOWERING
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              Crop Lifecycle Advisor
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Flowering stage timeline, nutrient spray plan, and fungal disease prevention.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>View Crop Timeline →</span>
          </div>
        </div>

        {/* Government Schemes Card */}
        <div
          onClick={() => onNavigate('schemes')}
          className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                4 MATCHED
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              Government Schemes
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              PM-KISAN, Telangana Micro-Irrigation Drip subsidy (up to 90%), and PMFBY.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Check Eligibility →</span>
          </div>
        </div>
      </div>

      {/* 5. Need Expert Help Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl text-emerald-300 border border-white/10 flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base font-serif">Have an uncertain crop problem or severe pest onset?</h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Escalate directly to verified agricultural scientists and Mandal Extension Officers.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenExpertModal}
          className="px-5 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow hover:bg-emerald-50 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <span>Ask an Agricultural Expert</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
