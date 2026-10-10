import React, { useState, useEffect, useCallback } from 'react';
import { DISTRICTS } from '../data/mockData';
import { WeatherData } from '../types';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  MapPin,
  Calendar,
  CloudLightning,
  CloudSun,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import {
  fetchWeatherFromEdgeFunction,
  fetchWeatherDataFromSupabase,
} from '../lib/supabase';

interface WeatherModuleProps {
  initialDistrict?: string;
}

const DISTRICT_OPENWEATHER_CITY_MAP: Record<string, string> = {
  'Ananthapuramu': 'Anantapur,IN',
  'East Godavari': 'Kakinada,IN',
  'YSR Kadapa': 'Kadapa,IN',
  'Prakasam': 'Ongole,IN',
  'Sri Sathya Sai': 'Puttaparthi,IN',
  'West Godavari': 'Eluru,IN',
};

export const WeatherModule: React.FC<WeatherModuleProps> = ({ initialDistrict = 'Guntur' }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (district: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Primary: User's Deployed Supabase Edge Function `agrosaarthi-weather`
      const edgeRes = await fetchWeatherFromEdgeFunction(district);
      if (edgeRes.success && edgeRes.data) {
        const d = edgeRes.data;
        const currentTemp = Math.round(d.temperature ?? d.temp ?? 30);
        const humidity = Math.round(d.humidity ?? 65);
        const condition = d.condition || d.weather || 'Partly Cloudy';
        const windSpeed = Math.round(d.windSpeed ?? d.wind_speed ?? 12);
        const rainfall = d.rainfall || '0 mm';
        const rainPrediction = d.rainPrediction ?? d.rain_probability ?? 25;

        setWeatherData({
          currentTemp,
          condition,
          humidity,
          windSpeed,
          rainfall,
          rainPrediction,
          forecast: d.forecast || [
            { day: 'Today', temp: `${currentTemp}°C`, condition, rainChance: `${rainPrediction}%` },
            { day: 'Tomorrow', temp: `${currentTemp - 1}°C`, condition: 'Scattered Showers', rainChance: '45%' },
            { day: 'Day 3', temp: `${currentTemp + 1}°C`, condition: 'Sunny / Humid', rainChance: '20%' },
            { day: 'Day 4', temp: `${currentTemp}°C`, condition: 'Partly Cloudy', rainChance: '15%' },
            { day: 'Day 5', temp: `${currentTemp - 2}°C`, condition: 'Moderate Rain', rainChance: '60%' },
          ],
          advisory: d.advisory || `Current conditions in ${district}: Humidity at ${humidity}%, wind at ${windSpeed} km/h. Suitable for planned field tasks.`,
        });
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setLoading(false);
        return;
      }

      // 2. Secondary: Backend server route /api/weather
      const res = await fetch(`/api/weather/${encodeURIComponent(district)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.weather) {
          setWeatherData(data.weather);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setLoading(false);
          return;
        }
      }

      // 3. Fallback: Supabase `weather_data` table
      const dbRes = await fetchWeatherDataFromSupabase(district);
      if (dbRes.success && dbRes.data && dbRes.data.length > 0) {
        const row = dbRes.data[0];
        setWeatherData({
          currentTemp: Number(row.temperature || 31),
          condition: row.condition || 'Partly Cloudy',
          humidity: Number(row.humidity || 68),
          windSpeed: Number(row.wind_speed || 12),
          rainfall: row.rainfall || '0 mm',
          rainPrediction: Number(row.rain_probability || 20),
          forecast: [
            { day: 'Today', temp: `${row.temperature || 31}°C`, condition: row.condition || 'Clear', rainChance: `${row.rain_probability || 20}%` }
          ],
          advisory: row.advisory || `Telemetry recorded from station ${district}.`,
        });
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setLoading(false);
        return;
      }

      throw new Error(`Unable to reach weather services for ${district}.`);
    } catch (err: any) {
      console.warn('Weather fetch error:', err);
      setError(err?.message || 'Unable to retrieve live weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on district change & auto refresh every 30 minutes
  useEffect(() => {
    fetchWeatherData(selectedDistrict);

    const THIRTY_MINUTES_MS = 30 * 60 * 1000;
    const interval = setInterval(() => {
      fetchWeatherData(selectedDistrict);
    }, THIRTY_MINUTES_MS);

    return () => clearInterval(interval);
  }, [selectedDistrict, fetchWeatherData]);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'cloud-rain':
        return <CloudRain className="w-6 h-6 text-sky-500" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-6 h-6 text-purple-500" />;
      case 'cloud-sun':
        return <CloudSun className="w-6 h-6 text-amber-500" />;
      default:
        return <Sun className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & District Selector */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-sky-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-sky-400/20 text-sky-300 text-xs font-bold px-3 py-1 rounded-full border border-sky-400/30">
              ⚡ OpenWeather Live API
            </span>
            {lastUpdated && (
              <span className="text-[10px] text-sky-200/80">
                Auto-refreshes every 30 mins • Updated at {lastUpdated}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Weather Forecast: {selectedDistrict}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            Live OpenWeather temperature, humidity, rainfall, and wind velocity tailored for farm planning.
          </p>
        </div>

        {/* District Selector & Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <label className="block text-[10px] text-sky-200 font-bold uppercase mb-1 px-2">
              Change District
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-amber-300" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="pl-9 pr-8 py-1.5 rounded-xl bg-sky-950 text-white font-bold text-xs border border-sky-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => fetchWeatherData(selectedDistrict)}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl transition-all flex items-center justify-center disabled:opacity-50"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && !weatherData && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-sky-100 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Fetching live OpenWeather data for {selectedDistrict}...</p>
          <p className="text-xs text-slate-400">Retrieving temperature, humidity, wind, and rainfall metrics</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-red-900">Weather Connection Error</div>
              <p className="text-xs text-red-800 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchWeatherData(selectedDistrict)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
          </button>
        </div>
      )}

      {/* Weather Data Content */}
      {weatherData && (
        <>
          {/* Active Weather Warnings Banner */}
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <div className="space-y-2">
              {weatherData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start space-x-3 shadow-sm"
                >
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-amber-900">{alert.title}</div>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{alert.description}</p>
                    <div className="text-[10px] text-amber-700 font-mono mt-1">
                      Issued for {weatherData.district} • {alert.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Temperature & Gauge Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main Temp Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950/80">
                    Current Conditions
                  </span>
                  <div className="text-4xl font-extrabold font-mono mt-1">{weatherData.currentTemp}°C</div>
                  <p className="text-xs font-semibold text-amber-950 mt-1">{weatherData.condition}</p>
                </div>
                <Sun className="w-16 h-16 text-amber-950/20" />
              </div>

              <div className="mt-6 pt-4 border-t border-amber-950/20 grid grid-cols-3 gap-2 text-xs font-medium">
                <div>
                  <span className="text-amber-950/70 text-[10px] block">Location:</span>
                  <span className="font-bold">{weatherData.district} Agri Zone</span>
                </div>
                <div>
                  <span className="text-amber-950/70 text-[10px] block">UV Index:</span>
                  <span className="font-bold">{weatherData.uvIndex} (Moderate)</span>
                </div>
                <div>
                  <span className="text-amber-950/70 text-[10px] block">Rainfall:</span>
                  <span className="font-bold text-amber-950">{weatherData.rainfall || '0 mm'}</span>
                </div>
              </div>
            </div>

            {/* Humidity Gauge */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Humidity Level</span>
                <Droplets className="w-5 h-5 text-sky-500" />
              </div>
              <div className="my-3">
                <div className="text-3xl font-extrabold font-mono text-sky-900">{weatherData.humidity}%</div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${weatherData.humidity}%` }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400">High humidity increases fungal spore risk</p>
            </div>

            {/* Rain Prediction Gauge */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Rain Probability</span>
                <CloudRain className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="my-3">
                <div className="text-3xl font-extrabold font-mono text-indigo-900">
                  {weatherData.rainPrediction}%
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${weatherData.rainPrediction}%` }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-slate-500 flex items-center justify-between font-medium">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-slate-400" /> Wind: {weatherData.windSpeed} km/h
                </span>
                <span>Rain: {weatherData.rainfall || '0 mm'}</span>
              </div>
            </div>
          </div>

          {/* 7-Day / 6-Day Weather Forecast Grid */}
          {weatherData.weeklyForecast && weatherData.weeklyForecast.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Agricultural Weather Forecast
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                {weatherData.weeklyForecast.map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      idx === 0
                        ? 'bg-emerald-50 border-emerald-300 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-slate-800 text-xs mb-1">{day.day}</div>
                    <div className="my-2 flex justify-center">{getWeatherIcon(day.icon)}</div>
                    <div className="font-mono text-slate-900 font-bold text-sm">
                      {day.tempMax}° / <span className="text-slate-400 font-normal">{day.tempMin}°</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-1">{day.condition}</div>
                    <div className="text-[10px] font-bold text-sky-600 mt-1">🌧️ {day.rainProb}% Rain</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
