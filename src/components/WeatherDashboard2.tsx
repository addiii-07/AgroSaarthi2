import React, { useState, useEffect } from 'react';
import { weatherService, DetailedWeatherData } from '../services/weatherService';
import { User } from '../types';
import { SUPABASE_URL } from '../lib/supabase';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  Compass,
  Sunrise,
  Sunset,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  MapPin,
  Clock,
  Search,
} from 'lucide-react';

const CITIES_LIST = [
  'Rangareddy',
  'Hyderabad',
  'Warangal',
  'Guntur',
  'Nizamabad',
  'Kurnool',
  'Vijayawada',
  'Khammam',
  'Karimnagar',
  'East Godavari',
];

interface WeatherDashboard2Props {
  user?: User | null;
  initialDistrict?: string;
  onNavigate?: (tab: string) => void;
}

export const WeatherDashboard2: React.FC<WeatherDashboard2Props> = ({
  user,
  initialDistrict,
  onNavigate,
}) => {
  // Request weather for the farmer's selected location, not a hardcoded city
  const farmerDefaultLocation =
    user?.district || user?.villageMandal || initialDistrict || 'Rangareddy';

  const [district, setDistrict] = useState(farmerDefaultLocation);
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [weather, setWeather] = useState<DetailedWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fetchedTime, setFetchedTime] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchWeather = (cityToFetch: string) => {
    setLoading(true);
    setIsRetrying(true);
    setErrorMsg(null);

    // Call Supabase Edge Function agrosaarthi-weather via weatherService
    weatherService
      .getLiveWeatherResult(cityToFetch)
      .then((res) => {
        if (res.success && res.data) {
          setWeather(res.data);
          setFetchedTime(
            res.fetchedTime ||
              new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
          );
          setErrorMsg(null);
        } else {
          // If the request fails, never fabricate weather; set weather to null
          setWeather(null);
          setFetchedTime(null);
          setErrorMsg(
            res.error ||
              `Live weather unavailable: Unable to retrieve real-time weather metrics from the agrosaarthi-weather Supabase Edge Function for ${cityToFetch}.`
          );
        }
      })
      .catch((err) => {
        setWeather(null);
        setFetchedTime(null);
        setErrorMsg(
          err?.message ||
            `Live weather unavailable: Connection error reaching agrosaarthi-weather Supabase Edge Function for ${cityToFetch}.`
        );
      })
      .finally(() => {
        setLoading(false);
        setIsRetrying(false);
      });
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocationInput.trim()) {
      setDistrict(customLocationInput.trim());
      setCustomLocationInput('');
    }
  };

  // 1. Loading State
  if (loading && !weather && !errorMsg) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-emerald-100 max-w-5xl mx-auto shadow-sm">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-800">Connecting to agrosaarthi-weather Edge Function...</p>
        <p className="text-xs text-slate-500 mt-1">
          Requesting live meteorological telemetry for <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-bold">{district}</code>
        </p>
        <p className="text-[11px] text-slate-400 mt-2 font-mono">
          Endpoint: {SUPABASE_URL ? `${SUPABASE_URL.replace(/^https?:\/\//, '')}/functions/v1/agrosaarthi-weather?city=${encodeURIComponent(district)}` : 'agrosaarthi-weather Edge Function'}
        </p>
      </div>
    );
  }

  // 2. Clear "Live weather unavailable" error state (Priority 2 Requirement)
  if (!weather) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header Strip */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                <CloudRain className="w-4 h-4 text-slate-600" />
              </span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Agricultural Weather Telemetry
              </span>
              <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                ⚠️ Live Feed Offline
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Weather & Crop Risk Telemetry
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Field meteorological telemetry for farmer planning • Location: <span className="font-semibold text-slate-800">{district}</span>
            </p>
          </div>

          {/* Quick Location Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <MapPin className="w-4 h-4 text-slate-500 ml-1" />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {user?.district && !CITIES_LIST.includes(user.district) && (
                <option value={user.district}>Farm: {user.district}</option>
              )}
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dedicated Live Weather Unavailable Card */}
        <div className="bg-rose-50/70 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 text-rose-950 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-rose-200">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl mt-0.5 shrink-0 border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 block">
                  Telemetric Connection Status
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-rose-950 font-serif">
                  Live weather unavailable
                </h2>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  {errorMsg || `Unable to retrieve live weather telemetry for "${district}" from the agrosaarthi-weather Supabase Edge Function.`}
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchWeather(district)}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-60 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying Connection...' : 'Retry Live Weather'}</span>
            </button>
          </div>

          {/* Diagnostic Context & Location details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white/80 p-4 rounded-2xl border border-rose-200/80 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Requested Location:</span>
              <p className="text-slate-700">
                <span className="font-semibold">{district}</span>
                {user?.state ? ` (${user.state})` : ''}
                {user?.villageMandal ? ` • Village/Mandal: ${user.villageMandal}` : ''}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Function URL: {SUPABASE_URL ? `${SUPABASE_URL.replace(/^https?:\/\//, '')}/functions/v1/agrosaarthi-weather?city=${encodeURIComponent(district)}` : 'agrosaarthi-weather Edge Function'}
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-rose-200/80 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Data Integrity Standard:</span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                AgroSaarthi strictly complies with data integrity guidelines: when upstream telemetry from the deployed Supabase Edge Function is unreachable, simulated or fabricated weather values are never shown as live readings.
              </p>
            </div>
          </div>

          {/* Test other district or enter custom city */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              Try querying another agricultural region or custom city:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {['Hyderabad', 'Rangareddy', 'Warangal', 'Guntur', 'Nizamabad'].map((c) => (
                <button
                  key={c}
                  onClick={() => setDistrict(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    district === c
                      ? 'bg-rose-700 text-white border-rose-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}

              <form onSubmit={handleCustomLocationSubmit} className="flex items-center gap-1.5 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                <input
                  type="text"
                  placeholder="Enter custom district/city..."
                  value={customLocationInput}
                  onChange={(e) => setCustomLocationInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Query
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Live Weather Successfully Fetched View
  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* 1. Header Banner with City Selector & Live Source Badge */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <CloudRain className="w-4 h-4 text-blue-700" />
            </span>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Agricultural Weather & Rainfall Telemetry
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ⚡ {weather.source || 'agrosaarthi-weather Edge Function'}
            </span>
            {fetchedTime && (
              <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> Fetched: {fetchedTime}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Weather & Crop Risk Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Translating meteorological forecasts directly into field-level farming decisions for <span className="font-semibold text-slate-800">{weather.district}</span>.
          </p>
        </div>

        {/* City Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <label className="text-[11px] font-bold text-slate-600 pl-1">City / Region:</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {user?.district && !CITIES_LIST.includes(user.district) && (
              <option value={user.district}>Farm: {user.district}</option>
            )}
            {CITIES_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchWeather(district)}
            title="Refresh Live Weather"
            disabled={loading}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Crop Weather Risk Hero Banner */}
      {weather.cropRisk && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-200 text-amber-900 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-800" />
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                  CROP WEATHER RISK ASSESSMENT
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-serif">
                  {weather.cropRisk.headline}
                </h2>
              </div>
            </div>

            <span className="bg-amber-600 text-white font-extrabold text-xs px-3.5 py-1 rounded-full self-start sm:self-auto shadow-sm">
              ⚠️ {weather.cropRisk.riskLevel.toUpperCase()} RISK
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-200/80 space-y-1.5">
              <span className="font-extrabold text-slate-900 text-xs block">What this means:</span>
              <p className="text-slate-700 leading-relaxed">{weather.cropRisk.whatThisMeans}</p>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
              <span className="font-extrabold text-emerald-950 text-xs block">Recommended Action:</span>
              <p className="text-emerald-900 leading-relaxed font-medium">{weather.cropRisk.recommendedAction}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white/60 rounded-xl border border-amber-200/60">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Soil Moisture Impact</span>
              <span className="text-slate-800 font-medium">{weather.cropRisk.soilMoistureImpact}</span>
            </div>
            <div className="p-3 bg-white/60 rounded-xl border border-amber-200/60">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Pest & Fungal Correlation</span>
              <span className="text-slate-800 font-medium">{weather.cropRisk.pestRiskCorrelation}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Live Weather Parameters Grid (Temperature, Condition, Humidity, Wind, Rainfall, Location, Fetched Time) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Temp */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Temp</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono my-0.5">{weather.currentTemp}°C</div>
          <span className="text-[10px] text-slate-500">Feels like {weather.feelsLike}°C</span>
        </div>

        {/* Condition */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Condition</span>
          <div className="text-sm font-extrabold text-slate-900 my-1 truncate">{weather.condition}</div>
          <span className="text-[10px] text-slate-500 font-mono">{weather.district}</span>
        </div>

        {/* Rainfall / Rain Prob */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200 text-center bg-blue-50/20">
          <span className="text-[10px] text-blue-800 font-bold uppercase block">Rainfall / Prob</span>
          <div className="text-2xl font-extrabold text-blue-800 font-mono my-0.5">{weather.rainPrediction}%</div>
          <span className="text-[10px] text-blue-700 font-medium">{weather.rainfall || 'Precipitation'}</span>
        </div>

        {/* Humidity */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Humidity</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono my-0.5">{weather.humidity}%</div>
          <span className="text-[10px] text-amber-700 font-semibold">Moisture metric</span>
        </div>

        {/* Wind */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Wind Speed</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono my-0.5">{weather.windSpeed} <span className="text-xs">km/h</span></div>
          <span className="text-[10px] text-slate-500">Surface velocity</span>
        </div>

        {/* Location & Fetched Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Telemetry Time</span>
          <div className="text-xs font-mono font-bold text-slate-800 mt-1">{fetchedTime || 'Live'}</div>
          <div className="text-[10px] text-slate-500 font-mono truncate">{weather.district}</div>
        </div>
      </div>

      {/* 4. 7-Day Farm-Oriented Weather Forecast */}
      {weather.weeklyForecast && weather.weeklyForecast.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">7-Day Farming Weather Forecast</h2>
              <p className="text-xs text-slate-500">Tailored with day-by-day agricultural action guidelines</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-3 py-1 rounded-xl">
              IMD Radar Stream
            </span>
          </div>

          <div className="space-y-3">
            {weather.weeklyForecast.map((day, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                  day.rainProb >= 70
                    ? 'bg-blue-50/40 border-blue-200'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-[150px]">
                  <span className="text-2xl">{day.icon}</span>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">{day.day}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{day.date} • {day.condition}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 min-w-[170px]">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Precipitation</span>
                    <span className={`font-mono font-bold ${day.rainProb > 50 ? 'text-blue-700' : 'text-slate-700'}`}>
                      {day.rainProb}% ({day.rainAmount})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Temperature</span>
                    <span className="font-mono font-bold text-slate-800">
                      {day.tempMax}° / {day.tempMin}°C
                    </span>
                  </div>
                </div>

                <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium">
                  <span className="text-emerald-800 font-bold block text-[10px] uppercase">Agronomic Guidance:</span>
                  {day.farmingAdvisory}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
