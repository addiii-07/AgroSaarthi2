import React, { useState, useEffect } from 'react';
import { SmartFarmingGuide, User, Language } from '../types';
import {
  Sprout,
  Sparkles,
  Search,
  Droplets,
  CloudSun,
  TestTube,
  Bug,
  TrendingUp,
  Building,
  Calendar,
  BarChart3,
  Lightbulb,
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  Layers,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  RefreshCw,
  MapPin,
  Coins,
  ChevronDown,
} from 'lucide-react';

interface CropAdvisorProps {
  currentUser?: User | null;
  language?: Language;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Punjab',
  'Uttar Pradesh',
  'Gujarat',
  'Madhya Pradesh',
  'Rajasthan',
  'Odisha',
  'West Bengal',
  'Haryana',
  'Bihar',
];

const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Guntur',
    'Krishna',
    'Ananthapuramu',
    'Kurnool',
    'YSR Kadapa',
    'East Godavari',
    'West Godavari',
    'Prakasam',
    'Chittoor',
    'Visakhapatnam',
    'Sri Sathya Sai',
    'Nandyal',
    'Tirupati',
    'Nellore',
  ],
  Telangana: [
    'Warangal',
    'Karimnagar',
    'Nizamabad',
    'Khammam',
    'Nalgonda',
    'Mahabubnagar',
    'Sangareddy',
    'Rangareddy',
    'Suryapet',
  ],
  Maharashtra: [
    'Nashik',
    'Pune',
    'Aurangabad',
    'Nagpur',
    'Solapur',
    'Kolhapur',
    'Jalgaon',
    'Ahmednagar',
    'Satara',
  ],
  Karnataka: [
    'Belagavi',
    'Mysuru',
    'Mandya',
    'Davanagere',
    'Raichur',
    'Dharwad',
    'Hassan',
    'Shivamogga',
  ],
  'Tamil Nadu': [
    'Coimbatore',
    'Thanjavur',
    'Madurai',
    'Salem',
    'Erode',
    'Tiruchirappalli',
    'Vellore',
  ],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bhatinda', 'Sangrur', 'Firozpur'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Kanpur', 'Agra', 'Gorakhpur', 'Meerut', 'Bareilly'],
  Gujarat: ['Rajkot', 'Surat', 'Vadodara', 'Junagadh', 'Ahmedabad', 'Anand', 'Bhavnagar'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior', 'Hoshangabad'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ganganagar', 'Bikaner'],
  Odisha: ['Cuttack', 'Bhubaneswar', 'Ganjam', 'Balasore', 'Sambalpur'],
  'West Bengal': ['Burdwan', 'Hooghly', 'Nadia', 'Murshidabad', 'Birbhum'],
  Haryana: ['Karnal', 'Hisar', 'Ambala', 'Sirsa', 'Kurukshetra'],
  Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Nalanda', 'Bhagalpur'],
};

const POPULAR_CROPS = [
  'Paddy (Rice)',
  'Chilli',
  'Cotton',
  'Maize',
  'Tomato',
  'Groundnut',
  'Sugarcane',
  'Wheat',
  'Bengal Gram (Chickpea)',
  'Turmeric',
  'Onion',
  'Soybean',
  'Banana',
  'Mango',
  'Mustard',
  'Potato',
];

export const CropAdvisor: React.FC<CropAdvisorProps> = ({ currentUser, language = 'en' }) => {
  // Input State
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy (Rice)');
  const [selectedState, setSelectedState] = useState<string>(currentUser?.district ? 'Andhra Pradesh' : 'Andhra Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentUser?.district || 'Guntur');

  // Loading & Step State
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [guide, setGuide] = useState<SmartFarmingGuide | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Q&A Follow-up State
  const [qaQuestion, setQaQuestion] = useState<string>('');
  const [qaLoading, setQaLoading] = useState<boolean>(false);
  const [qaHistory, setQaHistory] = useState<Array<{ question: string; answer: string; timestamp: string }>>([]);

  // Auto-update districts when state changes
  useEffect(() => {
    const districts = DISTRICTS_BY_STATE[selectedState] || ['Central District'];
    if (!districts.includes(selectedDistrict)) {
      setSelectedDistrict(districts[0]);
    }
  }, [selectedState]);

  // Handle Guide Generation
  const handleGenerateGuide = async () => {
    setLoading(true);
    setError(null);
    setLoadingStep(1);

    // Simulated multi-step visual sequence for transparency & smooth UX
    const timer1 = setTimeout(() => setLoadingStep(2), 500);
    const timer2 = setTimeout(() => setLoadingStep(3), 1000);
    const timer3 = setTimeout(() => setLoadingStep(4), 1500);
    const timer4 = setTimeout(() => setLoadingStep(5), 2000);

    try {
      const res = await fetch('/api/ai/smart-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop,
          state: selectedState,
          district: selectedDistrict,
          language: language,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);

      if (!res.ok) {
        throw new Error('Failed to generate farming guide. Please try again.');
      }

      const data = await res.json();
      if (data && data.guide) {
        setGuide(data.guide);
      } else {
        throw new Error('Invalid response received from advisor backend.');
      }
    } catch (err: any) {
      console.error('Error generating guide:', err);
      setError(err?.message || 'Failed to generate guide');
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  // Handle Follow-up Q&A Submission
  const handleAskQuestion = async (customQ?: string) => {
    const query = customQ || qaQuestion;
    if (!query.trim()) return;

    setQaLoading(true);
    const userQ = query.trim();
    if (!customQ) setQaQuestion('');

    try {
      const res = await fetch('/api/ai/crop-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop,
          state: selectedState,
          district: selectedDistrict,
          question: userQ,
          guideContext: guide,
          farmerProfile: currentUser,
          language: language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQaHistory((prev) => [
          ...prev,
          {
            question: userQ,
            answer: data.answer || 'Thank you for your question. Always ensure balanced nutrition and proper crop rotation.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error('QA error:', err);
    } finally {
      setQaLoading(false);
    }
  };

  const SAMPLE_QUESTIONS = [
    `Why are my ${selectedCrop.toLowerCase()} leaves turning yellow?`,
    `How often should I irrigate ${selectedCrop} during warm days?`,
    `Which fertilizer should I buy for initial land preparation?`,
    `Is current weather in ${selectedDistrict} suitable for sowing?`,
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-[#1B3022] via-[#24422e] to-[#122418] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 pointer-events-none">
          <Sprout className="w-96 h-96 text-emerald-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Smart Beginner Farming Guide</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Crop Knowledge + Smart Farming Advisor
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Designed for beginner farmers who have decided on a crop but need a complete, step-by-step roadmap.
            Powered by live weather data, market prices, government schemes, and Gemini AI.
          </p>
        </div>
      </div>

      {/* Inputs Form Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-100 space-y-6">
        <div className="flex items-center space-x-3 border-b border-emerald-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Select Crop & Location</h2>
            <p className="text-xs text-slate-500">
              Select what you want to grow and your location. (Soil type is calculated automatically for you!)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* 1. Crop Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Crop Name</span>
            </label>
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {POPULAR_CROPS.map((crop) => (
                  <option key={crop} value={crop}>
                    🌾 {crop}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-4 pointer-events-none" />
            </div>
          </div>

          {/* 2. State Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>State</span>
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    🏛 {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-4 pointer-events-none" />
            </div>
          </div>

          {/* 3. District Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>District</span>
            </label>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {(DISTRICTS_BY_STATE[selectedState] || ['Central District']).map((dist) => (
                  <option key={dist} value={dist}>
                    📍 {dist}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerateGuide}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#1B3022] to-emerald-800 hover:from-emerald-900 hover:to-[#1B3022] text-white rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group disabled:opacity-75 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                <span>Generating Smart Farming Guide...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Generate Smart Farming Guide</span>
                <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Sequence Feedback */}
      {loading && (
        <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-8 shadow-2xl border border-emerald-800/80 space-y-6 text-center animate-pulse">
          <div className="w-16 h-16 rounded-3xl bg-emerald-800/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Analyzing Agriculture Datasets</h3>
            <p className="text-xs text-emerald-300/80 mt-1">
              Synthesizing live weather, local market prices, government schemes & soil science for {selectedCrop}...
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left text-xs">
            <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${loadingStep >= 1 ? 'bg-emerald-900/80 border-emerald-500/50 text-white' : 'bg-emerald-900/20 border-emerald-900/40 text-emerald-500'}`}>
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 1 ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <span>Step 1: Fetching live weather for {selectedDistrict} District</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${loadingStep >= 2 ? 'bg-emerald-900/80 border-emerald-500/50 text-white' : 'bg-emerald-900/20 border-emerald-900/40 text-emerald-500'}`}>
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 2 ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <span>Step 2: Fetching live Mandi rates for {selectedCrop}</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${loadingStep >= 3 ? 'bg-emerald-900/80 border-emerald-500/50 text-white' : 'bg-emerald-900/20 border-emerald-900/40 text-emerald-500'}`}>
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 3 ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <span>Step 3: Scanning applicable Government Schemes</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${loadingStep >= 4 ? 'bg-emerald-900/80 border-emerald-500/50 text-white' : 'bg-emerald-900/20 border-emerald-900/40 text-emerald-500'}`}>
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 4 ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <span>Step 4: Incorporating Farmer Profile & Agronomic Data</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${loadingStep >= 5 ? 'bg-emerald-900/80 border-emerald-500/50 text-white' : 'bg-emerald-900/20 border-emerald-900/40 text-emerald-500'}`}>
              <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 5 ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <span>Step 5: Generating AI Beginner Farming Master Guide...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Guide Results Display (11 Modern Cards) */}
      {guide && !loading && (
        <div className="space-y-8 animate-fadeIn">
          {/* Active Guide Header Info */}
          <div className="bg-emerald-900 text-white p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-emerald-700 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 font-black flex items-center justify-center text-lg">
                🌾
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {guide.cropName} Farming Guide • {guide.district}, {guide.state}
                </h3>
                <p className="text-xs text-emerald-200">
                  Customized for beginner farmers • Duration: {guide.overview.growthDuration}
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateGuide}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Guide</span>
            </button>
          </div>

          {/* The 11 Modern Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CARD 1: Crop Overview */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Card 1
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">🌾 Crop Overview</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{guide.overview.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Category</span>
                  <span className="font-bold text-slate-800">{guide.overview.category}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Duration</span>
                  <span className="font-bold text-emerald-800">{guide.overview.growthDuration}</span>
                </div>
              </div>
            </div>

            {/* CARD 2: Suitable Soil */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Card 2
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">🌱 Suitable Soil</h3>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Best Soil Types
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.suitableSoil.bestSoils.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Why These Soils?
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{guide.suitableSoil.whySuitable}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Ideal pH Range:</span>
                <span className="font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {guide.suitableSoil.phRange}
                </span>
              </div>
            </div>

            {/* CARD 3: Water & Irrigation */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                    Card 3
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">💧 Water & Irrigation</h3>

                <div className="bg-sky-50 p-2.5 rounded-xl text-xs border border-sky-100">
                  <span className="text-[10px] font-bold text-sky-600 uppercase block">Total Water Requirement</span>
                  <span className="font-bold text-sky-950">{guide.waterAndIrrigation.waterRequirement}</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Irrigation Schedule
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {guide.waterAndIrrigation.irrigationSchedule.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-500 block mb-1">Critical Moisture Stages:</span>
                <div className="flex flex-wrap gap-1">
                  {guide.waterAndIrrigation.criticalStages.map((cs, i) => (
                    <span key={i} className="px-2 py-0.5 bg-sky-100 text-sky-900 rounded text-[11px] font-semibold">
                      {cs}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 4: Weather Suitability */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Card 4
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">🌦 Weather Suitability</h3>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1 ${
                      guide.weatherSuitability.isSuitable
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{guide.weatherSuitability.isSuitable ? 'Highly Suitable' : 'Requires Care'}</span>
                  </span>
                </div>

                <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950">
                  <span className="font-bold block mb-0.5">Live District Conditions:</span>
                  <span>{guide.weatherSuitability.currentConditions}</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Weather Advisory
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{guide.weatherSuitability.advisoryNote}</p>
                </div>
              </div>
            </div>

            {/* CARD 5: Fertilizer Recommendation */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <TestTube className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Card 5
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">🌿 Fertilizer Plan</h3>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block text-[11px] uppercase">Basal Dose (At Plowing)</span>
                    <span className="text-slate-700">{guide.fertilizerRecommendation.basalDose}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block text-[11px] uppercase">Top Dressing 1 (20-25 Days)</span>
                    <span className="text-slate-700">{guide.fertilizerRecommendation.topDressing1}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block text-[11px] uppercase">Top Dressing 2 (45-50 Days)</span>
                    <span className="text-slate-700">{guide.fertilizerRecommendation.topDressing2}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-emerald-800 block mb-0.5">🌱 Organic & Bio-Fertilizer Tip:</span>
                <p className="text-slate-600">{guide.fertilizerRecommendation.organicTips}</p>
              </div>
            </div>

            {/* CARD 6: Pests & Diseases */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                    <Bug className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                    Card 6
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">🐛 Pests & Diseases</h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
                    <span className="font-bold text-rose-900 block text-[10px] uppercase mb-1">Common Pests</span>
                    <ul className="space-y-0.5 text-[11px] text-slate-700">
                      {guide.pestsAndDiseases.commonPests.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
                    <span className="font-bold text-rose-900 block text-[10px] uppercase mb-1">Common Diseases</span>
                    <ul className="space-y-0.5 text-[11px] text-slate-700">
                      {guide.pestsAndDiseases.commonDiseases.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Prevention & Safeguards
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {guide.pestsAndDiseases.preventionMethods.map((pm, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{pm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CARD 7: Market Price */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Card 7
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">💰 Market Price & Mandi</h3>

                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-3.5 rounded-2xl border border-teal-200">
                  <span className="text-[10px] font-bold text-teal-700 uppercase block">Current Mandi Rate</span>
                  <span className="text-xl font-extrabold text-teal-950">{guide.marketPriceInfo.currentPrice}</span>
                  <p className="text-[11px] text-teal-800 mt-1 font-medium">📍 Mandi: {guide.marketPriceInfo.mandiName}</p>
                </div>

                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-bold text-slate-500">Price Trend: </span>
                    <span className="font-semibold text-emerald-700">{guide.marketPriceInfo.trend}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-1">{guide.marketPriceInfo.sellingAdvice}</p>
                </div>
              </div>
            </div>

            {/* CARD 8: Government Schemes */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    Card 8
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">🏛 Government Schemes</h3>

                <div className="space-y-2 text-xs">
                  {guide.governmentSchemes.map((sch, i) => (
                    <div key={i} className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-1">
                      <span className="font-bold text-purple-950 block">{sch.name}</span>
                      <p className="text-slate-600 text-[11px]">{sch.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 9: Farming Timeline */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-3 hover:shadow-xl transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">📅 Step-by-step Farming Timeline</h3>
                      <p className="text-xs text-slate-500">From land preparation until final harvesting & sales</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Card 9
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                  {guide.farmingTimeline.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          {step.timeframe}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs">{step.stage}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{step.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 10: Estimated Profit */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Card 10
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">📈 Estimated Profit Range</h3>

                <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-4 rounded-2xl space-y-1 shadow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                    Estimated Net Profit / Acre
                  </span>
                  <span className="text-xl font-black text-amber-300">{guide.estimatedProfit.netProfitRange}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Cost / Acre</span>
                    <span className="font-bold text-slate-800">{guide.estimatedProfit.costPerAcre}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Expected Yield</span>
                    <span className="font-bold text-emerald-800">{guide.estimatedProfit.expectedYield}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 11: AI Tips */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-2 hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Card 11
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">🤖 AI Tips & Precautions</h3>

                <ul className="space-y-2 text-xs text-slate-700">
                  {guide.aiTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* EXTRA FEATURE: "Ask AI About This Crop" */}
          <div className="bg-gradient-to-br from-[#1B3022] via-[#23422e] to-[#14281a] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-700 space-y-6">
            <div className="flex items-center space-x-3 border-b border-emerald-800/80 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-[#1B3022] flex items-center justify-center font-black shadow">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Ask AI About This Crop</h3>
                <p className="text-xs text-emerald-200/90">
                  Have specific questions for {guide.cropName} in {guide.district}? Ask anything below! Answers use live weather, Mandi rates, and farmer profile data.
                </p>
              </div>
            </div>

            {/* Suggested Sample Question Chips */}
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-2.5">
                Suggested Questions:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskQuestion(q)}
                    disabled={qaLoading}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-emerald-500/30 text-xs text-emerald-100 font-medium transition-all text-left hover:border-amber-400 cursor-pointer disabled:opacity-50"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Input Box */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={qaQuestion}
                onChange={(e) => setQaQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder={`Ask follow-up about ${guide.cropName} (e.g. why are leaves turning yellow?)...`}
                disabled={qaLoading}
                className="flex-1 bg-white/10 border border-emerald-500/40 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
              <button
                onClick={() => handleAskQuestion()}
                disabled={qaLoading || !qaQuestion.trim()}
                className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {qaLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Conversation Q&A History */}
            {qaHistory.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-emerald-800/80">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Follow-up Answers for {guide.cropName}:
                </h4>

                <div className="space-y-4">
                  {qaHistory.map((item, idx) => (
                    <div key={idx} className="bg-white/10 rounded-2xl p-4 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                        <span>❓ Question: {item.question}</span>
                        <span className="text-[10px] text-emerald-300/70">{item.timestamp}</span>
                      </div>
                      <div className="text-xs text-emerald-50 leading-relaxed whitespace-pre-line bg-black/20 p-3 rounded-xl border border-white/5 font-sans">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
