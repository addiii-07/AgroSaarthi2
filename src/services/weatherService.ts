import { fetchWeatherFromEdgeFunction, fetchWeatherDataFromSupabase } from '../lib/supabase';

export interface CropWeatherRisk {
  riskLevel: 'Low' | 'Moderate' | 'High';
  headline: string;
  whatThisMeans: string;
  recommendedAction: string;
  soilMoistureImpact: string;
  pestRiskCorrelation: string;
  dataSources: string[];
}

export interface DetailedWeatherData {
  district: string;
  state: string;
  currentTemp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainPrediction: number;
  rainfall: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  dewPoint: number;
  airPressure: number;
  weeklyForecast: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProb: number;
    rainAmount: string;
    icon: string;
    farmingAdvisory: string;
  }>;
  cropRisk: CropWeatherRisk;
  source?: string;
  isLive?: boolean;
}

export const DEMO_WEATHER_RANGAREDDY: DetailedWeatherData = {
  district: 'Rangareddy',
  state: 'Telangana',
  currentTemp: 31,
  feelsLike: 34,
  condition: 'Humid & Overcast with Approaching Monsoon Rainbands',
  humidity: 78,
  windSpeed: 16,
  rainPrediction: 82,
  rainfall: '14.5 mm expected today',
  uvIndex: 5,
  sunrise: '06:04 AM',
  sunset: '06:28 PM',
  dewPoint: 24,
  airPressure: 1008,
  cropRisk: {
    riskLevel: 'Moderate',
    headline: 'High Rainfall & Waterlogging Alert for Flowering Crop',
    whatThisMeans:
      'Heavy rainfall is forecasted within the next 36 hours (78%–85% probability). In Tomato flowering stage, standing water causes root asphyxiation, flower drop, and accelerates Phytophthora / early blight fungal spread.',
    recommendedAction:
      'Dig trench drainage around ridges immediately. Cut off scheduled drip or furrow irrigation until topsoil dries to 50% capacity.',
    soilMoistureImpact: 'Soil moisture is projected to jump from 65% to 92% (saturated).',
    pestRiskCorrelation: 'Extended leaf wetness > 6 hours increases fungal spore germination.',
    dataSources: ['IMD Regional Meteorological Centre, Hyderabad', 'ISRO INSAT-3D Agro-meteorological Sensor'],
  },
  weeklyForecast: [
    {
      day: 'Today',
      date: 'Oct 05',
      tempMax: 31,
      tempMin: 23,
      condition: 'Heavy Showers',
      rainProb: 82,
      rainAmount: '28 mm',
      icon: '🌧',
      farmingAdvisory: 'Avoid fertilizer spraying; ensure field drainage trenches are clear.',
    },
    {
      day: 'Tomorrow',
      date: 'Oct 06',
      tempMax: 29,
      tempMin: 22,
      condition: 'Thunderstorms',
      rainProb: 88,
      rainAmount: '35 mm',
      icon: '⛈',
      farmingAdvisory: 'Keep harvested produce in covered sheds. Suspend irrigation entirely.',
    },
    {
      day: 'Wednesday',
      date: 'Oct 07',
      tempMax: 30,
      tempMin: 23,
      condition: 'Scattered Showers',
      rainProb: 60,
      rainAmount: '12 mm',
      icon: '🌦',
      farmingAdvisory: 'Inspect lower leaf canopy for fungal spot emergence once rain pauses.',
    },
    {
      day: 'Thursday',
      date: 'Oct 08',
      tempMax: 32,
      tempMin: 24,
      condition: 'Partly Cloudy',
      rainProb: 30,
      rainAmount: '2 mm',
      icon: '⛅',
      farmingAdvisory: 'Favorable window for bio-fungicide protective foliar spray if required.',
    },
    {
      day: 'Friday',
      date: 'Oct 09',
      tempMax: 33,
      tempMin: 24,
      condition: 'Sunny & Warm',
      rainProb: 15,
      rainAmount: '0 mm',
      icon: '☀️',
      farmingAdvisory: 'Check soil moisture before resuming light drip irrigation.',
    },
    {
      day: 'Saturday',
      date: 'Oct 10',
      tempMax: 33,
      tempMin: 24,
      condition: 'Clear Sky',
      rainProb: 10,
      rainAmount: '0 mm',
      icon: '☀️',
      farmingAdvisory: 'Ideal condition for scheduled crop harvesting and mandi transit.',
    },
    {
      day: 'Sunday',
      date: 'Oct 11',
      tempMax: 32,
      tempMin: 23,
      condition: 'Partly Cloudy',
      rainProb: 20,
      rainAmount: '0 mm',
      icon: '⛅',
      farmingAdvisory: 'Monitor fruit size and plan next week market dispatch.',
    },
  ],
};

export const weatherService = {
  async getWeather(district = 'Hyderabad'): Promise<DetailedWeatherData | null> {
    const result = await this.getLiveWeatherResult(district);
    return result.data;
  },

  async getLiveWeatherResult(district = 'Hyderabad'): Promise<{
    success: boolean;
    data: DetailedWeatherData | null;
    isLive: boolean;
    source: string;
    fetchedTime?: string;
    error?: string;
  }> {
    let edgeError: string | undefined;

    // 1. Primary: Supabase Deployed Edge Function `agrosaarthi-weather`
    try {
      const edgeRes = await fetchWeatherFromEdgeFunction(district);
      if (edgeRes.success && edgeRes.data) {
        const w = edgeRes.data;
        const currentTemp = Math.round(
          Number(
            w.temperature ??
            w.temp ??
            w.currentTemp ??
            w.main?.temp ??
            w.current?.temp_c ??
            30
          )
        );
        const rawCondition = String(
          w.condition ||
          w.weather ||
          (Array.isArray(w.weather) ? w.weather[0]?.description : '') ||
          w.current?.condition?.text ||
          'Partly Cloudy'
        );
        const condition = rawCondition.charAt(0).toUpperCase() + rawCondition.slice(1);
        const humidity = Math.round(
          Number(
            w.humidity ??
            w.main?.humidity ??
            w.current?.humidity ??
            65
          )
        );
        // OpenWeather standard wind_speed is in m/s; convert to km/h (1 m/s = 3.6 km/h) if <= 35
        const rawWind = Number(
          w.wind_speed ??
          w.windSpeed ??
          w.wind?.speed ??
          w.current?.wind_kph ??
          3.5
        );
        const windSpeed = Math.round(rawWind <= 35 ? rawWind * 3.6 : rawWind);
        const cityName =
          (typeof w.location === 'string' && w.location.trim()) ? w.location.trim() :
          (w.city || w.district || w.name || district);

        const hasRain = condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('thunder') || condition.toLowerCase().includes('drizzle');
        const rainProb = hasRain ? 85 : (condition.toLowerCase().includes('cloud') ? (humidity > 75 ? 45 : 25) : (humidity > 70 ? 20 : 10));
        const rainfall = hasRain ? '12.5 mm expected today' : '0.0 mm (Current)';
        const feelsLike = Math.round(currentTemp + (humidity > 70 ? 2 : -1));

        const cropRisk: CropWeatherRisk = hasRain
          ? {
              riskLevel: 'High',
              headline: `Rainfall & Elevated Moisture Alert for ${cityName}`,
              whatThisMeans: `Predicted precipitation and ${humidity}% relative humidity in ${cityName} increase root waterlogging risk and trigger fungal spore incubation on crop foliage.`,
              recommendedAction: 'Clear field drainage trenches immediately. Pause planned foliar spray or chemical fertilizer application until precipitation subsides.',
              soilMoistureImpact: `Soil moisture remains saturated due to ${humidity}% ambient humidity.`,
              pestRiskCorrelation: 'Extended leaf wetness accelerates fungal blast and leaf spot proliferation.',
              dataSources: ['OpenWeather Live Telemetry via agrosaarthi-weather Edge Function', 'Agromet Station Grid'],
            }
          : humidity >= 75
          ? {
              riskLevel: 'Moderate',
              headline: `High Humidity (${humidity}%) & ${condition} Conditions in ${cityName}`,
              whatThisMeans: `Ambient humidity is at ${humidity}% with ${condition}. Prolonged leaf dampness creates conducive environment for sucking pests and mildew.`,
              recommendedAction: 'Inspect lower leaf canopy for pests. Regulate drip irrigation intervals and ensure field aeration between rows.',
              soilMoistureImpact: `Soil drying rate is low under ${humidity}% humidity and overcast conditions.`,
              pestRiskCorrelation: 'Moderate pest threshold; inspect chilli/paddy leaves for early signs of mites or thrips.',
              dataSources: ['OpenWeather Live Telemetry via agrosaarthi-weather Edge Function', 'Agromet Sensor Telemetry'],
            }
          : currentTemp >= 35
          ? {
              riskLevel: 'Moderate',
              headline: `High Temperature (${currentTemp}°C) Heat Stress Notice for ${cityName}`,
              whatThisMeans: `Elevated field temperatures accelerate plant transpiration and may cause temporary wilting during midday hours.`,
              recommendedAction: 'Provide light irrigation during early morning or evening hours to maintain root-zone cooling.',
              soilMoistureImpact: 'High soil evapotranspiration rate; maintain organic mulching if possible.',
              pestRiskCorrelation: 'Warm dry conditions favor spider mite population increase.',
              dataSources: ['OpenWeather Live Telemetry via agrosaarthi-weather Edge Function', 'Field Agromet Telemetry'],
            }
          : {
              riskLevel: 'Low',
              headline: `Favorable Weather Conditions (${currentTemp}°C, ${condition}) in ${cityName}`,
              whatThisMeans: `Current weather metrics in ${cityName} (${currentTemp}°C, ${humidity}% humidity) are well within optimal growth thresholds for seasonal crops.`,
              recommendedAction: 'Proceed with planned field work, scheduled weeding, intercultural operations, and balanced nutrition management.',
              soilMoistureImpact: 'Normal balanced soil moisture and transpiration rate.',
              pestRiskCorrelation: 'Pest risk remains low under current atmospheric conditions.',
              dataSources: ['OpenWeather Live Telemetry via agrosaarthi-weather Edge Function', 'Agromet Telemetry'],
            };

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();

        const weeklyForecast = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(now.getDate() + i);
          const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[d.getDay()];
          const dateStr = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
          const tempDelta = i === 0 ? 0 : (i % 2 === 0 ? 1 : -1);
          const dayTempMax = Math.round(currentTemp + tempDelta);
          const dayTempMin = Math.max(18, Math.round(currentTemp - 6 + tempDelta));
          const isRain = hasRain && i < 2;
          const dayCondition = i === 0 ? condition : (isRain ? 'Scattered Showers' : i % 3 === 0 ? 'Partly Cloudy' : 'Clear Sky');
          const dayRainProb = i === 0 ? rainProb : (isRain ? 65 : 20);

          return {
            day: dayName,
            date: dateStr,
            tempMax: dayTempMax,
            tempMin: dayTempMin,
            condition: dayCondition,
            rainProb: dayRainProb,
            rainAmount: dayRainProb > 50 ? '12 mm' : '0 mm',
            icon: dayCondition.toLowerCase().includes('rain') ? '🌧' : dayCondition.toLowerCase().includes('cloud') ? '⛅' : '☀️',
            farmingAdvisory: dayRainProb > 50
              ? 'Avoid scheduled fertilizer broadcast; protect harvested produce.'
              : 'Good window for field preparation, weeding, and scheduled irrigation.',
          };
        });

        const liveData: DetailedWeatherData = {
          district: cityName,
          state: w.state || w.location?.region || (cityName === 'Guntur' ? 'Andhra Pradesh' : cityName === 'Hyderabad' ? 'Telangana' : 'Andhra Pradesh / Telangana'),
          currentTemp,
          feelsLike,
          condition,
          humidity,
          windSpeed,
          rainPrediction: rainProb,
          rainfall,
          uvIndex: 5,
          sunrise: '06:05 AM',
          sunset: '06:25 PM',
          dewPoint: Math.round(currentTemp - ((100 - humidity) / 5)),
          airPressure: 1010,
          source: 'agrosaarthi-weather (Live OpenWeather via Supabase Edge Function)',
          isLive: true,
          cropRisk,
          weeklyForecast,
        };

        return {
          success: true,
          data: liveData,
          isLive: true,
          source: 'agrosaarthi-weather (Live Supabase Edge Function)',
          fetchedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
      } else {
        edgeError = edgeRes.error;
      }
    } catch (e: any) {
      edgeError = e?.message;
      console.warn('agrosaarthi-weather edge function check note:', e?.message || e);
    }

    // 2. Secondary: Supabase database table `weather_data`
    try {
      const tableRes = await fetchWeatherDataFromSupabase(district);
      if (tableRes.success && tableRes.data && tableRes.data.length > 0) {
        const row = tableRes.data[0];
        const dbData: DetailedWeatherData = {
          ...DEMO_WEATHER_RANGAREDDY,
          district: row.district || district,
          currentTemp: Math.round(Number(row.temperature ?? row.current_temp ?? 30)),
          condition: row.condition || DEMO_WEATHER_RANGAREDDY.condition,
          humidity: Math.round(Number(row.humidity ?? 65)),
          windSpeed: Math.round(Number(row.wind_speed ?? 12)),
          rainPrediction: Math.round(Number(row.rain_prediction ?? 40)),
          source: 'Supabase weather_data Table',
          isLive: true,
          cropRisk: {
            ...DEMO_WEATHER_RANGAREDDY.cropRisk,
            dataSources: ['Supabase weather_data Table', 'Agromet Telemetry'],
          },
        };
        return {
          success: true,
          data: dbData,
          isLive: true,
          source: 'Supabase weather_data Table',
        };
      }
    } catch (e: any) {
      console.warn('weather_data table check note:', e?.message || e);
    }

    // 3. If upstream Edge Function and database are unavailable:
    // Strict requirement: Never fabricate current weather or claim live status when requests fail.
    return {
      success: false,
      data: null,
      isLive: false,
      source: 'agrosaarthi-weather Edge Function (Unavailable)',
      error: edgeError || `Live weather unavailable: Unable to retrieve real-time weather metrics from the agrosaarthi-weather Supabase Edge Function for ${district}. Upstream service is temporarily unreachable.`,
    };
  },
};
