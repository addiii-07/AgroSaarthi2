import React, { useState } from 'react';
import { User, Language } from '../types';
import { cropService } from '../services/cropService';
import {
  CROPS,
  CROP_VARIETIES,
  INDIAN_STATES,
  DISTRICTS,
  IRRIGATION_TYPES,
  SOIL_TYPES,
  GROWTH_STAGES,
} from '../data/mockData';
import {
  Sprout,
  Droplets,
  Layers,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Info,
  Bug,
} from 'lucide-react';

interface CropAdvisor2Props {
  user: User;
  language: Language;
  onNavigate?: (tab: string) => void;
}

export const CropAdvisor2: React.FC<CropAdvisor2Props> = ({ user, language, onNavigate }) => {
  const [selectedCrop, setSelectedCrop] = useState(user.crop || 'Tomato');
  const [selectedVariety, setSelectedVariety] = useState(
    user.crop_variety || (user as any).cropVariety || 'Arka Rakshak (Hybrid)'
  );
  const [state, setState] = useState(user.state || 'Telangana');
  const [district, setDistrict] = useState(user.district || 'Rangareddy');
  const [soilType, setSoilType] = useState(user.soil_type || 'Red Soil (Sandy/Clay Loam)');
  const [irrigationType, setIrrigationType] = useState(user.irrigation_type || 'Drip Irrigation');
  const [growthStage, setGrowthStage] = useState(user.growth_stage || 'Flowering & Budding (45-75 days)');

  const timeline = cropService.getCropTimeline();

  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop);
    const vars = CROP_VARIETIES[crop];
    if (vars && vars.length > 0) setSelectedVariety(vars[0]);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Sprout className="w-4 h-4 text-emerald-700" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Agronomic Decision Copilot
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            AI Crop Lifecycle Advisor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stage-specific nutrition, irrigation timing, fungal diagnostics, and harvest scheduling for {selectedCrop}.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>87% AI Confidence Estimate</span>
        </div>
      </div>

      {/* 2. Interactive Farm Context Configurator */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Target Crop & Field Context</span>
          <span className="text-xs text-slate-400 font-normal">• Adjust to evaluate alternative scenarios</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-emerald-900"
            >
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Variety</label>
            <input
              type="text"
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Current Growth Stage</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            >
              {GROWTH_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Irrigation System</label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            >
              {IRRIGATION_TYPES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Visual Crop Lifecycle Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">Crop Lifecycle Timeline</h2>
            <p className="text-xs text-slate-500">Track progression and stage-critical agronomic interventions</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full self-start sm:self-auto">
            CURRENT: FLOWERING & BUDDING
          </span>
        </div>

        {/* Horizontal Visual Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {timeline.map((stg) => {
            const isCurrent = stg.status === 'current';
            const isCompleted = stg.status === 'completed';

            return (
              <div
                key={stg.id}
                className={`p-4 rounded-2xl border text-xs flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'border-2 border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50 opacity-90'
                    : 'border-slate-200 bg-white opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500">{stg.durationDays}</span>
                    {isCurrent ? (
                      <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                        CURRENT
                      </span>
                    ) : isCompleted ? (
                      <span className="text-emerald-600 font-bold text-[10px]">✓ Done</span>
                    ) : (
                      <span className="text-slate-400 font-medium text-[10px]">Upcoming</span>
                    )}
                  </div>

                  <h3 className={`font-bold text-xs sm:text-sm mb-1 ${isCurrent ? 'text-emerald-950' : 'text-slate-900'}`}>
                    {stg.name}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-snug">{stg.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Key Interventions:</span>
                  <ul className="space-y-0.5 text-[10px] text-slate-700">
                    {stg.keyManagementTasks.map((t, i) => (
                      <li key={i} className="truncate">• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Stage-Specific Agronomic Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fertilizer & Nutrient Plan */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
              <Sprout className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Flowering Nutrition & Fertigation Schedule</h3>
              <p className="text-[11px] text-slate-500">ICAR Tomato Nutrient Protocol</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Foliar Micronutrient Application:</span>
              <p className="text-slate-600 mt-0.5">
                Apply Solubor / Boron 20% at 1.0 g per Litre during 50% flowering. Boosts pollen viability and prevents flower cluster drop.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Drip Fertigation Dosage:</span>
              <p className="text-slate-600 mt-0.5">
                Water-soluble 13-0-45 (Potassium Nitrate) @ 2.5 kg/acre twice weekly through drip venturi to stimulate early fruit setting.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Source: ICAR-IIHR Tomato Manual</span>
            <span className="text-emerald-700 font-bold">Confidence: 94%</span>
          </div>
        </div>

        {/* Pest & Disease Early Diagnostics */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-rose-50 text-rose-800 rounded-xl">
              <Bug className="w-5 h-5 text-rose-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Pest & Pathogen Early Diagnostics</h3>
              <p className="text-[11px] text-slate-500">Pre-symptomatic moisture correlation</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-rose-950">Potential Fungal Risk (Early Blight / Alternaria)</span>
                <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">POSSIBLE RISK</span>
              </div>
              <p className="text-slate-700 leading-snug">
                Why: High humidity (78%) + forecasted rain. Inspect lower leaves for circular target-board spots.
              </p>
              <div className="mt-2 text-[11px] text-rose-900 font-medium">
                Action: If spotted, spray Copper Oxychloride (2.5g/L) or organic Neem 5% once rain clears.
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block">Blossom End Rot Prevention:</span>
              <p className="text-slate-600 mt-0.5">
                Maintain uniform soil moisture; alternating dry and waterlogged conditions induces calcium deficiency at fruit blossom tip.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Note: Potential risk, needs field confirmation</span>
            <span className="text-emerald-700 font-bold">Confidence: 86%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
