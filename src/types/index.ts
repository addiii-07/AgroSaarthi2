export type UserRole = 'farmer' | 'officer' | 'admin';

export type Language =
  | 'en'
  | 'te'
  | 'hi'
  | 'ta'
  | 'kn'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'pa'
  | 'or'
  | 'ml';

export interface FarmerProfile {
  id: string;
  full_name?: string;
  name: string;
  phone: string;
  language: string;
  state: string;
  district: string;
  village: string;
  crop: string;
  crop_variety: string;
  farm_size: number | string;
  sowing_date: string;
  irrigation_type: string;
  soil_type: string;
  growth_stage: string;
  preferred_market: string;
  created_at: string;
}

export interface User {
  id: string;
  fullName: string;
  full_name?: string;
  name?: string; // alias for name
  mobile: string;
  phone?: string; // alias for phone
  role: UserRole;
  language?: Language | string; // alias for language
  state?: string;
  district: string;
  villageMandal: string;
  village?: string; // alias for village
  primaryCrop: string;
  crop?: string; // alias for crop
  cropVariety?: string;
  crop_variety?: string; // alias for crop_variety
  farmSize?: number | string;
  farm_size?: number | string; // alias for farm_size
  sowingDate?: string;
  sowing_date?: string; // alias for sowing_date
  irrigationType?: string;
  irrigation_type?: string; // alias for irrigation_type
  soilType?: string;
  soil_type?: string; // alias for soil_type
  growthStage?: string;
  growth_stage?: string; // alias for growth_stage
  preferredMarket?: string;
  preferred_market?: string; // alias for preferred_market
  preferredLanguage: Language;
  profilePhoto?: string;
  createdAt: string;
  created_at?: string; // alias for created_at
  season?: string;
  isProfileIncomplete?: boolean;
}

export interface FarmDetails {
  id: string;
  userId: string;
  landArea: number; // in acres
  landUnit: string;
  soilType: 'Red Soil' | 'Black Soil' | 'Alluvial Soil' | 'Clay Soil' | 'Sandy Loam' | 'Laterite Soil';
  irrigationType: 'Drip' | 'Sprinkler' | 'Canal/Borewell' | 'Rainfed' | 'Tubewell';
  cropSeason: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  previousCrop: string;
  farmLocation: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  farmImages: string[];
  updatedAt: string;
}

export interface CropRecommendationRequest {
  soilType: string;
  district: string;
  season: string;
  rainfall: 'Low (<500mm)' | 'Moderate (500-1000mm)' | 'High (>1000mm)';
  waterAvailability: 'Abundant' | 'Moderate' | 'Scarcity';
  previousCrop: string;
}

export interface CropRecommendationResponse {
  recommendedCrop: string;
  alternateCrops: string[];
  expectedYield: string; // e.g. "22-25 Quintals/Acre"
  fertilizerPlan: {
    basal: string;
    firstDose: string;
    secondDose: string;
  };
  waterRequirement: string;
  growingPeriod: string;
  estimatedProfit: string;
  confidenceScore: number; // percentage e.g. 94
  aiReasoning: string;
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  scientificName?: string;
  confidenceScore: number; // percentage
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  preventionMethods: string[];
  recommendedTreatment: {
    chemical: string[];
    organic: string[];
    dosage: string;
  };
  advisoryMessage: string;
}

export interface WeatherData {
  district: string;
  currentTemp: number; // °C
  condition: string;
  humidity: number; // %
  windSpeed: number; // km/h
  rainPrediction: number; // %
  rainfall?: string; // e.g. "0.5 mm" or "0 mm"
  uvIndex: number;
  weeklyForecast: Array<{
    day: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProb: number;
    icon: string;
  }>;
  alerts: Array<{
    id: string;
    severity: 'info' | 'warning' | 'danger';
    title: string;
    description: string;
    date: string;
  }>;
}

export interface MarketPriceItem {
  id: string;
  cropName: string;
  variety: string;
  district: string;
  mandiName: string;
  minPrice: number; // ₹ per quintal
  maxPrice: number;
  modalPrice: number;
  prevPrice: number;
  priceTrend: 'up' | 'down' | 'stable';
  demandIndicator: 'High' | 'Medium' | 'Low';
  bestMarketToSell: string;
  distanceKm: number;
  date: string;
  historicalPrices: Array<{ date: string; price: number }>;
  trend?: string;
  change?: string;
  arrivals?: string;
  price?: number;
}

export type MarketPrice = MarketPriceItem;

export interface GovernmentScheme {
  id: string;
  schemeName: string;
  department: string;
  shortDescription: string;
  fullDescription: string;
  subsidyPercentage: string;
  eligibility: string[];
  requiredDocuments: string[];
  applicationDeadline: string;
  contactHelpline: string;
  portalUrl: string;
  category: string;
}

export interface AISchemeRecommendation {
  id: string;
  schemeName: string;
  department: string;
  category: string;
  whyRecommended: string;
  benefits: string;
  eligibility: string[];
  requiredDocuments: string[];
  officialWebsite: string;
  bhashiniSummary?: string;
}

export interface SchemeApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  farmerId: string;
  farmerName: string;
  mobile: string;
  district: string;
  status: 'Submitted' | 'Under Verification' | 'Approved' | 'Rejected' | 'Disbursed';
  appliedDate: string;
  amountClaimed?: number;
  remarks?: string;
}

export interface InsuranceClaim {
  id: string;
  farmerId: string;
  farmerName: string;
  mobile: string;
  district: string;
  cropName: string;
  landAreaAffected: number; // acres
  damageCause: 'Drought' | 'Excess Rain / Flood' | 'Pest Attack' | 'Cyclone / Hailstorm' | 'Unseasonal Frost';
  damageDate: string;
  estimatedLossPercentage: number;
  damagePhotos: string[];
  status: 'Pending Verification' | 'Officer Inspected' | 'Approved' | 'Rejected' | 'Disbursed';
  claimedAmount: number;
  disbursedAmount?: number;
  officerRemarks?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  district?: string;
  type: 'weather' | 'scheme' | 'market' | 'insurance' | 'advisory';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface Advisory {
  id: string;
  officerName: string;
  district: string;
  cropCategory: string;
  title: string;
  content: string;
  publishedDate: string;
  urgency: 'Normal' | 'High' | 'Urgent';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: Language;
}

export interface SmartFarmingGuide {
  cropName: string;
  state: string;
  district: string;
  overview: {
    title: string;
    description: string;
    category: string;
    growthDuration: string;
  };
  suitableSoil: {
    bestSoils: string[];
    whySuitable: string;
    phRange: string;
  };
  waterAndIrrigation: {
    waterRequirement: string;
    irrigationSchedule: string[];
    criticalStages: string[];
  };
  weatherSuitability: {
    isSuitable: boolean;
    currentConditions: string;
    advisoryNote: string;
  };
  fertilizerRecommendation: {
    basalDose: string;
    topDressing1: string;
    topDressing2: string;
    organicTips: string;
  };
  pestsAndDiseases: {
    commonPests: string[];
    commonDiseases: string[];
    preventionMethods: string[];
  };
  marketPriceInfo: {
    currentPrice: string;
    mandiName: string;
    trend: string;
    sellingAdvice: string;
  };
  governmentSchemes: Array<{
    name: string;
    benefit: string;
  }>;
  farmingTimeline: Array<{
    stage: string;
    timeframe: string;
    action: string;
  }>;
  estimatedProfit: {
    costPerAcre: string;
    expectedYield: string;
    expectedRevenue: string;
    netProfitRange: string;
  };
  aiTips: string[];
}

export interface PriorityAction {
  id: string;
  title: string;
  icon: string;
  priority: 'high' | 'medium' | 'low' | 'opportunity';
  action: string;
  reason: string;
  expectedTime: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  sources: Array<{ name: string; url?: string }>;
  contextFactors: Array<{ label: string; value: string }>;
}

export interface FarmHealthBreakdown {
  overallScore: number;
  cropHealth: number;
  weatherSuitability: number;
  soilMoisture: number;
  pestRisk: number;
  marketCondition: number;
  summaryStatus: string;
  explanation: string[];
  riskForecast: Array<{
    period: string;
    risk: 'low' | 'moderate' | 'high';
    label: string;
    note: string;
  }>;
}

export interface StructuredAiResponse {
  recommendation: string;
  reason: string;
  actions: string[];
  risk_level: 'low' | 'medium' | 'high';
  confidence: number;
  sources: Array<{ name: string; url?: string }>;
  requires_expert: boolean;
}

export interface ExpertQuery {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  category: string;
  description: string;
  photoUrl?: string;
  location: string;
  status: 'Pending' | 'Under Review' | 'Resolved';
  createdAt: string;
  response?: string;
  expertName?: string;
}

export interface ProactiveAlert {
  id: string;
  category: 'weather' | 'crop' | 'pest' | 'market' | 'irrigation' | 'scheme';
  title: string;
  severity: 'critical' | 'warning' | 'info' | 'opportunity';
  timestamp: string;
  description: string;
  recommendedAction: string[];
  whyItMatters: string;
  source: string;
  isRead: boolean;
}

export interface DataSourceItem {
  id: string;
  name: string;
  type: string;
  provider: string;
  lastUpdated: string;
  verificationStatus: string;
  url: string;
  description: string;
}

