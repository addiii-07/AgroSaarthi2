import React, { useState, useEffect } from 'react';
import {
  marketService,
  MarketAdvisorInsight,
  calculateFarmEconomics,
  SOURCED_REFERENCE_MANDI_RECORDS,
  ReferenceMandiRecord,
} from '../services/marketService';
import { MarketPriceItem, User, FarmDetails } from '../types';
import { SUPABASE_URL } from '../lib/supabase';
import {
  TrendingUp,
  ArrowUpDown,
  Filter,
  DollarSign,
  Calculator,
  Store,
  Info,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MarketAdvisorPageProps {
  onNavigate?: (tab: string) => void;
  user?: User | null;
  farm?: FarmDetails;
}

export const MarketAdvisorPage: React.FC<MarketAdvisorPageProps> = ({
  onNavigate,
  user,
  farm,
}) => {
  // Farmer's Profile Identity
  const farmerCrop = user?.primaryCrop || user?.crop || 'Tomato';
  const farmerState = user?.state || 'Telangana';
  const farmerDistrict = user?.district || 'Rangareddy';

  // State: Live Mandi API Fetch
  const [livePrices, setLivePrices] = useState<MarketPriceItem[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveSource, setLiveSource] = useState<string>('agrosaarthi-market');
  const [liveFetchedDate, setLiveFetchedDate] = useState<string | null>(null);
  const [isRetryingLive, setIsRetryingLive] = useState(false);

  // State: Reference Data Filters (Working crop, state, district, and market filters)
  const [refCropFilter, setRefCropFilter] = useState<string>('All');
  const [refStateFilter, setRefStateFilter] = useState<string>('All');
  const [refDistrictFilter, setRefDistrictFilter] = useState<string>('All');
  const [refMarketFilter, setRefMarketFilter] = useState<string>('All');
  const [refSortBy, setRefSortBy] = useState<'price-asc' | 'price-desc'>('price-asc');

  // Farm Economics Calculator State
  const [econCrop, setEconCrop] = useState(farmerCrop);
  const [farmSize, setFarmSize] = useState<number>(2.0);
  const [expectedYield, setExpectedYield] = useState<number>(120); // Q/acre
  const [sellingPrice, setSellingPrice] = useState<number>(1900); // ₹/Q (aligned with Falaknuma reference benchmark)
  const [inputCost, setInputCost] = useState<number>(28000); // ₹/acre
  const [laborCost, setLaborCost] = useState<number>(18000); // ₹/acre
  const [transportCost, setTransportCost] = useState<number>(80); // ₹/Q

  // 1. Attempt to fetch real prices through existing market-price API / Edge Function
  const fetchLivePrices = async () => {
    setLoadingLive(true);
    setIsRetryingLive(true);
    setLiveError(null);

    try {
      const res = await marketService.getLivePricesResult(
        refCropFilter !== 'All' ? refCropFilter : undefined,
        refDistrictFilter !== 'All' ? refDistrictFilter : undefined
      );

      if (res.success && Array.isArray(res.prices) && res.prices.length > 0) {
        setLivePrices(res.prices);
        setLiveSource(res.source);
        setLiveFetchedDate(
          res.fetchedDate ||
            new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
        );
        setLiveError(null);
      } else {
        // Request failed or returned empty: show clear error message, do not fabricate live data
        setLivePrices([]);
        setLiveError(
          res.error ||
            'Live market data temporarily unavailable: Upstream APMC / data.gov.in gateway (agrosaarthi-market) could not be reached.'
        );
        setLiveSource('agrosaarthi-market Edge Function (Offline)');
      }
    } catch (e: any) {
      setLivePrices([]);
      setLiveError(
        'Live market data temporarily unavailable: Upstream APMC / data.gov.in gateway could not be reached.'
      );
      setLiveSource('agrosaarthi-market Edge Function (Offline)');
    } finally {
      setLoadingLive(false);
      setIsRetryingLive(false);
    }
  };

  useEffect(() => {
    fetchLivePrices();
  }, []);

  // Filter reference records strictly based on selected filters
  const matchedReferenceRecords = SOURCED_REFERENCE_MANDI_RECORDS.filter((rec) => {
    if (refCropFilter !== 'All' && rec.crop.toLowerCase() !== refCropFilter.toLowerCase()) {
      return false;
    }
    if (refStateFilter !== 'All' && rec.state.toLowerCase() !== refStateFilter.toLowerCase()) {
      return false;
    }
    if (refDistrictFilter !== 'All' && rec.district.toLowerCase() !== refDistrictFilter.toLowerCase()) {
      return false;
    }
    if (refMarketFilter !== 'All' && rec.market.toLowerCase() !== refMarketFilter.toLowerCase()) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (refSortBy === 'price-asc') return a.pricePerQuintal - b.pricePerQuintal;
    return b.pricePerQuintal - a.pricePerQuintal;
  });

  // Action: Match my farm profile crop and state
  const handleMatchFarmProfile = () => {
    // If farmer has Tomato in Telangana, sets Tomato + Telangana
    if (farmerCrop.toLowerCase().includes('tomato')) {
      setRefCropFilter('Tomato');
      setRefStateFilter('Telangana');
      setRefDistrictFilter('All');
      setRefMarketFilter('All');
    } else if (farmerCrop.toLowerCase().includes('maize')) {
      setRefCropFilter('Maize');
      setRefStateFilter('Telangana');
      setRefDistrictFilter('All');
      setRefMarketFilter('All');
    } else {
      setRefCropFilter(farmerCrop);
      setRefStateFilter(farmerState);
      setRefDistrictFilter('All');
      setRefMarketFilter('All');
    }
  };

  const handleResetRefFilters = () => {
    setRefCropFilter('All');
    setRefStateFilter('All');
    setRefDistrictFilter('All');
    setRefMarketFilter('All');
  };

  // Farm Economics Calculation
  const economics = calculateFarmEconomics({
    crop: econCrop,
    farmSizeAcres: farmSize,
    expectedYieldPerAcreQuintals: expectedYield,
    sellingPricePerQuintal: sellingPrice,
    inputCostPerAcre: inputCost,
    laborCostPerAcre: laborCost,
    transportCostPerQuintal: transportCost,
  });

  const availableRefCrops = ['All', 'Tomato', 'Maize', 'Cotton', 'Chilli', 'Paddy (Rice)', 'Groundnut'];
  const availableRefStates = ['All', 'Telangana', 'India (National)', 'Andhra Pradesh', 'Maharashtra'];
  const availableRefDistricts = ['All', 'Hyderabad', 'Warangal', 'Telangana (Statewide)', 'National / All India', 'Rangareddy', 'Guntur'];
  const availableRefMarkets = [
    'All',
    'Bowenpally APMC',
    'RYTHU BAZAR FALAKNUMA',
    'Warangal APMC',
    'Telangana state median',
    'India national median',
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Market Intelligence & Price Advisory
            </span>

            {/* Integration Status Badge (Requirement 7: Do not claim live integration unless real request succeeds) */}
            {livePrices.length > 0 && !liveError ? (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live APMC Feed Active • {liveSource}
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
                ⚠️ Live Mandi Integration: Temporarily Unavailable
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Mandi Price Intelligence & Sell Advisor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized wholesale commodity valuation • Crop: <span className="font-semibold text-slate-800">{farmerCrop}</span> • Region: <span className="font-semibold text-slate-800">{farmerDistrict}, {farmerState}</span>
          </p>
        </div>

        {/* Status Chip */}
        <div className="self-start md:self-auto text-xs font-mono">
          {livePrices.length > 0 && !liveError ? (
            <div className="bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Report Date: {liveFetchedDate}</span>
            </div>
          ) : (
            <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-slate-600 flex items-center gap-2">
              <Store className="w-4 h-4 text-slate-500" />
              <span>data.gov.in / APMC Feed Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Priority 1 Requirement: Live Mandi Status Notice when upstream API is unavailable */}
      {liveError && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 text-amber-950 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-amber-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl mt-0.5 shrink-0 border border-amber-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                  APMC Upstream Telemetry Status
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-amber-950 font-serif">
                  Live market data temporarily unavailable
                </h3>
                <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                  {liveError}
                </p>
              </div>
            </div>

            <button
              onClick={fetchLivePrices}
              disabled={isRetryingLive}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-60 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetryingLive ? 'animate-spin' : ''}`} />
              <span>{isRetryingLive ? 'Checking Upstream API...' : 'Retry Live Mandi Feed'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Diagnostic Info:</span>
              <p className="text-slate-600 text-[11px]">
                Endpoint: <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900">{SUPABASE_URL ? `${SUPABASE_URL.replace(/^https?:\/\//, '')}/functions/v1/agrosaarthi-market` : 'agrosaarthi-market'}</code>
              </p>
            </div>
            <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Data Integrity Compliance:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                AgroSaarthi does not fabricate synthetic market quotes or display mock figures as live APMC data. Official historical reference data is provided below for demonstration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Live Prices Table (Displayed ONLY if real live API request succeeds) */}
      {!loadingLive && livePrices.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                🟢 Live APMC Stream
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 font-serif mt-1">Live Mandi Prices</h2>
              <p className="text-xs text-slate-500">
                Source: <span className="font-bold text-emerald-700">{liveSource}</span> • Report Date: <span className="font-mono">{liveFetchedDate}</span>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-3 px-3">Crop & Variety</th>
                  <th className="py-3 px-3">Mandi Market</th>
                  <th className="py-3 px-3">District</th>
                  <th className="py-3 px-3 text-right">Modal Price (₹/Quintal)</th>
                  <th className="py-3 px-3">Report Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {livePrices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 block">{item.cropName}</span>
                      <span className="text-[10px] text-slate-500">{item.variety}</span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">{item.mandiName}</td>
                    <td className="py-3.5 px-3 text-slate-600">{item.district}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-800 text-sm">
                      ₹{item.modalPrice.toLocaleString('en-IN')}/quintal
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Priority 1 Requirement: Separate, clearly labeled “Reference data for demonstration” section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 text-blue-900 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-300">
                📋 Reference data for demonstration
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
                Historical Benchmark Records
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
              Sourced Historical Mandi Benchmarks
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Verified historical market report figures preserved with actual dates and units. These are historical records, not live API responses.
            </p>
          </div>

          {/* Farm Profile Quick-Match Action */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleMatchFarmProfile}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title={`Filter by farmer's crop (${farmerCrop}) and location (${farmerState})`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Match My Farm ({farmerCrop})</span>
            </button>
            <button
              onClick={handleResetRefFilters}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Show All Benchmarks
            </button>
          </div>
        </div>

        {/* 5. Working crop, state, district, and market filters */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              Filter Sourced Reference Records:
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 px-2 font-medium">Sort Price:</span>
              <button
                onClick={() => setRefSortBy('price-asc')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                  refSortBy === 'price-asc' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                }`}
              >
                Low to High ↑
              </button>
              <button
                onClick={() => setRefSortBy('price-desc')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                  refSortBy === 'price-desc' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                }`}
              >
                High to Low ↓
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Crop Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Crop:</label>
              <select
                value={refCropFilter}
                onChange={(e) => setRefCropFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {availableRefCrops.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">State:</label>
              <select
                value={refStateFilter}
                onChange={(e) => setRefStateFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {availableRefStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">District:</label>
              <select
                value={refDistrictFilter}
                onChange={(e) => setRefDistrictFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {availableRefDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Market Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Market / APMC:</label>
              <select
                value={refMarketFilter}
                onChange={(e) => setRefMarketFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {availableRefMarkets.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 6. Sourced Reference Records Display: Desktop Table */}
        {matchedReferenceRecords.length > 0 ? (
          <div className="space-y-4">
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                    <th className="py-3 px-3 rounded-l-xl">Commodity Crop</th>
                    <th className="py-3 px-3">Market / APMC</th>
                    <th className="py-3 px-3">State & District</th>
                    <th className="py-3 px-3 text-right font-bold text-slate-800">Price (₹/Quintal)</th>
                    <th className="py-3 px-3">Report Date</th>
                    <th className="py-3 px-3 rounded-r-xl">Mandis / Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matchedReferenceRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-extrabold text-slate-900 text-sm">{item.crop}</span>
                        <span className="text-[10px] text-slate-500 block">Sourced Record</span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">{item.market}</td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="font-medium text-slate-700">{item.district}</span>
                        <span className="text-[10px] text-slate-500 block">{item.state}</span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-extrabold text-emerald-800 text-base">
                        ₹{item.pricePerQuintal.toLocaleString('en-IN')}<span className="text-xs text-slate-500 font-sans">/quintal</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-medium text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.reportDate}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-[11px] text-slate-600">
                        {item.reportingMandis ? (
                          <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                            {item.reportingMandis} reporting mandis
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">APMC Spot Auction</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="sm:hidden space-y-3">
              {matchedReferenceRecords.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">{item.crop}</span>
                      <span className="text-[11px] text-slate-600 block">{item.market}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-extrabold text-emerald-800 text-lg">
                        ₹{item.pricePerQuintal.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">per Quintal</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200 text-[11px]">
                    <span>Location: {item.district}, {item.state}</span>
                    <span className="font-mono font-semibold">{item.reportDate}</span>
                  </div>
                  {item.reportingMandis && (
                    <div className="text-[10px] text-slate-500 bg-white p-1.5 rounded-lg border border-slate-200">
                      Sample Size: {item.reportingMandis} reporting mandis
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State when no reference records match selected filters */
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-1" />
            <h4 className="text-sm font-bold text-slate-900">No Matching Reference Record Exists</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              No historical reference records match your selected filter combination (Crop:{' '}
              <span className="font-semibold">{refCropFilter}</span>, State:{' '}
              <span className="font-semibold">{refStateFilter}</span>, District:{' '}
              <span className="font-semibold">{refDistrictFilter}</span>, Market:{' '}
              <span className="font-semibold">{refMarketFilter}</span>).
            </p>
            <p className="text-[11px] text-slate-500 max-w-lg mx-auto">
              AgroSaarthi preserves strict data integrity: verified historical reference benchmarks are available for Maize (India National median, Telangana State median) and Tomato (Bowenpally APMC, RYTHU BAZAR FALAKNUMA, Warangal APMC). Hypothetical or unverified quotes are never fabricated.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetRefFilters}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reset Reference Filters
              </button>
            </div>
          </div>
        )}

        {/* 7. Requirement 6: Consistent Price per Quintal Explanation Notice */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-emerald-950 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-emerald-900 text-xs">
              Price per Quintal Standard & Valuation Notice
            </span>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              All market prices are quoted consistently in <strong>₹/quintal</strong> (1 Quintal = 100 kg).
              Actual on-ground mandi settlement prices vary considerably based on crop cultivar/variety, produce grade & quality (Grade-A / FAQ), moisture level, daily market arrival volumes, and auction date. Reference figures represent verified historical benchmarks for demonstration and comparison.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Farm Economics & Profit Estimator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
            <Calculator className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-serif">Farm Economics & Profit Estimator</h2>
            <p className="text-xs text-slate-500">Calculate projected gross revenue, input costs, and estimated net returns based on mandi benchmark rates</p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Crop</label>
            <input
              type="text"
              value={econCrop}
              onChange={(e) => setEconCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Farm Size (Acres)</label>
            <input
              type="number"
              step="0.5"
              value={farmSize}
              onChange={(e) => setFarmSize(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Expected Yield (Quintals/Acre)</label>
            <input
              type="number"
              value={expectedYield}
              onChange={(e) => setExpectedYield(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Expected Mandi Rate (₹/Quintal)</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-emerald-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Input Costs (Seeds, Fertilizer / Acre)</label>
            <input
              type="number"
              value={inputCost}
              onChange={(e) => setInputCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Labor Cost (Weeding, Harvest / Acre)</label>
            <input
              type="number"
              value={laborCost}
              onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Transport Cost (₹/Quintal)</label>
            <input
              type="number"
              value={transportCost}
              onChange={(e) => setTransportCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                // Preset benchmarks
                if (econCrop.toLowerCase().includes('tomato')) {
                  setSellingPrice(1900); // Falaknuma rate
                } else if (econCrop.toLowerCase().includes('maize')) {
                  setSellingPrice(2466); // Telangana median
                }
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
            >
              Use Mandi Benchmark
            </button>
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Production</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono my-0.5">
              {economics.totalExpectedYieldQuintals} <span className="text-xs font-sans">Quintals</span>
            </div>
            <span className="text-[10px] text-slate-500">Across {farmSize} acres</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Costs (Inputs + Labor + Transit)</span>
            <div className="text-xl font-extrabold text-rose-800 font-mono my-0.5">
              ₹{economics.totalCosts.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">₹{Math.round(economics.totalCosts / (farmSize || 1)).toLocaleString('en-IN')}/acre</span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <span className="text-[10px] text-emerald-800 font-bold uppercase block">Projected Net Return</span>
            <div className="text-2xl font-extrabold text-emerald-800 font-mono my-0.5">
              ₹{economics.netReturnExpected.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">ROI: {economics.roiPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
