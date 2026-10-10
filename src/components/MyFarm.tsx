import React, { useState, useEffect } from 'react';
import { FarmDetails } from '../types';
import {
  Layers,
  MapPin,
  Droplets,
  Sun,
  Image as ImageIcon,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { supabase, saveFarmToSupabase } from '../lib/supabase';

interface MyFarmProps {
  farm: FarmDetails;
  userId: string;
  onUpdateFarm: (updated: FarmDetails) => void;
}

export const MyFarm: React.FC<MyFarmProps> = ({ farm, userId, onUpdateFarm }) => {
  const [farmName, setFarmName] = useState<string>((farm as any)?.name || (farm as any)?.farm_name || (farm as any)?.farmName || 'Main Farm Plot');
  const [crop, setCrop] = useState<string>((farm as any)?.crop || '');
  const [cropVariety, setCropVariety] = useState<string>((farm as any)?.crop_variety || (farm as any)?.cropVariety || '');
  const [landArea, setLandArea] = useState<number>(farm?.landArea || 0);
  const [soilType, setSoilType] = useState(farm?.soilType || 'Black Soil');
  const [irrigationType, setIrrigationType] = useState(farm?.irrigationType || 'Drip');
  const [sowingDate, setSowingDate] = useState<string>(
    (farm as any)?.sowing_date || (farm as any)?.sowingDate || new Date().toISOString().split('T')[0]
  );
  const [cropSeason, setCropSeason] = useState(farm?.cropSeason || 'Kharif');
  const [previousCrop, setPreviousCrop] = useState(farm?.previousCrop || '');
  const [farmLocation, setFarmLocation] = useState(
    farm?.farmLocation?.address || ''
  );
  const [farmImages, setFarmImages] = useState<string[]>(
    farm?.farmImages || []
  );

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Sync local form state when farm prop updates
  useEffect(() => {
    if (farm) {
      if ((farm as any).name) setFarmName((farm as any).name);
      if ((farm as any).crop) setCrop((farm as any).crop);
      if ((farm as any).crop_variety || (farm as any).cropVariety) {
        setCropVariety((farm as any).crop_variety || (farm as any).cropVariety);
      }
      if (farm.landArea != null) setLandArea(Number(farm.landArea));
      if (farm.soilType) setSoilType(farm.soilType);
      if (farm.irrigationType) setIrrigationType(farm.irrigationType);
      if (farm.cropSeason) setCropSeason(farm.cropSeason);
      if (farm.previousCrop) setPreviousCrop(farm.previousCrop);
      if ((farm as any).sowing_date || (farm as any).sowingDate) {
        setSowingDate(((farm as any).sowing_date || (farm as any).sowingDate).split('T')[0]);
      }
      if ((farm as any).address || farm.farmLocation?.address) {
        setFarmLocation((farm as any).address || farm.farmLocation?.address || '');
      }
    }
  }, [farm]);

  useEffect(() => {
    let isMounted = true;
    const loadFarmRecord = async () => {
      try {
        const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !authUser) {
          if (authErr) console.error('Error fetching auth user for farm:', authErr);
          return;
        }

        const { data, error } = await supabase
          .from('farms')
          .select('*')
          .eq('farmer_id', authUser.id)
          .order('id', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error loading farm from Supabase:', error);
          setErrorMsg(error.message);
          return;
        }

        if (data && data.length > 0 && isMounted) {
          const f = data[0];
          console.log('Loaded farm record from Supabase:', f);
          if (f.name) setFarmName(f.name);
          if (f.crop) setCrop(f.crop);
          if (f.crop_variety) setCropVariety(f.crop_variety);
          if (f.area_acres != null) setLandArea(Number(f.area_acres));
          if (f.soil_type) setSoilType(f.soil_type);
          if (f.irrigation) setIrrigationType(f.irrigation);
          if (f.crop_season) setCropSeason(f.crop_season);
          if (f.previous_crop) setPreviousCrop(f.previous_crop);
          if (f.sowing_date) setSowingDate(f.sowing_date.split('T')[0]);
          if (f.address) setFarmLocation(f.address);

          const loadedFarm: FarmDetails = {
            id: String(f.id),
            userId: authUser.id,
            landArea: Number(f.area_acres || 0),
            landUnit: 'Acres',
            soilType: f.soil_type || 'Black Soil',
            irrigationType: f.irrigation || 'Drip',
            cropSeason: f.crop_season || 'Kharif',
            previousCrop: f.previous_crop || '',
            farmLocation: { address: f.address || f.name || 'Main Farm Plot' },
            farmImages: [],
            updatedAt: f.sowing_date || new Date().toISOString().split('T')[0],
          };
          onUpdateFarm(loadedFarm);
        }
      } catch (err: any) {
        console.error('Note loading farm record from Supabase:', err);
      }
    };

    loadFarmRecord();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFarmImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFarmImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);
    setErrorMsg('');

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Supabase auth session error:', authError);
        setErrorMsg(authError?.message || 'Please log in to save farm details.');
        setIsLoading(false);
        return;
      }

      // Format sowing_date strictly as YYYY-MM-DD
      const formattedSowingDate = sowingDate
        ? sowingDate.split('T')[0]
        : new Date().toISOString().split('T')[0];

      // Exact table columns:
      // farmer_id, name, crop, crop_variety, area_acres, soil_type, irrigation,
      // crop_season, previous_crop, sowing_date, address.
      // Do not send any field that is not in this list.
      const farmPayload = {
        farmer_id: user.id,
        name: farmName.trim() || 'My Farm',
        crop: crop.trim(),
        crop_variety: cropVariety.trim(),
        area_acres: Number(landArea) || 0,
        soil_type: soilType,
        irrigation: irrigationType,
        crop_season: cropSeason,
        previous_crop: previousCrop.trim(),
        sowing_date: formattedSowingDate,
        address: farmLocation.trim(),
      };

      console.log('Inserting into farms table:', farmPayload);

      // Direct Supabase insert (no /api/farms or in-memory storage)
      const { data, error } = await supabase
        .from('farms')
        .insert(farmPayload)
        .select();

      if (error) {
        console.error('Failed to save farm details to Supabase (full error):', error);
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      // Success: show success only when Supabase returns no error
      setIsLoading(false);
      setIsSaved(true);
      setErrorMsg('');

      const updatedFarm: FarmDetails = {
        ...(farm || {}),
        id: data?.[0]?.id ? String(data[0].id) : `farm-${user.id}`,
        userId: user.id,
        landArea: farmPayload.area_acres,
        landUnit: 'Acres',
        soilType: farmPayload.soil_type as any,
        irrigationType: farmPayload.irrigation as any,
        cropSeason: farmPayload.crop_season as any,
        previousCrop: farmPayload.previous_crop,
        farmLocation: { address: farmPayload.address || farmPayload.name },
        farmImages,
        updatedAt: farmPayload.sowing_date,
      };

      onUpdateFarm(updatedFarm);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err: any) {
      setIsLoading(false);
      console.error('Unexpected error saving farm (full error):', err);
      setErrorMsg(err?.message || 'Error occurred while saving farm details.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Land Area</div>
            <div className="text-xl font-bold font-mono text-emerald-900">
              {landArea} <span className="text-xs font-sans text-slate-600">Acres</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Soil Classification</div>
            <div className="text-sm font-bold text-slate-800">{soilType}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-sky-100 text-sky-800 rounded-xl">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Irrigation System</div>
            <div className="text-sm font-bold text-slate-800">{irrigationType}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Crop & Season</div>
            <div className="text-sm font-bold text-slate-800">
              {crop} ({cropSeason})
            </div>
          </div>
        </div>
      </div>

      {/* Farm Edit Form & Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 sm:p-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">My Farm Details & Mapping</h2>
            <p className="text-xs text-slate-500">Persisted directly to Supabase farms table for verified farmer account</p>
          </div>
          {isSaved && (
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center space-x-1 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved to Supabase!</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Farm Name (farm_name) *</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g. Green Valley Farm"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Crop (crop) *</label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Tomato"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-semibold text-emerald-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Crop Variety (crop_variety)</label>
              <input
                type="text"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                placeholder="e.g. Arka Rakshak"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Land Area (Acres) *</label>
              <input
                type="number"
                step="0.1"
                value={landArea}
                onChange={(e) => setLandArea(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold text-emerald-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Soil Type *</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="Black Soil">Black Soil (Deep Regur)</option>
                <option value="Red Soil">Red Soil (Chalka)</option>
                <option value="Alluvial Soil">Alluvial Soil (Delta)</option>
                <option value="Clay Soil">Clay Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Irrigation Source *</label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler Irrigation</option>
                <option value="Canal/Borewell">Canal / Borewell</option>
                <option value="Rainfed">Rainfed (Dryland)</option>
                <option value="Tubewell">Tubewell / Pump Set</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Crop Season *</label>
              <select
                value={cropSeason}
                onChange={(e) => setCropSeason(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
                <option value="Perennial">Perennial (Annual)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Previous Season Crop *</label>
              <input
                type="text"
                value={previousCrop}
                onChange={(e) => setPreviousCrop(e.target.value)}
                placeholder="e.g. Paddy (Rice)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Sowing Date (sowing_date) *</label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-semibold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Farm Survey / Plot Address</label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder="Survey No, Village name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Farm Photos Gallery Uploader */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Farm Plot Images & Soil Photos
              </label>
              <label className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Photos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {farmImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100"
                >
                  <img src={img} alt={`Farm ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-200 transition-all flex items-center space-x-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving to Supabase...' : 'Save Farm Details to Supabase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
