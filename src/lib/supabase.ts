import { createClient } from '@supabase/supabase-js';

// AgroSaarthi Supabase Configuration
const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
export const SUPABASE_URL = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/, '') : '';

export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const SUPABASE_PUBLISHABLE_KEY = SUPABASE_ANON_KEY;
export const SUPABASE_FUNCTIONS_BASE = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : '';

// Single reusable Supabase client instance using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export interface FarmerProfileRecord {
  id?: string;
  name?: string;
  phone?: string;
  language?: string;
  state?: string;
  district?: string;
  village?: string;
  crop?: string;
  crop_variety?: string;
  farm_size?: number | string | null;
  sowing_date?: string;
  irrigation_type?: string;
  soil_type?: string;
  growth_stage?: string;
  preferred_market?: string;
  created_at?: string;
  preferred_language?: string;
}

export function parseFarmSize(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  if (typeof val === 'string') {
    const match = val.match(/([0-9]+(?:\.[0-9]+)?)/);
    if (match) {
      const num = parseFloat(match[1]);
      return isNaN(num) ? null : num;
    }
  }
  return null;
}

/**
 * 1. Health check integration via deployed Edge Function `agrosaarthi-health`
 */
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  status: string;
  data?: any;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${SUPABASE_FUNCTIONS_BASE}/agrosaarthi-health`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json().catch(() => ({ status: 'ok' }));
      return { connected: true, status: 'ok', data };
    }

    return {
      connected: false,
      status: `HTTP ${res.status}`,
      error: `Health check returned HTTP ${res.status}`,
    };
  } catch (err: any) {
    return {
      connected: false,
      status: 'unreachable',
      error: err?.message || 'Failed to reach agrosaarthi-health Edge Function',
    };
  }
}

/**
 * 2. Weather integration via deployed Edge Function `agrosaarthi-weather`
 * Accepts POST request with JSON payload `{ city: string }`
 */
export async function fetchWeatherFromEdgeFunction(city: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}> {
  const targetCity = (city || 'Hyderabad').trim();
  if (!targetCity) {
    return {
      success: false,
      error: 'Please specify a valid city or district name.',
    };
  }

  // 1. Invoke via Supabase Functions client SDK
  try {
    const { data, error } = await supabase.functions.invoke('agrosaarthi-weather', {
      body: { city: targetCity },
    });

    if (!error && data) {
      return { success: true, data, status: 200 };
    }

    if (error) {
      let status = 500;
      let rawErrorMsg = error.message || '';

      if ((error as any).context && typeof (error as any).context.json === 'function') {
        try {
          const resp = (error as any).context;
          if (resp.status) status = resp.status;
          const bodyJson = await resp.json();
          if (bodyJson?.error) {
            rawErrorMsg = String(bodyJson.error);
          }
        } catch {}
      }

      const lowerErr = rawErrorMsg.toLowerCase();
      if (lowerErr.includes('city not found') || lowerErr.includes('not found') || status === 404) {
        return {
          success: false,
          status,
          error: `Location "${targetCity}" not found. Please verify the spelling or select a nearby district.`,
        };
      }
      if (lowerErr.includes('unauthorized') || lowerErr.includes('invalid api key') || status === 401) {
        return {
          success: false,
          status,
          error: 'Weather service authentication error: OpenWeather API key is invalid or unauthorized.',
        };
      }
      if (lowerErr.includes('rate limit') || status === 429) {
        return {
          success: false,
          status,
          error: 'Weather service query rate limit reached. Please wait a moment and try again.',
        };
      }

      return {
        success: false,
        status,
        error: `agrosaarthi-weather error: ${rawErrorMsg.replace(/^Error:\s*/, '')}`,
      };
    }
  } catch (sdkErr: any) {
    console.warn('Supabase SDK invoke notice, falling back to direct POST:', sdkErr?.message);
  }

  // 2. Direct fallback POST fetch to Supabase Edge Function URL
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const url = `${SUPABASE_FUNCTIONS_BASE}/agrosaarthi-weather`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ city: targetCity }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { success: true, data, status: res.status };
    }

    let errorDetail = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson?.error) {
        errorDetail = String(errJson.error);
      }
    } catch {}

    const lowerDetail = errorDetail.toLowerCase();
    if (lowerDetail.includes('city not found') || lowerDetail.includes('not found') || res.status === 404) {
      return {
        success: false,
        status: res.status,
        error: `Location "${targetCity}" not found. Please verify the spelling or select a nearby district.`,
      };
    }

    return {
      success: false,
      status: res.status,
      error: `agrosaarthi-weather returned ${errorDetail.replace(/^Error:\s*/, '')}`,
    };
  } catch (err: any) {
    const isTimeout = err?.name === 'AbortError' || err?.message?.includes('abort');
    return {
      success: false,
      error: isTimeout
        ? `Weather request timed out after 8 seconds for ${targetCity}.`
        : (err?.message || 'Failed to reach agrosaarthi-weather function'),
    };
  }
}

/**
 * 3. Market-price integration via deployed Edge Function `agrosaarthi-market`
 * Shows actual returned market records or clear failure message if data.gov.in is unavailable.
 */
export async function fetchMarketPricesFromEdgeFunction(crop?: string, district?: string): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
  source?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    let url = `${SUPABASE_FUNCTIONS_BASE}/agrosaarthi-market`;
    const params: string[] = [];
    if (crop && crop !== 'All') params.push(`crop=${encodeURIComponent(crop)}`);
    if (district && district !== 'All') params.push(`district=${encodeURIComponent(district)}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const records = Array.isArray(json) ? json : json.data || json.records || json.marketPrices || [];
      return { success: true, data: records, source: 'agrosaarthi-market (Live Edge Function)' };
    }

    return {
      success: false,
      error: `Live mandi prices temporarily unavailable from government data API (HTTP ${res.status}).`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Live mandi prices temporarily unavailable from government data API.',
    };
  }
}

export function toValidUUID(val: any): string | null {
  if (typeof val !== 'string') return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(val) ? val : null;
}

export function mapSupabaseFarmToDetails(row: any, userId: string) {
  return {
    id: row.id || `farm-${userId}`,
    userId: row.farmer_id || userId,
    landArea: Number(row.area_acres || row.land_area || row.landArea || 2.0),
    landUnit: row.land_unit || 'Acres',
    soilType: row.soil_type || row.soilType || 'Black Soil',
    irrigationType: row.irrigation || row.irrigation_type || row.irrigationType || 'Drip',
    cropSeason: row.crop_season || row.cropSeason || 'Kharif',
    previousCrop: row.previous_crop || row.previousCrop || 'Paddy (Rice)',
    farmLocation: {
      address: row.name || row.location || row.address || 'Main Agricultural Plot',
      latitude: row.latitude,
      longitude: row.longitude,
    },
    farmImages: Array.isArray(row.images) ? row.images : Array.isArray(row.farm_images) ? row.farm_images : [],
    updatedAt: row.sowing_date || row.updated_at || row.updatedAt || new Date().toISOString().split('T')[0],
  };
}

/**
 * 4. Database tables: `farmers` table integration
 * Queries the `farmers` table respecting authenticated user UUID & RLS.
 */
export async function fetchFarmerProfileFromSupabase(userId?: string) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentAuthId = authData?.user?.id || (toValidUUID(userId) ? userId : undefined);

    let query = supabase.from('farmers').select('*');
    if (currentAuthId) {
      query = query.eq('id', currentAuthId);
    } else if (userId) {
      query = query.eq('id', userId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
      return { success: false, error: error.message, data: null };
    }

    if (data && data.length > 0) {
      const targetId = data[0].id || currentAuthId || userId;
      let farmRow: any = null;
      if (targetId) {
        const { data: farms } = await supabase
          .from('farms')
          .select('*')
          .eq('farmer_id', targetId)
          .limit(1);
        if (farms && farms.length > 0) {
          farmRow = farms[0];
        }
      }
      return { success: true, data: mapFarmerRow(data[0], farmRow) };
    }

    return { success: true, data: null };
  } catch (err: any) {
    return { success: false, error: err?.message, data: null };
  }
}

function mapFarmerRow(row: any, farmRow?: any) {
  return {
    id: row.id || '',
    name: row.full_name || row.name || 'Farmer',
    fullName: row.full_name || row.name || 'Farmer',
    phone: row.phone || row.mobile || '',
    mobile: row.phone || row.mobile || '',
    language: row.language || row.preferred_language || 'en',
    preferredLanguage: row.language || row.preferred_language || 'en',
    state: row.state || 'Telangana',
    district: row.district || '',
    village: row.village || row.village_mandal || '',
    villageMandal: row.village || row.village_mandal || '',
    crop: farmRow?.crop || row.crop || row.primaryCrop || '',
    primaryCrop: farmRow?.crop || row.crop || row.primaryCrop || '',
    crop_variety: farmRow?.crop_variety || row.crop_variety || row.variety || '',
    cropVariety: farmRow?.crop_variety || row.crop_variety || row.variety || '',
    farm_size: farmRow?.area_acres != null ? `${farmRow.area_acres} Acres` : row.farm_size != null ? `${row.farm_size} Acres` : '',
    farmSize: farmRow?.area_acres != null ? `${farmRow.area_acres} Acres` : row.farm_size != null ? `${row.farm_size} Acres` : '',
    sowing_date: farmRow?.sowing_date || row.sowing_date || '',
    sowingDate: farmRow?.sowing_date || row.sowing_date || '',
    irrigation_type: farmRow?.irrigation || row.irrigation_type || '',
    irrigationType: farmRow?.irrigation || row.irrigation_type || '',
    soil_type: farmRow?.soil_type || row.soil_type || '',
    soilType: farmRow?.soil_type || row.soil_type || '',
    growth_stage: row.growth_stage || '',
    growthStage: row.growth_stage || '',
    preferred_market: row.preferred_market || '',
    preferredMarket: row.preferred_market || '',
    created_at: row.created_at || new Date().toISOString().split('T')[0],
    createdAt: row.created_at || new Date().toISOString().split('T')[0],
  };
}

/**
 * Save / Update farmer record in `farmers` table:
 * farmers(id, full_name, phone, state, district, village, language)
 */
export async function saveFarmerToSupabase(farmer: {
  id?: string;
  full_name?: string;
  name?: string;
  phone?: string;
  mobile?: string;
  state?: string;
  district?: string;
  village?: string;
  villageMandal?: string;
  language?: string;
  [key: string]: any;
}) {
  try {
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      console.error('saveFarmerToSupabase auth error:', authErr);
      return { success: false, error: authErr?.message || 'User is not authenticated', data: null };
    }

    const farmerDataToSave = {
      id: user.id,
      full_name: farmer.full_name || farmer.name || '',
      phone: farmer.phone || farmer.mobile || '',
      state: farmer.state || 'Telangana',
      district: farmer.district || '',
      village: farmer.village || farmer.villageMandal || '',
      language: farmer.language || 'en',
    };

    console.log('saveFarmerToSupabase: upserting into farmers table:', farmerDataToSave);

    const { data, error } = await supabase
      .from('farmers')
      .upsert(farmerDataToSave)
      .select();

    if (error) {
      console.error('Supabase farmers upsert error:', error.message);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('saveFarmerToSupabase exception:', err);
    return { success: false, error: err?.message || 'Failed to sync with Supabase', data: null };
  }
}

/**
 * 5. `farms` table integration:
 * farms(id, farmer_id, name, crop, area_acres, soil_type, irrigation, sowing_date)
 */
export async function fetchFarmsFromSupabase(farmerId?: string) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const effectiveId = authData?.user?.id || (toValidUUID(farmerId) ? farmerId : undefined);

    if (!effectiveId) {
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('farmer_id', effectiveId)
      .order('id', { ascending: false });

    if (error) {
      console.error('fetchFarmsFromSupabase error:', error);
      return { success: false, error: error.message, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error('fetchFarmsFromSupabase exception:', err);
    return { success: false, error: err?.message, data: [] };
  }
}

/**
 * Save farm record in `farms` table:
 * farms(farmer_id, name, crop, crop_variety, area_acres, soil_type, irrigation, crop_season, previous_crop, sowing_date, address)
 */
export async function saveFarmToSupabase(farm: {
  name?: string;
  crop?: string;
  crop_variety?: string;
  cropVariety?: string;
  area_acres?: number | string;
  landArea?: number | string;
  soil_type?: string;
  soilType?: string;
  irrigation?: string;
  irrigationType?: string;
  crop_season?: string;
  cropSeason?: string;
  previous_crop?: string;
  previousCrop?: string;
  sowing_date?: string;
  sowingDate?: string;
  address?: string;
  [key: string]: any;
}) {
  try {
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      console.error('saveFarmToSupabase auth error:', authErr);
      return { success: false, error: authErr?.message || 'User is not authenticated. Please log in first.', data: null };
    }

    const rawSowing = farm.sowing_date || farm.sowingDate || new Date().toISOString().split('T')[0];
    const formattedSowingDate = rawSowing ? rawSowing.split('T')[0] : new Date().toISOString().split('T')[0];

    const farmPayload = {
      farmer_id: user.id,
      name: (farm.name || 'Main Farm Plot').trim(),
      crop: (farm.crop || '').trim(),
      crop_variety: (farm.crop_variety || farm.cropVariety || '').trim(),
      area_acres: Number(farm.area_acres != null ? farm.area_acres : farm.landArea) || 0,
      soil_type: farm.soil_type || farm.soilType || 'Black Soil',
      irrigation: farm.irrigation || farm.irrigationType || 'Drip',
      crop_season: farm.crop_season || farm.cropSeason || 'Kharif',
      previous_crop: (farm.previous_crop || farm.previousCrop || '').trim(),
      sowing_date: formattedSowingDate,
      address: (farm.address || '').trim(),
    };

    console.log('saveFarmToSupabase payload:', farmPayload);

    const { data, error } = await supabase
      .from('farms')
      .insert(farmPayload)
      .select();

    if (error) {
      console.error('Supabase farms insert error:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('saveFarmToSupabase exception:', err);
    return { success: false, error: err?.message || 'Failed to save farm to Supabase', data: null };
  }
}

/**
 * 6. `weather_data` table integration
 */
export async function fetchWeatherDataFromSupabase(district?: string) {
  try {
    let query = supabase.from('weather_data').select('*');
    if (district) query = query.ilike('district', `%${district}%`);
    const { data, error } = await query.order('created_at', { ascending: false }).limit(10);
    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

/**
 * 7. `market_prices` table integration
 */
export async function fetchMarketPricesFromSupabase(crop?: string, district?: string) {
  try {
    let query = supabase.from('market_prices').select('*');
    if (crop && crop !== 'All') query = query.ilike('crop', `%${crop}%`);
    if (district && district !== 'All') query = query.ilike('district', `%${district}%`);
    const { data, error } = await query.limit(50);
    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

/**
 * 8. `recommendations` table integration
 */
export async function fetchRecommendationsFromSupabase(farmerId?: string) {
  try {
    let query = supabase.from('recommendations').select('*');
    if (farmerId) query = query.eq('farmer_id', farmerId);
    const { data, error } = await query.order('created_at', { ascending: false }).limit(20);
    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

/**
 * 9. `alerts` table integration
 */
export async function fetchAlertsFromSupabase() {
  try {
    const { data, error } = await supabase.from('alerts').select('*').limit(25);
    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

/**
 * 10. `government_schemes` and `scheme_matches` tables integration
 */
export async function fetchGovernmentSchemesFromSupabase() {
  try {
    const { data, error } = await supabase.from('government_schemes').select('*');
    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

export async function fetchSchemeMatchesFromSupabase(farmerId?: string) {
  try {
    let query = supabase.from('scheme_matches').select('*');
    if (farmerId) query = query.eq('farmer_id', farmerId);
    const { data, error } = await query;
    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

/**
 * 11. `notifications` table integration
 */
export async function fetchNotificationsFromSupabase(farmerId?: string) {
  try {
    let query = supabase.from('notifications').select('*');
    if (farmerId) query = query.eq('farmer_id', farmerId);
    const { data, error } = await query.order('created_at', { ascending: false }).limit(20);
    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

/**
 * 12. `voice_interactions` table integration
 */
export async function fetchVoiceInteractionsFromSupabase(farmerId?: string) {
  try {
    let query = supabase.from('voice_interactions').select('*');
    if (farmerId) query = query.eq('farmer_id', farmerId);
    const { data, error } = await query.order('created_at', { ascending: false }).limit(20);
    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, data: [] };
  }
}

export async function logVoiceInteractionToSupabase(interaction: {
  farmerId?: string;
  query: string;
  response: string;
  language?: string;
}) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const effectiveFarmerId = authData?.user?.id || interaction.farmerId || null;

    const { data, error } = await supabase.from('voice_interactions').insert([
      {
        farmer_id: effectiveFarmerId,
        query: interaction.query,
        response: interaction.response,
        language: interaction.language || 'en',
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export interface BackendIntegrationReport {
  supabaseConfigured: boolean;
  projectUrl: string;
  publishableKeyTruncated: string;
  healthFunction: {
    status: 'ok' | 'unreachable' | 'error' | 'pending';
    statusCode?: number;
    latencyMs?: number;
    data?: any;
    error?: string;
  };
  weatherFunction: {
    status: 'ok' | 'error' | 'pending';
    sampleQuery: string;
    temperature?: number;
    condition?: string;
    humidity?: number;
    windSpeed?: number;
    city?: string;
    error?: string;
  };
  marketFunction: {
    status: 'ok' | 'temporarily_unavailable' | 'error' | 'pending';
    recordCount?: number;
    error?: string;
    source?: string;
  };
  databaseTables: Record<
    string,
    {
      status: 'accessible' | 'permission_denied' | 'error' | 'empty';
      count?: number;
      error?: string;
    }
  >;
  timestamp: string;
}

export async function testSupabaseBackendIntegrations(): Promise<BackendIntegrationReport> {
  const start = Date.now();
  const report: BackendIntegrationReport = {
    supabaseConfigured: Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
    projectUrl: SUPABASE_URL,
    publishableKeyTruncated: `${SUPABASE_PUBLISHABLE_KEY.substring(0, 16)}...`,
    healthFunction: { status: 'pending' },
    weatherFunction: { status: 'pending', sampleQuery: 'city=Hyderabad' },
    marketFunction: { status: 'pending' },
    databaseTables: {},
    timestamp: new Date().toISOString(),
  };

  // 1. Test agrosaarthi-health
  try {
    const healthStart = Date.now();
    const health = await checkSupabaseHealth();
    report.healthFunction = {
      status: health.connected ? 'ok' : 'unreachable',
      latencyMs: Date.now() - healthStart,
      data: health.data,
      error: health.error,
    };
  } catch (e: any) {
    report.healthFunction = {
      status: 'error',
      error: e?.message || 'Error executing health check',
    };
  }

  // 2. Test agrosaarthi-weather with city=Hyderabad
  try {
    const weather = await fetchWeatherFromEdgeFunction('Hyderabad');
    if (weather.success && weather.data) {
      const d = weather.data;
      report.weatherFunction = {
        status: 'ok',
        sampleQuery: 'city=Hyderabad',
        city: d.city || d.district || d.name || 'Hyderabad',
        temperature: d.temperature ?? d.temp ?? d.currentTemp ?? d.main?.temp,
        condition: d.condition || d.weather || d.weather?.[0]?.description,
        humidity: d.humidity ?? d.main?.humidity,
        windSpeed: d.windSpeed ?? d.wind_speed ?? d.wind?.speed,
      };
    } else {
      report.weatherFunction = {
        status: 'error',
        sampleQuery: 'city=Hyderabad',
        error: weather.error || 'Failed to fetch weather data',
      };
    }
  } catch (e: any) {
    report.weatherFunction = {
      status: 'error',
      sampleQuery: 'city=Hyderabad',
      error: e?.message || 'Error reaching weather function',
    };
  }

  // 3. Test agrosaarthi-market
  try {
    const market = await fetchMarketPricesFromEdgeFunction();
    if (market.success && Array.isArray(market.data) && market.data.length > 0) {
      report.marketFunction = {
        status: 'ok',
        recordCount: market.data.length,
        source: market.source || 'agrosaarthi-market Edge Function',
      };
    } else {
      report.marketFunction = {
        status: 'temporarily_unavailable',
        recordCount: 0,
        error: market.error || 'Live mandi prices temporarily unavailable from government data API.',
        source: 'agrosaarthi-market (upstream government registry unreachable)',
      };
    }
  } catch (e: any) {
    report.marketFunction = {
      status: 'temporarily_unavailable',
      error: e?.message || 'Live mandi prices temporarily unavailable.',
    };
  }

  // 4. Test database tables under existing RLS
  const tables = [
    'farmers',
    'farms',
    'weather_data',
    'market_prices',
    'recommendations',
    'alerts',
    'government_schemes',
    'scheme_matches',
    'notifications',
    'voice_interactions',
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(5);
      if (error) {
        report.databaseTables[table] = {
          status: error.code === '42501' ? 'permission_denied' : 'error',
          error: error.message,
        };
      } else {
        report.databaseTables[table] = {
          status: data && data.length > 0 ? 'accessible' : 'empty',
          count: data ? data.length : 0,
        };
      }
    } catch (e: any) {
      report.databaseTables[table] = {
        status: 'error',
        error: e?.message || 'Query error',
      };
    }
  }

  return report;
}
