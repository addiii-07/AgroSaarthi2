import React from 'react';
import {
  Sprout,
  Sun,
  CloudRain,
  TrendingUp,
  FileText,
  ShieldCheck,
  Bot,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';
import { User, FarmDetails, WeatherData, GovernmentScheme, Advisory, MarketPriceItem } from '../types';
import { getTranslation } from '../i18n';

interface FarmerDashboardProps {
  user: User;
  farm: FarmDetails;
  weather: WeatherData;
  schemes: GovernmentScheme[];
  advisories: Advisory[];
  marketPrices: MarketPriceItem[];
  language: any;
  onNavigate: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  user,
  farm,
  weather,
  schemes,
  advisories,
  marketPrices,
  language,
  onNavigate,
}) => {
  const t = (key: string) => getTranslation(language, key);

  // Filter market prices for user crop if available
  const relevantPrice =
    marketPrices.find((m) => m.cropName.toLowerCase().includes(user.primaryCrop.toLowerCase())) ||
    marketPrices[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Welcome & Quick Weather Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1B3022] text-[#E8F1E9] p-6 sm:p-8 shadow-md border border-emerald-900/80">
        {/* Subtle Decorative Pattern */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sprout className="w-80 h-80 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-[#F27D26] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Farmer Portal
              </span>
              <span className="text-xs text-emerald-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {user.district} District ({user.villageMandal})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t('welcome')}, {user.fullName}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl mt-1.5 leading-relaxed">
              Agrosaarthi AI engine is actively monitoring field climate, pest risks, and crop market rates for your{' '}
              <span className="text-emerald-400 font-bold underline">{user.primaryCrop}</span> crop.
            </p>
          </div>

          {/* Quick Weather Snapshot Card */}
          <div
            onClick={() => onNavigate('weather')}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer hover:bg-white/15 transition-all shadow-sm shrink-0"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
              <Sun className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold font-mono text-white">{weather.currentTemp}°C</span>
                <span className="text-xs text-emerald-300">{weather.condition}</span>
              </div>
              <div className="text-[11px] text-emerald-200 flex items-center space-x-3 mt-0.5">
                <span>💧 {weather.humidity}% Humidity</span>
                <span>🌧️ {weather.rainPrediction}% Rain</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
        <button
          onClick={() => onNavigate('smartAdvisor')}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#1B3022] text-white border border-emerald-700 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-amber-300 group-hover:text-amber-200">Crop Advisor</div>
            <div className="text-[10px] text-emerald-200">Smart Farming Guide</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('cropRecommendation')}
          className="p-4 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">Crop Rec.</div>
            <div className="text-[10px] text-slate-500">AI soil matching</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('diseaseDetection')}
          className="p-4 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 group-hover:text-rose-700">Disease Doctor</div>
            <div className="text-[10px] text-slate-500">Photo leaf analysis</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('marketPrices')}
          className="p-4 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F27D26] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 group-hover:text-[#F27D26]">Market Rates</div>
            <div className="text-[10px] text-slate-500">Mandi price trends</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('governmentSchemes')}
          className="p-4 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700">Govt Schemes</div>
            <div className="text-[10px] text-slate-500">Subsidies & Rythu</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('cropInsurance')}
          className="p-4 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Crop Insurance</div>
            <div className="text-[10px] text-slate-500">File damage claim</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('aiAssistant')}
          className="p-4 rounded-2xl bg-[#1B3022] text-white shadow-sm hover:bg-[#25422f] transition-all text-left group flex flex-col justify-between border border-emerald-900"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Ask AI Assistant</div>
            <div className="text-[10px] text-emerald-300">Multilingual Chat</div>
          </div>
        </button>
      </div>

      {/* Main Grid Section: Profile Summary, Crop Health & AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Farmer Profile & Farm Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Farmer Profile & Agronomic Record
            </h3>
            <button
              onClick={() => onNavigate('myProfile')}
              className="text-xs text-emerald-700 font-bold hover:underline bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
            >
              Edit 16 Fields →
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <img
              src={user.profilePhoto}
              alt={user.name || user.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow"
            />
            <div>
              <div className="font-bold text-slate-900 text-base">{user.name || user.fullName}</div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <span>+91 {user.phone || user.mobile}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                  ID: {user.id}
                </span>
              </div>
              <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {user.crop || user.primaryCrop} {user.crop_variety ? `(${user.crop_variety})` : ''}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 text-xs space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-800 text-right">
                {user.village || user.villageMandal}, {user.district} ({user.state || 'AP'})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Farm Size:</span>
              <span className="font-bold text-emerald-700">
                {user.farm_size || `${farm.landArea} ${farm.landUnit}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Soil & Irrigation:</span>
              <span className="font-semibold text-slate-800 text-right">
                {user.soil_type || farm.soilType} ({user.irrigation_type || farm.irrigationType})
              </span>
            </div>
            {user.growth_stage && (
              <div className="flex justify-between">
                <span className="text-slate-500">Growth Stage:</span>
                <span className="font-medium text-emerald-800 text-right">{user.growth_stage}</span>
              </div>
            )}
            {user.sowing_date && (
              <div className="flex justify-between">
                <span className="text-slate-500">Sowing Date:</span>
                <span className="font-mono text-slate-700">{user.sowing_date}</span>
              </div>
            )}
            {user.preferred_market && (
              <div className="flex justify-between">
                <span className="text-slate-500">Preferred Market:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px] text-right">
                  {user.preferred_market}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate('myProfile')}
              className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors text-center shadow-sm"
            >
              View Full Profile
            </button>
            <button
              onClick={() => onNavigate('myFarm')}
              className="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition-colors text-center border border-emerald-200"
            >
              Manage Farm →
            </button>
          </div>
        </div>

        {/* Middle Column: Crop Health & AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Crop Health Status Box */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t('cropHealthStatus')} - {user.primaryCrop}
                </h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Healthy Field
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="text-[11px] text-slate-500">Pest Risk Score</div>
                <div className="text-lg font-bold text-emerald-800">Low (12%)</div>
                <div className="text-[10px] text-slate-400 mt-1">No major disease outbreak in 10km radius</div>
              </div>

              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <div className="text-[11px] text-slate-500">Moisture Status</div>
                <div className="text-lg font-bold text-amber-800">Optimal (68%)</div>
                <div className="text-[10px] text-slate-400 mt-1">Drip irrigation recommended tomorrow</div>
              </div>

              <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100">
                <div className="text-[11px] text-slate-500">Growth Stage</div>
                <div className="text-lg font-bold text-sky-800">Vegetative (Day 42)</div>
                <div className="text-[10px] text-slate-400 mt-1">Next top dressing due in 5 days</div>
              </div>
            </div>
          </div>

          {/* Today's AI Recommendation Highlight */}
          <div className="bg-[#1B3022] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-900/80">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 mb-3 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                TODAY'S AI INSIGHT
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-2 italic text-emerald-300">
                "Time to adjust irrigation & apply micronutrients."
              </h2>

              <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl leading-relaxed mb-4">
                Based on upcoming high temperatures and humidity levels in {user.district}, Agrosaarthi recommends applying Zinc Sulphate 0.2% spray for your {user.primaryCrop} crop to prevent leaf chlorosis.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('cropRecommendation')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#1B3022] font-extrabold text-xs py-2.5 px-6 rounded-2xl transition-all shadow"
                >
                  View Detailed AI Recommendation Plan
                </button>
                <button
                  onClick={() => onNavigate('aiAssistant')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-6 rounded-2xl border border-white/20"
                >
                  Ask AI Assistant
                </button>
              </div>
            </div>

            {/* Abstract design element */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Market Price Ticker & Latest Advisories & Eligible Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Market Rate Ticker Card */}
        {relevantPrice && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#F27D26]" />
                  Live Mandi Price: {relevantPrice.cropName}
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">Live</span>
              </div>

              <div className="bg-[#F4F7F2] p-4 rounded-2xl border border-emerald-100/60">
                <div className="text-xs text-slate-500 font-medium">{relevantPrice.mandiName}</div>
                <div className="text-2xl font-extrabold font-mono text-emerald-900 mt-1">
                  ₹{relevantPrice.modalPrice.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-slate-500">/ Quintal</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Range: ₹{relevantPrice.minPrice.toLocaleString('en-IN')} - ₹{relevantPrice.maxPrice.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-emerald-700 font-bold">Best Yard: {relevantPrice.bestMarketToSell}</span>
              <button
                onClick={() => onNavigate('marketPrices')}
                className="text-xs text-[#F27D26] font-bold hover:underline"
              >
                View Rates →
              </button>
            </div>
          </div>
        )}

        {/* Official Department Advisory Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                Latest District Advisory
              </h3>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            {advisories[0] ? (
              <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900">{advisories[0].title}</span>
                  <span className="bg-sky-200 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {advisories[0].urgency}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {advisories[0].content}
                </p>
                <div className="text-[10px] text-slate-400 font-medium pt-1">
                  Issued by {advisories[0].officerName} • {advisories[0].publishedDate}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">No active advisories today.</div>
            )}
          </div>

          <div className="mt-4 pt-2 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigate('governmentSchemes')}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Check Eligible Schemes →
            </button>
          </div>
        </div>

        {/* Terracotta Eligible Schemes Highlight Box */}
        <div className="bg-[#F27D26]/10 rounded-3xl p-6 border border-[#F27D26]/20 flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#F27D26] font-bold uppercase tracking-widest mb-3">Eligible Government Subsidies</p>
            <div className="space-y-2.5">
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#F27D26]/10">
                <h4 className="font-bold text-slate-800 text-xs">PM-Kisan Samman Nidhi</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">₹6,000 / year • Next installment active</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#F27D26]/10">
                <h4 className="font-bold text-slate-800 text-xs">Drip Irrigation Subsidy (80%)</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Eligible for {user.primaryCrop} field in {user.district}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('governmentSchemes')}
            className="w-full py-2.5 bg-white border border-[#F27D26]/30 text-[#F27D26] rounded-2xl font-bold text-xs mt-3 hover:bg-[#F27D26] hover:text-white transition-all shadow-sm"
          >
            + Explore All Schemes
          </button>
        </div>
      </div>

      {/* Floating Quick AI Chat Bar */}
      <div className="bg-white border border-emerald-100 rounded-2xl px-5 py-3.5 flex items-center gap-4 shadow-sm">
        <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 shrink-0">
          <Bot className="w-5 h-5 text-emerald-700" />
        </div>
        <input
          type="text"
          placeholder={`Ask Agrosaarthi: "How can I maximize yield for ${user.primaryCrop}?"`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onNavigate('aiAssistant');
          }}
          className="flex-1 bg-transparent text-slate-700 outline-none text-xs sm:text-sm font-medium placeholder:text-slate-400"
        />
        <button
          onClick={() => onNavigate('aiAssistant')}
          className="bg-[#1B3022] hover:bg-[#25422f] text-emerald-400 px-5 py-2 rounded-xl font-bold text-xs shrink-0 transition-colors shadow-sm"
        >
          ASK AI
        </button>
      </div>
    </div>
  );
};
