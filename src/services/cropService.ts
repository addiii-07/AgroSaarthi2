import { FarmHealthBreakdown, PriorityAction } from '../types';

export interface CropTimelineStage {
  id: string;
  name: string;
  durationDays: string;
  status: 'completed' | 'current' | 'upcoming';
  description: string;
  keyManagementTasks: string[];
  diseaseRiskAlert?: string;
}

export const DEMO_FARM_HEALTH: FarmHealthBreakdown = {
  overallScore: 78,
  cropHealth: 82,
  weatherSuitability: 88,
  soilMoisture: 65,
  pestRisk: 72,
  marketCondition: 75,
  summaryStatus: 'Good — but moisture & drainage need immediate attention',
  explanation: [
    'Crop Health (82/100): Plant vegetative canopy and flower clusters show healthy green vigor with no major leaf necrosis.',
    'Weather Suitability (88/100): Day temperatures (29–31°C) are well within the photosynthetic sweet spot for tomato flowering.',
    'Soil & Moisture (65/100): Incoming 35mm precipitation over the next 36 hours creates significant saturation and temporary root zone waterlogging risk.',
    'Pest & Pathogen Risk (72/100): High relative humidity (78%–88%) creates a favorable environment for Phytophthora and fungal leaf spot spores.',
    'Market Condition (75/100): Mandi rates in Hyderabad (₹35/kg) are favorable (+8% trend), providing strong monetization potential.',
  ],
  riskForecast: [
    { period: 'Today', risk: 'moderate', label: 'Overcast & Humidity', note: 'Prepare drainage ditches before evening precipitation begins.' },
    { period: 'Tomorrow', risk: 'high', label: 'Heavy Thunderstorms', note: 'Peak rainfall window; strictly suspend mechanical irrigation.' },
    { period: '3 Days Ahead', risk: 'moderate', label: 'Wet Foliage Window', note: 'Inspect lower leaf canopy for fungal sporulation once rain ceases.' },
    { period: '7 Days Ahead', risk: 'low', label: 'Sunny & Favorable', note: 'Soil dries to optimal field capacity; ideal for picking and market dispatch.' },
  ],
};

export const DEMO_TODAY_PRIORITIES: PriorityAction[] = [
  {
    id: 'act-1',
    title: 'Check and clear drainage channels',
    icon: '🌧',
    priority: 'high',
    action: 'Inspect plot borders, furrows, and low-lying corners to ensure excess rainwater can drain freely.',
    reason: 'Heavy rainfall (>30 mm) is predicted within 36 hours. Standing water will cause flower drop and root asphyxiation.',
    expectedTime: 'Within 6 hours (Before heavy rainfall starts)',
    severity: 'warning',
    sources: [
      { name: 'IMD Hyderabad Heavy Rain Advisory' },
      { name: 'ICAR Tomato Agronomic Management Guide' },
    ],
    contextFactors: [
      { label: 'Crop', value: 'Tomato (Arka Rakshak)' },
      { label: 'Growth Stage', value: 'Flowering Stage (Critical)' },
      { label: 'Rain Probability', value: '82%–88%' },
      { label: 'Soil Type', value: 'Red Loam' },
    ],
  },
  {
    id: 'act-2',
    title: 'Delay scheduled drip irrigation cycle',
    icon: '💧',
    priority: 'high',
    action: 'Turn off the drip valve today. Do not apply further water until topsoil moisture drops below 60%.',
    reason: 'Existing soil moisture is 65% and natural precipitation will provide ample water for the root system.',
    expectedTime: 'Today',
    severity: 'info',
    sources: [
      { name: 'Regional Agricultural Weather Matrix' },
      { name: 'Smart Irrigation Water Balance Model' },
    ],
    contextFactors: [
      { label: 'Current Moisture', value: '65% (Adequate)' },
      { label: 'Expected Rainfall', value: '35 mm' },
      { label: 'Water Savings', value: '~1,200 Litres saved' },
    ],
  },
  {
    id: 'act-3',
    title: 'Monitor lower leaves for fungal symptoms',
    icon: '🐛',
    priority: 'medium',
    action: 'Walk the field rows in the morning and inspect lower foliage for water-soaked concentric dark spots (early blight).',
    reason: 'High ambient humidity (78%) and persistent leaf moisture provide prime conditions for fungal germination.',
    expectedTime: 'Early Morning (07:00 AM - 09:30 AM)',
    severity: 'critical',
    sources: [
      { name: 'National Centre for Integrated Pest Management (NCIPM)' },
      { name: 'Telangana State Horticultural University Advisory' },
    ],
    contextFactors: [
      { label: 'Humidity', value: '78% - 88%' },
      { label: 'Pathogen Risk', value: 'Phytophthora & Alternaria' },
      { label: 'Recommended Action', value: 'Keep Neem-based or copper bio-fungicide on standby' },
    ],
  },
  {
    id: 'act-4',
    title: 'Review selling conditions & crate logistics',
    icon: '💰',
    priority: 'opportunity',
    action: 'Check harvest-ready mature-green to breaker stage tomatoes and coordinate with Bowenpally or local mandi commission agents.',
    reason: 'Local mandi prices are currently favorable at ₹35/kg (+8% trend), and pre-rain harvesting avoids fruit crack.',
    expectedTime: 'This Week',
    severity: 'success',
    sources: [
      { name: 'Agmarknet Hyderabad Daily Terminal Bulletin' },
      { name: 'Bowenpally APMC Market Commission Cell' },
    ],
    contextFactors: [
      { label: 'Mandi Rate', value: '₹35/kg (₹3,500/Q)' },
      { label: '7-Day Price Trend', value: '↑ 8.2%' },
      { label: 'Monetization Window', value: 'Favorable before regional supply arrival' },
    ],
  },
];

export const DEMO_CROP_TIMELINE: CropTimelineStage[] = [
  {
    id: 'stg-1',
    name: 'Nursery & Seedling',
    durationDays: 'Days 0 – 25',
    status: 'completed',
    description: 'Seed germination, pro-tray hardening, and healthy root shoot development.',
    keyManagementTasks: ['Pro-tray seedling drenching', 'Trichoderma bio-priming'],
  },
  {
    id: 'stg-2',
    name: 'Vegetative Growth',
    durationDays: 'Days 25 – 45',
    status: 'completed',
    description: 'Rapid stem elongation, lateral branching, and canopy establishment.',
    keyManagementTasks: ['Staking and trellising', 'Basal NPK 19-19-19 fertigation', 'Weed management'],
  },
  {
    id: 'stg-3',
    name: 'Flowering & Budding',
    durationDays: 'Days 45 – 75',
    status: 'current',
    description: 'Flower cluster emergence and active pollination. Moisture and calcium balance are vital.',
    keyManagementTasks: [
      'Avoid water stress (prevents blossom drop)',
      'Foliar spray of Boron (1g/L) to enhance fruit set',
      'Maintain adequate drainage to prevent collar rot',
    ],
    diseaseRiskAlert: 'High humidity currently elevates early blight and blossom end rot risk.',
  },
  {
    id: 'stg-4',
    name: 'Fruit Formation & Sizing',
    durationDays: 'Days 75 – 105',
    status: 'upcoming',
    description: 'Rapid fruit enlargement and color breaking.',
    keyManagementTasks: ['Potash (0-0-50) fertigation for fruit weight', 'Fruit borer pheromone monitoring'],
  },
  {
    id: 'stg-5',
    name: 'Harvesting & Ripening',
    durationDays: 'Days 105 – 130',
    status: 'upcoming',
    description: 'Multiple picking cycles every 3-4 days at breaker to pink stage for transport.',
    keyManagementTasks: ['Morning hand-picking into plastic crates', 'Grade sorting and mandi dispatch'],
  },
];

export const cropService = {
  getFarmHealth: () => DEMO_FARM_HEALTH,
  getTodayPriorities: () => DEMO_TODAY_PRIORITIES,
  getCropTimeline: () => DEMO_CROP_TIMELINE,
};
