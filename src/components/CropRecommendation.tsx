import React, { useState } from 'react';
import { DISTRICTS } from '../data/mockData';
import { CropRecommendationResponse } from '../types';
import {
  Sprout,
  Sparkles,
  Award,
  CheckCircle2,
  Droplets,
  Layers,
  BarChart3,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface CropRecommendationProps {
  userDistrict?: string;
  language?: string;
}

export const CropRecommendation: React.FC<CropRecommendationProps> = ({ userDistrict = 'Guntur', language = 'en' }) => {
  const [soilType, setSoilType] = useState('Black Soil');
  const [district, setDistrict] = useState(userDistrict);
  const [season, setSeason] = useState('Kharif');
  const [rainfall, setRainfall] = useState<'Low (<500mm)' | 'Moderate (500-1000mm)' | 'High (>1000mm)'>('Moderate (500-1000mm)');
  const [waterAvailability, setWaterAvailability] = useState<'Abundant' | 'Moderate' | 'Scarcity'>('Moderate');
  const [previousCrop, setPreviousCrop] = useState('Paddy (Rice)');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendationResponse | null>(null);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilType,
          district,
          season,
          rainfall,
          waterAvailability,
          previousCrop,
          language,
        }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (res.ok && data.result) {
        setResult(data.result);
      }
    } catch (err) {
      console.warn('Error fetching crop recommendation:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#1B3022] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-900/80">
        <div className="flex items-center space-x-3 mb-2">
          <span className="bg-[#F27D26] text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> AI Agronomist Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Crop Recommendation</h1>
        <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl mt-1">
          Input your field soil, rainfall history, and water source to receive tailored high-yield crop suggestions powered by Gemini AI models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Field Parameters Form
          </h2>

          <form onSubmit={handleRecommend} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">District *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Soil Type *</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-semibold text-slate-800"
              >
                <option value="Black Soil">Black Soil (Deep Regur)</option>
                <option value="Red Soil">Red Soil (Chalka)</option>
                <option value="Alluvial Soil">Alluvial Soil (Delta)</option>
                <option value="Clay Soil">Clay Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Cropping Season *</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="Kharif">Kharif (Monsoon: Jun - Oct)</option>
                <option value="Rabi">Rabi (Winter: Oct - Mar)</option>
                <option value="Zaid">Zaid (Summer: Mar - Jun)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Rainfall Expectation *</label>
              <select
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="Low (<500mm)">Low (&lt; 500mm)</option>
                <option value="Moderate (500-1000mm)">Moderate (500 - 1000mm)</option>
                <option value="High (>1000mm)">High (&gt; 1000mm)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Water Availability *</label>
              <select
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="Abundant">Abundant (Canal / Continuous Borewell)</option>
                <option value="Moderate">Moderate (Drip / Timed Supply)</option>
                <option value="Scarcity">Scarcity (Rainfed / Dryland)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Previous Crop Grown *</label>
              <input
                type="text"
                value={previousCrop}
                onChange={(e) => setPreviousCrop(e.target.value)}
                placeholder="e.g. Paddy or Cotton"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Soil & Climate with AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Get AI Crop Recommendation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Display Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-6">
              {/* Primary Recommended Crop Card */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mb-1 uppercase tracking-wider">
                      Best AI Match
                    </span>
                    <h2 className="text-2xl font-extrabold font-serif">{result.recommendedCrop}</h2>
                    <p className="text-xs text-emerald-100 mt-1">Growing Period: {result.growingPeriod}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-center">
                    <div className="text-[10px] text-emerald-200">Confidence</div>
                    <div className="text-xl font-black font-mono text-amber-300">{result.confidenceScore}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20 text-xs">
                  <div>
                    <div className="text-emerald-200 text-[10px]">Expected Yield</div>
                    <div className="font-bold text-white text-sm">{result.expectedYield}</div>
                  </div>
                  <div>
                    <div className="text-emerald-200 text-[10px]">Estimated Profit</div>
                    <div className="font-bold text-amber-300 text-sm">{result.estimatedProfit}</div>
                  </div>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100 text-xs">
                <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Agronomist Reasoning
                </div>
                <p className="text-slate-700 leading-relaxed">{result.aiReasoning}</p>
              </div>

              {/* Fertilizer Plan */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-2 text-xs">
                <div className="font-bold text-slate-900 mb-2">Recommended Fertilizer Schedule</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Basal Dose</span>
                    <p className="text-slate-700 text-[11px] mt-1">{result.fertilizerPlan?.basal}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">1st Top Dressing</span>
                    <p className="text-slate-700 text-[11px] mt-1">{result.fertilizerPlan?.firstDose}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-sky-700 uppercase">2nd Top Dressing</span>
                    <p className="text-slate-700 text-[11px] mt-1">{result.fertilizerPlan?.secondDose}</p>
                  </div>
                </div>
              </div>

              {/* Water Requirement & Alternate Crops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-slate-900 block mb-1">Water Requirement</span>
                  <p className="text-slate-600">{result.waterRequirement}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-slate-900 block mb-1">Alternative Suitable Crops</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {result.alternateCrops?.map((crop, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Ready for AI Calculation</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill out your soil type, district, season, and water availability on the left form to generate custom crop suggestions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
