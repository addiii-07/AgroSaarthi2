import React from 'react';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CloudRain,
  TrendingUp,
  Bot,
  Globe,
  Mic,
  CheckCircle,
  HelpCircle,
  Eye,
  Layers,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterDemo: () => void;
  onSignIn?: () => void;
  onRegister?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onEnterDemo,
  onSignIn,
  onRegister,
}) => {
  return (
    <div className="space-y-16 pb-20 max-w-5xl mx-auto px-4">
      {/* 1. Hero Section */}
      <div className="text-center pt-10 sm:pt-16 space-y-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>AGROSAARTHI 2.0 • AI PROACTIVE FARM COPILOT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 font-serif tracking-tight max-w-3xl mx-auto leading-tight">
          Your AI Copilot for Every Farming Decision.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AgroSaarthi combines weather telemetry, crop stage lifecycle, market conditions, and government schemes to help farmers understand risks and decide <strong>what to do next</strong> — in their regional language.
        </p>

        {/* Action CTAs (Clear Login & Register as Farmer actions) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRegister || onEnterApp}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Sprout className="w-4 h-4" />
            <span>Register as Farmer</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSignIn || onEnterApp}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Login</span>
          </button>
        </div>

        <div className="pt-2 text-xs text-slate-500 font-medium flex items-center justify-center gap-4 flex-wrap">
          <span>✓ Zero Hallucination Guarantee</span>
          <span>•</span>
          <span>✓ ICAR Grounded Knowledge</span>
          <span>•</span>
          <span>✓ Multilingual Voice Accessible</span>
        </div>
      </div>

      {/* 2. Differentiator Highlight: NOT JUST A CHATBOT */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-emerald-800">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            PROACTIVE DECISION SUPPORT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            "Know your farm. Know your risks. Know what to do next."
          </h2>
          <p className="text-sm text-emerald-100 leading-relaxed">
            AgroSaarthi is not merely a reactive chatbot. It actively monitors your 2-acre tomato plot against upcoming 35mm rainstorms, informs you to delay irrigation, warns of fungal risks, and spots favorable wholesale mandi prices before market saturation.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-emerald-800/80 text-xs">
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold block uppercase">WHAT?</span>
            <span className="font-bold text-white text-sm">35mm Rain Approaching</span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold block uppercase">WHY?</span>
            <span className="font-bold text-white text-sm">Flowering Waterlogging Risk</span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold block uppercase">WHEN?</span>
            <span className="font-bold text-white text-sm">Within 6 Hours</span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold block uppercase">WHAT NEXT?</span>
            <span className="font-bold text-white text-sm">Clear Drainage Furrows</span>
          </div>
        </div>
      </div>

      {/* 3. How It Works (4 Clear Steps) */}
      <div className="space-y-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          How AgroSaarthi Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Tell Us About Your Farm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Input crop, variety, land size, irrigation type, sowing date, and location.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-sm">AI Understands Context</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We map your soil, growth stage, and crop phenology to agricultural research guidelines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-sm">We Monitor Live Changes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Doppler weather forecasts, daily APMC mandi rates, and local pest alerts are cross-analyzed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
              4
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Receive Priorities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear, numbered recommendations tell you what action to take today and why.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Built for Accessibility & Trust */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-fit">
            <Mic className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-serif">Built for Field Accessibility</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Voice-first design with speech input and audio readback. Full multilingual architecture for English, Hindi, and Telugu, with simplified high-contrast Mobile Farmer Mode.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="p-3 bg-teal-50 text-teal-800 rounded-2xl w-fit">
            <ShieldCheck className="w-6 h-6 text-teal-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-serif">Trust & Human Safeguards</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every recommendation cites verified agricultural sources, displays AI confidence levels, and provides instant one-click escalation to human agricultural extension officers.
          </p>
        </div>
      </div>
    </div>
  );
};
