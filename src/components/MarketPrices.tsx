import React, { useState, useEffect } from 'react';
import {
  SOURCED_REFERENCE_MANDI_RECORDS,
  ReferenceMandiRecord,
  marketService,
} from '../services/marketService';
import { MarketPriceItem } from '../types';
import { SUPABASE_URL } from '../lib/supabase';
import {
  TrendingUp,
  Search,
  Filter,
  MapPin,
  Calendar,
  Activity,
  ArrowUpDown,
  AlertCircle,
  RefreshCw,
  Database,
  Info,
  Sparkles,
} from 'lucide-react';

export const MarketPrices: React.FC = () => {
  // Live Data State
  const [livePrices, setLivePrices] = useState<MarketPriceItem[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveSource, setLiveSource] = useState<string>('agrosaarthi-market');
  const [liveFetchedDate, setLiveFetchedDate] = useState<string | null>(null);
  const [isRetryingLive, setIsRetryingLive] = useState(false);

  // Reference Data Filter State (Priority 1 Requirement)
  const [refCropFilter, setRefCropFilter] = useState('All');
  const [refStateFilter, setRefStateFilter] = useState('All');
  const [refDistrictFilter, setRefDistrictFilter] = useState('All');
  const [refMarketFilter, setRefMarketFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc'>('price-asc');

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
        setLivePrices([]);
        setLiveError(
          res.error ||
            'Live market data temporarily unavailable: Upstream APMC / data.gov.in feed (agrosaarthi-market) could not be reached.'
        );
        setLiveSource('agrosaarthi-market Edge Function (Offline)');
      }
    } catch (e: any) {
      setLivePrices([]);
      setLiveError(
        'Live market data temporarily unavailable: Upstream APMC / data.gov.in feed could not be reached.'
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
    if (sortOrder === 'price-asc') return a.pricePerQuintal - b.pricePerQuintal;
    return b.pricePerQuintal - a.pricePerQuintal;
  });

  const availableRefCrops = ['All', 'Tomato', 'Maize', 'Cotton', 'Chilli', 'Paddy (Rice)', 'Groundnut'];
  const availableRefStates = ['All', 'Telangana', 'India (National)', 'Andhra Pradesh', 'Maharashtra'];
  const availableRefDistricts = [
    'All',
    'Hyderabad',
    'Warangal',
    'Telangana (Statewide)',
    'National / All India',
    'Rangareddy',
    'Guntur',
  ];
  const availableRefMarkets = [
    'All',
    'Bowenpally APMC',
    'RYTHU BAZAR FALAKNUMA',
    'Warangal APMC',
    'Telangana state median',
    'India national median',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {livePrices.length > 0 && !liveError ? (
              <span className="bg-emerald-700/60 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600/50">
                Live AGMARKNET Stream: {liveSource}
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/40">
                ⚠️ Live Feed Offline: Upstream APMC Gateway Unreachable
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2 font-serif">Mandi Market Prices</h1>
          <p className="text-sm text-emerald-100/80 mt-2">
            Targeting Supabase Edge Function <code className="bg-emerald-900/80 px-1 py-0.5 rounded text-emerald-200 font-mono text-xs">agrosaarthi-market</code> with sourced benchmark reference records.
          </p>
        </div>
      </div>

      {/* Temporarily Unavailable Notice when government API fails (Priority 1 Requirement) */}
      {liveError && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-900 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl mt-0.5 shrink-0 border border-amber-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-950">
                  Live market data temporarily unavailable
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {liveError}
                </p>
              </div>
            </div>

            <button
              onClick={fetchLivePrices}
              disabled={isRetryingLive}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetryingLive ? 'animate-spin' : ''}`} />
              <span>{isRetryingLive ? 'Checking Upstream API...' : 'Retry Connection'}</span>
            </button>
          </div>

          <div className="text-[11px] text-amber-700 pt-1 border-t border-amber-200 font-mono">
            Target Endpoint: {SUPABASE_URL ? `${SUPABASE_URL.replace(/^https?:\/\//, '')}/functions/v1/agrosaarthi-market` : 'agrosaarthi-market Edge Function'}
          </div>
        </div>
      )}

      {/* Live Prices Table (Displayed if real live request succeeds) */}
      {!loadingLive && livePrices.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Live Mandi Quotes</h2>
            <span className="text-xs text-emerald-700 font-mono">Report Date: {liveFetchedDate}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2.5 px-3">Crop</th>
                  <th className="py-2.5 px-3">Mandi</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-right">Modal Price (₹/Quintal)</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {livePrices.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.cropName}</td>
                    <td className="py-2.5 px-3 text-slate-700">{item.mandiName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.district}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                      ₹{item.modalPrice.toLocaleString('en-IN')}/quintal
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clearly Labeled "Reference data for demonstration" Section (Priority 1 Requirement) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 text-blue-900 text-xs font-extrabold px-3 py-0.5 rounded-full border border-blue-300">
                📋 Reference data for demonstration
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Historical Benchmark Records
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Sourced Historical Mandi Benchmarks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified historical reference records preserved with actual dates and units. These are historical records, not live API responses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRefCropFilter('Tomato');
                setRefStateFilter('Telangana');
                setRefDistrictFilter('All');
                setRefMarketFilter('All');
              }}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Match Tomato (Telangana)
            </button>
            <button
              onClick={() => {
                setRefCropFilter('All');
                setRefStateFilter('All');
                setRefDistrictFilter('All');
                setRefMarketFilter('All');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Working crop, state, district, and market filters */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" /> Filter Reference Records:
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 px-1">Sort:</span>
              <button
                onClick={() => setSortOrder('price-asc')}
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  sortOrder === 'price-asc' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                }`}
              >
                Price ↑
              </button>
              <button
                onClick={() => setSortOrder('price-desc')}
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  sortOrder === 'price-desc' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                }`}
              >
                Price ↓
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Crop:</label>
              <select
                value={refCropFilter}
                onChange={(e) => setRefCropFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
              >
                {availableRefCrops.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">State:</label>
              <select
                value={refStateFilter}
                onChange={(e) => setRefStateFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
              >
                {availableRefStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">District:</label>
              <select
                value={refDistrictFilter}
                onChange={(e) => setRefDistrictFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
              >
                {availableRefDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Market:</label>
              <select
                value={refMarketFilter}
                onChange={(e) => setRefMarketFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
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

        {/* Reference Records Table */}
        {matchedReferenceRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                  <th className="py-2.5 px-3">Commodity Crop</th>
                  <th className="py-2.5 px-3">Market / APMC</th>
                  <th className="py-2.5 px-3">State & District</th>
                  <th className="py-2.5 px-3 text-right">Price (₹/Quintal)</th>
                  <th className="py-2.5 px-3">Report Date</th>
                  <th className="py-2.5 px-3">Reporting Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchedReferenceRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.crop}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.market}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.district}, {item.state}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800 text-sm">
                      ₹{item.pricePerQuintal.toLocaleString('en-IN')}/quintal
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.reportDate}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {item.reportingMandis ? `${item.reportingMandis} reporting mandis` : 'Single APMC Yard'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No Matching Reference Record Exists</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              No historical reference records match your selected filter criteria. AgroSaarthi does not fabricate or display unverified quotes for unrelated crops or mandis.
            </p>
          </div>
        )}

        {/* Valuation Notice (Requirement 6) */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-emerald-900">Price per Quintal Valuation Disclosure</span>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              All prices are standardized to <strong>₹/quintal</strong> (100 kg). Actual realized prices in agricultural market committees vary significantly by variety, produce grade/quality, moisture level, daily arrivals, and auction date. Reference records reflect verified historical benchmarks for demonstration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
