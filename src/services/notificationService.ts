import { ProactiveAlert } from '../types';

export const DEMO_PROACTIVE_ALERTS: ProactiveAlert[] = [
  {
    id: 'alert-1',
    category: 'weather',
    title: '🔴 Heavy Rainfall Alert: 35mm Expected Within 36 Hours',
    severity: 'critical',
    timestamp: '15 mins ago',
    description: 'IMD Hyderabad radar detects an incoming monsoon convective rainband over Rangareddy district with 85% probability.',
    recommendedAction: [
      'Dig or clear perimeter field drainage trenches immediately.',
      'Completely suspend scheduled drip irrigation cycles.',
      'Move all harvested produce to elevated, covered storage.',
    ],
    whyItMatters: 'Tomato plants in the flowering stage suffer rapid flower drop and root collar rot when subjected to standing water > 4 hours.',
    source: 'IMD Hyderabad Heavy Precipitation Warning & Agromet Cell',
    isRead: false,
  },
  {
    id: 'alert-2',
    category: 'irrigation',
    title: '💧 Soil Moisture Saturation Alert: Delay Irrigation',
    severity: 'info',
    timestamp: '1 hour ago',
    description: 'Current plot moisture is at 65% capacity. Forecasted rainfall will elevate moisture to >90% field capacity.',
    recommendedAction: [
      'Keep drip irrigation pumps switched off until Thursday.',
      'Saves an estimated 1,200 Litres of water and 4 kWh electricity.',
    ],
    whyItMatters: 'Over-irrigation combined with rain leaches mobile nitrogen and potassium beyond the root intake zone.',
    source: 'AgroSaarthi Automated Water Balance Telemetry',
    isRead: false,
  },
  {
    id: 'alert-3',
    category: 'pest',
    title: '🐛 High Humidity Fungal Risk: Early Blight Scouting Alert',
    severity: 'warning',
    timestamp: '3 hours ago',
    description: 'Relative humidity averaging 78%–88% for 48 consecutive hours triggers the threshold for Alternaria and Phytophthora spore germination.',
    recommendedAction: [
      'Scout lower leaves during morning walk for dark concentric spots.',
      'Remove and safely dispose of yellowed soil-touching bottom leaves.',
      'Prepare protective bio-fungicide (Neem seed kernel extract 5% or Trichoderma) for post-rain foliar spray.',
    ],
    whyItMatters: 'Early detection at the single-leaf stage prevents explosive secondary blight spread across the 2-acre plot.',
    source: 'National Centre for Integrated Pest Management (NCIPM)',
    isRead: false,
  },
  {
    id: 'alert-4',
    category: 'market',
    title: '💰 Favorable Mandi Price Spike: Tomato at ₹35/kg in Bowenpally',
    severity: 'opportunity',
    timestamp: 'Today, 06:30 AM',
    description: 'Wholesale terminal rates in Bowenpally increased by 8.2% due to temporary supply drops from southern production belts.',
    recommendedAction: [
      'Pick breaker-stage tomatoes today before rainfall to prevent fruit cracking.',
      'Contact commission agent to schedule crate delivery for Tuesday morning wholesale auction.',
    ],
    whyItMatters: 'Monetizing at ₹35/kg provides an estimated 28% higher profit margin compared to the seasonal average of ₹27/kg.',
    source: 'Agmarknet Hyderabad Daily Mandi Arrivals Stream',
    isRead: true,
  },
  {
    id: 'alert-5',
    category: 'scheme',
    title: '📜 PM-KISAN & Telangana Micro-Irrigation Subsidy Window Open',
    severity: 'info',
    timestamp: 'Yesterday',
    description: 'Special verification drive for drip irrigation subsidies (up to 90% for small & marginal farmers) is active at Shamshabad Mandal office.',
    recommendedAction: [
      'Verify land passbook copy and Aadhaar link at the Rythu Vedika.',
      'Submit quotation for drip lateral replacement to Mandal Agri Officer.',
    ],
    whyItMatters: 'Can offset ₹22,000 in micro-irrigation maintenance expenses for your 2-acre plot.',
    source: 'Telangana Department of Agriculture & Farmers Welfare',
    isRead: true,
  },
];

class NotificationService {
  private alerts: ProactiveAlert[] = [...DEMO_PROACTIVE_ALERTS];

  public getAlerts(): ProactiveAlert[] {
    return this.alerts;
  }

  public getUnreadCount(): number {
    return this.alerts.filter((a) => !a.isRead).length;
  }

  public markAsRead(id: string) {
    this.alerts = this.alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a));
  }

  public markAllAsRead() {
    this.alerts = this.alerts.map((a) => ({ ...a, isRead: true }));
  }
}

export const notificationService = new NotificationService();
