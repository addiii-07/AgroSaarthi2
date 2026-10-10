import { User } from '../types';
import { saveFarmerToSupabase, fetchFarmerProfileFromSupabase } from '../lib/supabase';

export function calculateProfileCompleteness(user: User): {
  percentage: number;
  missingFields: string[];
  recommendation: string;
} {
  const fieldsToCheck = [
    { key: 'name', label: 'Farmer Name', value: user.name || user.fullName },
    { key: 'phone', label: 'Phone Number', value: user.phone || user.mobile },
    { key: 'state', label: 'State', value: user.state },
    { key: 'district', label: 'District', value: user.district },
    { key: 'village', label: 'Village', value: user.village || user.villageMandal },
    { key: 'crop', label: 'Primary Crop', value: user.crop || user.primaryCrop },
    { key: 'crop_variety', label: 'Crop Variety', value: user.crop_variety || (user as any).cropVariety },
    { key: 'farm_size', label: 'Farm Size', value: user.farm_size || (user as any).farmSize },
    { key: 'sowing_date', label: 'Sowing Date', value: user.sowing_date || (user as any).sowingDate },
    { key: 'irrigation_type', label: 'Irrigation Type', value: user.irrigation_type || (user as any).irrigationType },
    { key: 'soil_type', label: 'Soil Type', value: user.soil_type || (user as any).soilType },
    { key: 'growth_stage', label: 'Growth Stage', value: user.growth_stage || (user as any).growthStage },
    { key: 'preferred_market', label: 'Preferred Market', value: user.preferred_market || (user as any).preferredMarket },
  ];

  const presentFields = fieldsToCheck.filter((f) => Boolean(f.value && String(f.value).trim() !== ''));
  const missing = fieldsToCheck.filter((f) => !f.value || String(f.value).trim() === '').map((f) => f.label);

  const percentage = Math.round((presentFields.length / fieldsToCheck.length) * 100);

  let recommendation = 'Your profile is fully configured for maximum AI recommendation accuracy!';
  if (missing.includes('Soil Type')) {
    recommendation = 'Add your soil type to improve localized fertilizer and irrigation accuracy.';
  } else if (missing.includes('Growth Stage')) {
    recommendation = 'Specify your crop growth stage to receive stage-targeted pest alerts.';
  } else if (missing.includes('Crop Variety')) {
    recommendation = 'Select your seed variety for disease-resistance matched advisories.';
  } else if (missing.length > 0) {
    recommendation = `Complete ${missing[0]} to unlock deeper agronomic intelligence.`;
  }

  return { percentage, missingFields: missing, recommendation };
}

export const farmerService = {
  async getProfile(userId?: string): Promise<User | null> {
    const sup = await fetchFarmerProfileFromSupabase(userId);
    if (sup.success && sup.data) {
      return sup.data as unknown as User;
    }
    return null;
  },

  async updateProfile(user: User): Promise<{ success: boolean; user: User; error?: string }> {
    const res = await saveFarmerToSupabase(user as any);
    if (!res.success) {
      return { success: false, user, error: res.error };
    }
    return { success: true, user };
  },
};
