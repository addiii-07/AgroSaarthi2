import { MarketPriceItem } from '../types';
import {
  fetchMarketPricesFromEdgeFunction,
  fetchMarketPricesFromSupabase,
} from '../lib/supabase';

export interface ReferenceMandiRecord {
  id: string;
  crop: 'Maize' | 'Tomato';
  state: string;
  district: string;
  market: string;
  pricePerQuintal: number;
  reportDate: string;
  reportingMandis?: number;
  notes?: string;
}

/**
 * Sourced Historical Reference Records (Preserved actual dates and units)
 * Used as benchmark reference data for demonstration when live market data is unavailable.
 */
export const SOURCED_REFERENCE_MANDI_RECORDS: ReferenceMandiRecord[] = [
  {
    id: 'ref-maize-national',
    crop: 'Maize',
    state: 'India (National)',
    district: 'National / All India',
    market: 'India national median',
    pricePerQuintal: 2303,
    reportDate: '8 October 2026',
    reportingMandis: 280,
    notes: '280 reporting mandis',
  },
  {
    id: 'ref-maize-telangana',
    crop: 'Maize',
    state: 'Telangana',
    district: 'Telangana (Statewide)',
    market: 'Telangana state median',
    pricePerQuintal: 2466,
    reportDate: '8 October 2026',
    reportingMandis: 21,
    notes: '21 reporting mandis',
  },
  {
    id: 'ref-tomato-bowenpally',
    crop: 'Tomato',
    state: 'Telangana',
    district: 'Hyderabad',
    market: 'Bowenpally APMC',
    pricePerQuintal: 1108,
    reportDate: '23 September 2026',
  },
  {
    id: 'ref-tomato-falaknuma',
    crop: 'Tomato',
    state: 'Telangana',
    district: 'Hyderabad',
    market: 'RYTHU BAZAR FALAKNUMA',
    pricePerQuintal: 1900,
    reportDate: '24 September 2026',
  },
  {
    id: 'ref-tomato-warangal',
    crop: 'Tomato',
    state: 'Telangana',
    district: 'Warangal',
    market: 'Warangal APMC',
    pricePerQuintal: 1300,
    reportDate: '24 September 2026',
  },
];

export interface MarketAdvisorInsight {
  crop: string;
  mandi: string;
  currentPricePerKg: number;
  currentPricePerQuintal: number;
  sevenDayTrendPercent: number;
  trendDirection: 'up' | 'down' | 'stable';
  marketCondition: 'Favorable' | 'Moderate' | 'Depressed';
  recommendation: 'Consider selling' | 'Hold stock' | 'Monitor daily';
  recommendationBadgeColor: 'emerald' | 'amber' | 'blue';
  reasoning: string[];
  riskFactor: string;
  disclaimer: string;
  historicalPrices: Array<{ date: string; price: number }>;
}

export interface FarmEconomicsInput {
  crop: string;
  farmSizeAcres: number;
  expectedYieldPerAcreQuintals: number;
  sellingPricePerQuintal: number;
  inputCostPerAcre: number;
  laborCostPerAcre: number;
  transportCostPerQuintal: number;
}

export interface FarmEconomicsResult {
  totalExpectedYieldQuintals: number;
  totalRevenueMin: number;
  totalRevenueMax: number;
  totalRevenueExpected: number;
  totalCosts: number;
  netReturnMin: number;
  netReturnMax: number;
  netReturnExpected: number;
  roiPercent: number;
  costBreakdown: {
    inputs: number;
    labor: number;
    transport: number;
  };
}

export const DEMO_MARKET_ADVISOR: MarketAdvisorInsight = {
  crop: 'Tomato',
  mandi: 'Bowenpally Agricultural Market Yard, Hyderabad',
  currentPricePerKg: 35,
  currentPricePerQuintal: 3500,
  sevenDayTrendPercent: 8.2,
  trendDirection: 'up',
  marketCondition: 'Favorable',
  recommendation: 'Consider selling',
  recommendationBadgeColor: 'emerald',
  reasoning: [
    'Current mandi price of ₹35/kg is 14% higher than the 30-day moving average.',
    'Recent 7-day arrivals in Hyderabad and Rangareddy are down 12%, keeping demand firm.',
    'Approaching heavy rainfall over the next 48 hours risks field-spoilage and moisture damage if harvested late.',
  ],
  riskFactor: 'Incoming supply surges from Madanapalle / Kolar next week may stabilize or pull rates down.',
  disclaimer: 'Based on available indicators and arrivals. Current conditions suggest a favorable window; actual mandi settlement depends on fruit grade and moisture content.',
  historicalPrices: [
    { date: 'Sep 29', price: 3100 },
    { date: 'Sep 30', price: 3150 },
    { date: 'Oct 01', price: 3200 },
    { date: 'Oct 02', price: 3300 },
    { date: 'Oct 03', price: 3400 },
    { date: 'Oct 04', price: 3450 },
    { date: 'Oct 05', price: 3500 },
  ],
};

export const DEMO_MARKET_PRICES_LIST: MarketPriceItem[] = [
  {
    id: 'mp-1',
    cropName: 'Tomato',
    variety: 'Hybrid Arka Rakshak / Local',
    district: 'Rangareddy',
    mandiName: 'Bowenpally APMC Market Yard',
    minPrice: 2800,
    maxPrice: 3800,
    modalPrice: 3500,
    prevPrice: 3200,
    priceTrend: 'up',
    demandIndicator: 'High',
    bestMarketToSell: 'Bowenpally Mandi (Top rates for crate lots)',
    distanceKm: 28,
    date: '2026-10-05',
    historicalPrices: [
      { date: '2026-09-29', price: 3100 },
      { date: '2026-10-02', price: 3300 },
      { date: '2026-10-05', price: 3500 },
    ],
  },
  {
    id: 'mp-2',
    cropName: 'Chilli',
    variety: 'Teja (S17)',
    district: 'Guntur',
    mandiName: 'Guntur Mirchi Yard (Asia’s Largest)',
    minPrice: 18500,
    maxPrice: 22800,
    modalPrice: 21500,
    prevPrice: 20400,
    priceTrend: 'up',
    demandIndicator: 'High',
    bestMarketToSell: 'Guntur APMC Yard',
    distanceKm: 14,
    date: '2026-10-05',
    historicalPrices: [
      { date: '2026-09-28', price: 19800 },
      { date: '2026-10-01', price: 20400 },
      { date: '2026-10-05', price: 21500 },
    ],
  },
  {
    id: 'mp-3',
    cropName: 'Paddy (Rice)',
    variety: 'BPT 5204 (Samba Mahsuri)',
    district: 'West Godavari',
    mandiName: 'Tadepalligudem Mandi',
    minPrice: 2450,
    maxPrice: 2750,
    modalPrice: 2600,
    prevPrice: 2580,
    priceTrend: 'stable',
    demandIndicator: 'Medium',
    bestMarketToSell: 'Bhimavaram Millers Point',
    distanceKm: 32,
    date: '2026-10-05',
    historicalPrices: [
      { date: '2026-09-28', price: 2550 },
      { date: '2026-10-01', price: 2580 },
      { date: '2026-10-05', price: 2600 },
    ],
  },
  {
    id: 'mp-4',
    cropName: 'Cotton',
    variety: 'Bt Cotton Medium Staple',
    district: 'Warangal',
    mandiName: 'Enumamula Agriculture Market',
    minPrice: 6800,
    maxPrice: 7550,
    modalPrice: 7200,
    prevPrice: 7350,
    priceTrend: 'down',
    demandIndicator: 'Medium',
    bestMarketToSell: 'Enumamula APMC',
    distanceKm: 45,
    date: '2026-10-05',
    historicalPrices: [
      { date: '2026-09-28', price: 7450 },
      { date: '2026-10-01', price: 7350 },
      { date: '2026-10-05', price: 7200 },
    ],
  },
  {
    id: 'mp-5',
    cropName: 'Maize',
    variety: 'Hybrid Yellow',
    district: 'Nizamabad',
    mandiName: 'Nizamabad Grain Market',
    minPrice: 1950,
    maxPrice: 2280,
    modalPrice: 2120,
    prevPrice: 2080,
    priceTrend: 'up',
    demandIndicator: 'High',
    bestMarketToSell: 'Nizamabad APMC',
    distanceKm: 60,
    date: '2026-10-05',
    historicalPrices: [
      { date: '2026-09-28', price: 2020 },
      { date: '2026-10-01', price: 2080 },
      { date: '2026-10-05', price: 2120 },
    ],
  },
  {
    id: 'mp-6',
    cropName: 'Bengal Gram',
    variety: 'JG 11',
    district: 'Kurnool',
    mandiName: 'Kurnool APMC Market',
    minPrice: 5100,
    maxPrice: 5650,
    modalPrice: 5400,
    prevPrice: 5400,
    priceTrend: 'stable',
    demandIndicator: 'Medium',
    bestMarketToSell: 'Kurnool Yard',
    distanceKm: 22,
    date: '2026-10-05',
    historicalPrices: [
      { date: '2026-09-28', price: 5350 },
      { date: '2026-10-01', price: 5400 },
      { date: '2026-10-05', price: 5400 },
    ],
  },
];

export function calculateFarmEconomics(input: FarmEconomicsInput): FarmEconomicsResult {
  const totalYield = input.farmSizeAcres * input.expectedYieldPerAcreQuintals;
  const inputCosts = input.farmSizeAcres * input.inputCostPerAcre;
  const laborCosts = input.farmSizeAcres * input.laborCostPerAcre;
  const transportCosts = totalYield * input.transportCostPerQuintal;
  const totalCosts = inputCosts + laborCosts + transportCosts;

  const expectedRev = totalYield * input.sellingPricePerQuintal;
  const minRev = expectedRev * 0.88;
  const maxRev = expectedRev * 1.15;

  const netExpected = expectedRev - totalCosts;
  const netMin = minRev - totalCosts;
  const netMax = maxRev - totalCosts;

  const roiPercent = totalCosts > 0 ? Math.round((netExpected / totalCosts) * 100) : 0;

  return {
    totalExpectedYieldQuintals: totalYield,
    totalRevenueMin: Math.round(minRev),
    totalRevenueMax: Math.round(maxRev),
    totalRevenueExpected: Math.round(expectedRev),
    totalCosts: Math.round(totalCosts),
    netReturnMin: Math.round(netMin),
    netReturnMax: Math.round(netMax),
    netReturnExpected: Math.round(netExpected),
    roiPercent,
    costBreakdown: {
      inputs: Math.round(inputCosts),
      labor: Math.round(laborCosts),
      transport: Math.round(transportCosts),
    },
  };
}

export const marketService = {
  async getAdvisorInsight(crop = 'Tomato'): Promise<MarketAdvisorInsight> {
    if (crop.toLowerCase().includes('chilli')) {
      return {
        ...DEMO_MARKET_ADVISOR,
        crop: 'Chilli',
        mandi: 'Guntur Mirchi Yard',
        currentPricePerKg: 215,
        currentPricePerQuintal: 21500,
        sevenDayTrendPercent: 5.4,
        trendDirection: 'up',
        marketCondition: 'Favorable',
        recommendation: 'Consider selling',
        recommendationBadgeColor: 'emerald',
        reasoning: [
          'Teja variety export contracts have stimulated spot auction bids in Guntur.',
          'Arrivals are matching seasonal expectations with strong warehouse off-take.',
        ],
        riskFactor: 'New crop arrivals from northern districts scheduled in 2 weeks.',
      };
    }
    return DEMO_MARKET_ADVISOR;
  },

  async getLivePricesResult(crop?: string, district?: string): Promise<{
    success: boolean;
    prices: MarketPriceItem[];
    source: string;
    fetchedDate?: string;
    error?: string;
  }> {
    try {
      // 1. Try Supabase Edge Function `agrosaarthi-market`
      const edgeRes = await fetchMarketPricesFromEdgeFunction(crop, district);
      if (edgeRes.success && Array.isArray(edgeRes.data) && edgeRes.data.length > 0) {
        const mapped = edgeRes.data.map((item: any, idx: number) => ({
          id: item.id || `mkt-${idx}`,
          cropName: item.crop || item.cropName || item.commodity || 'Crop',
          variety: item.variety || 'Standard',
          district: item.district || district || 'Telangana / AP',
          mandiName: item.mandi || item.market || item.mandiName || 'APMC Yard',
          minPrice: Number(item.min_price || item.minPrice || item.price || 0),
          maxPrice: Number(item.max_price || item.maxPrice || item.price || 0),
          modalPrice: Number(item.modal_price || item.modalPrice || item.price || 0),
          prevPrice: Number(item.prev_price || item.prevPrice || 0),
          priceTrend: (item.trend || 'stable') as any,
          demandIndicator: (item.demand || 'Medium') as any,
          bestMarketToSell: item.best_market || item.mandi || 'APMC Yard',
          distanceKm: Number(item.distance || 0),
          date: item.date || item.arrival_date || new Date().toISOString().split('T')[0],
          historicalPrices: item.historicalPrices || [],
          trend: item.trend || 'stable',
          change: item.change || '0%',
          arrivals: item.arrivals || `${item.arrival_quantity || 'Regular'} Qtl`,
          price: Number(item.modal_price || item.price || 0),
        }));
        return {
          success: true,
          prices: mapped,
          source: edgeRes.source || 'agrosaarthi-market (Live Edge Function)',
          fetchedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        };
      }

      // 2. Try Supabase `market_prices` table
      const dbRes = await fetchMarketPricesFromSupabase(crop, district);
      if (dbRes.success && Array.isArray(dbRes.data) && dbRes.data.length > 0) {
        const mapped = dbRes.data.map((item: any, idx: number) => ({
          id: item.id || `db-${idx}`,
          cropName: item.crop || item.crop_name || 'Crop',
          variety: item.variety || 'Standard',
          district: item.district || 'Telangana / AP',
          mandiName: item.mandi || item.mandi_name || 'APMC Mandi',
          minPrice: Number(item.min_price || item.price || 0),
          maxPrice: Number(item.max_price || item.price || 0),
          modalPrice: Number(item.modal_price || item.price || 0),
          prevPrice: Number(item.prev_price || 0),
          priceTrend: 'stable' as const,
          demandIndicator: 'Medium' as const,
          bestMarketToSell: item.mandi || 'APMC Mandi',
          distanceKm: 0,
          date: item.date || item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          historicalPrices: [],
          trend: 'stable',
          change: '0%',
          arrivals: item.arrivals || 'Regular',
          price: Number(item.price || item.modal_price || 0),
        }));
        return {
          success: true,
          prices: mapped,
          source: 'Supabase market_prices table',
          fetchedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        };
      }

      // Upstream government data API is currently unreachable through agrosaarthi-market
      return {
        success: false,
        prices: [],
        source: 'agrosaarthi-market Edge Function',
        error:
          edgeRes.error ||
          'Live mandi prices are temporarily unavailable from the government data API (data.gov.in / APMC feed).',
      };
    } catch (e: any) {
      return {
        success: false,
        prices: [],
        source: 'agrosaarthi-market Edge Function',
        error:
          e?.message ||
          'Live mandi prices are temporarily unavailable from the government data API.',
      };
    }
  },

  async getPrices(crop?: string, district?: string): Promise<MarketPriceItem[]> {
    const res = await this.getLivePricesResult(crop, district);
    return res.prices;
  },
};
