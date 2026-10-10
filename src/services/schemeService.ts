import { GovernmentScheme } from '../types';

export interface VerifiedScheme extends GovernmentScheme {
  whyAmISeeingThis: string;
  officialSourceLabel: string;
  isEligibleForCurrentFarmer: boolean;
  matchScore: number;
}

export const VERIFIED_SCHEMES_LIST: VerifiedScheme[] = [
  {
    id: 'sch-pmkisan',
    schemeName: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    department: 'Ministry of Agriculture & Farmers Welfare, GoI',
    shortDescription: 'Direct income support of ₹6,000 per year transferred in 3 equal installments to eligible landholding farmer families.',
    fullDescription: 'PM-KISAN is a central sector scheme to augment income of all landholding farmers across India. Funds are directly transferred to Aadhaar-seeded bank accounts.',
    subsidyPercentage: '₹6,000 / Year (100% Direct Grant)',
    eligibility: [
      'Small and marginal landholding farmer families with cultivable land up to 2 hectares (5 acres).',
      'Name recorded in state land records (Pattadar Passbook / Dharani portal).',
      'Completed Aadhaar e-KYC and active bank account link.',
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Land Ownership Record (Pattadar Passbook / ROR-1B)',
      'Aadhaar-Linked Bank Account Details',
    ],
    applicationDeadline: 'Open year-round on official portal',
    contactHelpline: '155261 / 1800115526',
    portalUrl: 'https://pmkisan.gov.in',
    category: 'Direct Income Support',
    whyAmISeeingThis: 'Matched because you are a registered farmer with 2.0 acres landholding in Telangana.',
    officialSourceLabel: 'Official GoI Portal (pmkisan.gov.in)',
    isEligibleForCurrentFarmer: true,
    matchScore: 98,
  },
  {
    id: 'sch-mip',
    schemeName: 'Telangana Micro Irrigation Project (TSMIP)',
    department: 'Horticulture Department, Government of Telangana',
    shortDescription: 'Provides up to 90% subsidy on Drip and Sprinkler irrigation equipment for small and marginal horticultural farmers.',
    fullDescription: 'A flagship state program to conserve water resources and maximize crop productivity. Small & marginal farmers receive 90% subsidy, while other farmers receive up to 80% subsidy for commercial vegetable and fruit crops.',
    subsidyPercentage: '80% - 90% Subsidy on Drip Systems',
    eligibility: [
      'Farmers cultivating horticultural crops (Tomato, Chilli, Vegetables, Fruits).',
      'Available water source (borewell, open well, or farm pond).',
      'Small/Marginal farmer status confirmed by revenue department.',
    ],
    requiredDocuments: [
      'Dharani Land Title Passbook',
      'Aadhaar Card & Photo',
      'Electricity Bill / Water Source Proof',
      'Small/Marginal Farmer Certificate',
    ],
    applicationDeadline: 'Ongoing for Kharif & Rabi 2026',
    contactHelpline: '040-23222210 / District Horticulture Office',
    portalUrl: 'https://horticulturedept.telangana.gov.in',
    category: 'Micro Irrigation',
    whyAmISeeingThis: 'Matched because your crop is Tomato and your farm uses Drip Irrigation in Rangareddy.',
    officialSourceLabel: 'Department of Horticulture, Govt of Telangana',
    isEligibleForCurrentFarmer: true,
    matchScore: 96,
  },
  {
    id: 'sch-pmfby',
    schemeName: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    department: 'Ministry of Agriculture & Farmers Welfare, GoI',
    shortDescription: 'Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest.',
    fullDescription: 'PMFBY shields farmers from financial shocks caused by drought, flood, inundation, pests, and unseasonal weather. Farmer premium is capped at only 1.5% - 2% of the sum insured.',
    subsidyPercentage: '98% Premium Subsidized by Govt',
    eligibility: [
      'All farmers cultivating notified crops in notified areas (notified horticultural crops include Tomato & Chilli).',
      'Both owner cultivators and certified tenant farmers are eligible.',
    ],
    requiredDocuments: [
      'Sowing Certificate / VRO Adangal Proof',
      'Aadhaar Card',
      'Bank Account Details',
      'Land Record Copy',
    ],
    applicationDeadline: '15 days post crop sowing cut-off',
    contactHelpline: '1800-180-1551 (Kisan Call Centre)',
    portalUrl: 'https://pmfby.gov.in',
    category: 'Crop Insurance',
    whyAmISeeingThis: 'Matched because forecasted heavy rains increase flood risk for your Tomato flowering plot.',
    officialSourceLabel: 'Official PMFBY Portal (pmfby.gov.in)',
    isEligibleForCurrentFarmer: true,
    matchScore: 94,
  },
  {
    id: 'sch-smam',
    schemeName: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    department: 'Department of Agriculture & Farmers Welfare',
    shortDescription: 'Financial assistance of 40% to 50% for procurement of modern farm machinery, sprayers, and rotavators.',
    fullDescription: 'Aims to increase the reach of farm mechanization to small and marginal farmers. Subsidies apply to power tillers, battery-operated knapsack sprayers, tractor implements, and weeders.',
    subsidyPercentage: '40% - 50% Subsidy on Machinery',
    eligibility: [
      'Individual farmers possessing cultivable agricultural land.',
      'Special priority given to small, marginal, and SC/ST farmers.',
    ],
    requiredDocuments: [
      'Pattadar Passbook',
      'Aadhaar Card',
      'Caste Certificate (if applicable)',
      'Bank Account Copy',
    ],
    applicationDeadline: 'Annual budget window allocations',
    contactHelpline: '1800-180-1551',
    portalUrl: 'https://agrimachinery.nic.in',
    category: 'Farm Mechanization',
    whyAmISeeingThis: 'Matched because mechanized sprayers are recommended for pest management on your 2-acre plot.',
    officialSourceLabel: 'Ministry of Agriculture Mechanization Portal',
    isEligibleForCurrentFarmer: true,
    matchScore: 89,
  },
];

export const schemeService = {
  async getSchemes(): Promise<VerifiedScheme[]> {
    return VERIFIED_SCHEMES_LIST;
  },
};
