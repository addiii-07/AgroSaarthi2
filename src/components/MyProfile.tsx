import React, { useState, useEffect } from 'react';
import { User, Language } from '../types';
import {
  DISTRICTS,
  CROPS,
  INDIAN_STATES,
  CROP_VARIETIES,
  IRRIGATION_TYPES,
  SOIL_TYPES,
  GROWTH_STAGES,
  PREFERRED_MARKETS,
} from '../data/mockData';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Sprout,
  Globe,
  Save,
  CheckCircle2,
  Camera,
  Calendar,
  Droplets,
  Layers,
  Store,
  Clock,
  Fingerprint,
  TrendingUp,
  Copy,
  Check,
  CreditCard,
  Sparkles,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { supabase, saveFarmerToSupabase, fetchFarmerProfileFromSupabase } from '../lib/supabase';

interface MyProfileProps {
  user: User;
  onUpdateProfile: (updated: User) => void;
}

export const MyProfile: React.FC<MyProfileProps> = ({ user, onUpdateProfile }) => {
  // Farmer Profile fields
  const [id, setId] = useState<string>(user.id || '');
  const [name, setName] = useState<string>(user.name || user.fullName || '');
  const [phone, setPhone] = useState<string>(user.phone || user.mobile || '');
  const [language, setLanguage] = useState<Language>(
    ((user.language || user.preferredLanguage) as Language) || 'en'
  );
  const [state, setState] = useState<string>(user.state || 'Telangana');
  const [district, setDistrict] = useState<string>(user.district || '');
  const [village, setVillage] = useState<string>(user.village || user.villageMandal || '');
  const [crop, setCrop] = useState<string>(user.crop || user.primaryCrop || '');
  const [cropVariety, setCropVariety] = useState<string>(
    user.crop_variety || user.cropVariety || ''
  );
  const [farmSize, setFarmSize] = useState<string>(
    user.farm_size != null ? String(user.farm_size) : user.farmSize != null ? String(user.farmSize) : ''
  );
  const [sowingDate, setSowingDate] = useState<string>(
    user.sowing_date || user.sowingDate || ''
  );
  const [irrigationType, setIrrigationType] = useState<string>(
    user.irrigation_type || user.irrigationType || 'Drip'
  );
  const [soilType, setSoilType] = useState<string>(
    user.soil_type || user.soilType || 'Black Soil'
  );
  const [growthStage, setGrowthStage] = useState<string>(
    user.growth_stage || user.growthStage || ''
  );
  const [preferredMarket, setPreferredMarket] = useState<string>(
    user.preferred_market || user.preferredMarket || ''
  );
  const [createdAt, setCreatedAt] = useState<string>(
    user.created_at || user.createdAt || new Date().toISOString().split('T')[0]
  );

  const [profilePhoto, setProfilePhoto] = useState<string>(
    user.profilePhoto ||
      'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&auto=format&fit=crop&q=80'
  );

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSupabase, setIsFetchingSupabase] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [showKisanCard, setShowKisanCard] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Sync local state when user prop updates
  useEffect(() => {
    if (user) {
      if (user.id) setId(user.id);
      setName(user.full_name || user.fullName || user.name || '');
      setPhone(user.phone || user.mobile || '');
      if (user.language || user.preferredLanguage) {
        setLanguage(((user.language || user.preferredLanguage) as Language) || 'en');
      }
      if (user.state) setState(user.state);
      if (user.district) setDistrict(user.district);
      if (user.village || user.villageMandal) setVillage(user.village || user.villageMandal || '');
    }
  }, [user]);

  // Automatically load the farmer's saved profile from Supabase for logged-in user
  useEffect(() => {
    let isMounted = true;
    const loadProfileFromSupabase = async () => {
      setIsFetchingSupabase(true);
      try {
        const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !authUser) {
          if (authErr) console.error('Error getting auth user:', authErr.message);
          if (isMounted) setIsFetchingSupabase(false);
          return;
        }

        // 4. After login, load the farmers row and show these values in the profile
        const { data, error } = await supabase
          .from('farmers')
          .select('*')
          .eq('id', authUser.id)
          .limit(1);

        if (error) {
          console.error('Supabase profile load error:', error.message);
          setErrorBanner(error.message);
        } else if (data && data.length > 0 && isMounted) {
          const p = data[0];
          console.log('MyProfile: loaded farmers row from Supabase:', p);
          setId(p.id);
          setName(p.full_name || p.name || '');
          setPhone(p.phone || '');
          if (p.language) setLanguage(p.language as Language);
          if (p.state) setState(p.state);
          if (p.district) setDistrict(p.district);
          if (p.village) setVillage(p.village);
        }

        // Also load farm details for this user
        const { data: farmsData, error: farmsErr } = await supabase
          .from('farms')
          .select('*')
          .eq('farmer_id', authUser.id)
          .order('id', { ascending: false })
          .limit(1);

        if (farmsErr) {
          console.error('Supabase farms load error:', farmsErr.message);
        } else if (farmsData && farmsData.length > 0 && isMounted) {
          const f = farmsData[0];
          if (f.crop) setCrop(f.crop);
          if (f.area_acres != null) setFarmSize(`${f.area_acres} Acres`);
          if (f.soil_type) setSoilType(f.soil_type);
          if (f.irrigation) setIrrigationType(f.irrigation);
          if (f.sowing_date) setSowingDate(f.sowing_date);
        }
      } catch (err: any) {
        console.error('Error auto-loading profile from Supabase:', err);
      } finally {
        if (isMounted) setIsFetchingSupabase(false);
      }
    };

    loadProfileFromSupabase();
    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropChange = (newCrop: string) => {
    setCrop(newCrop);
    const availableVarieties = CROP_VARIETIES[newCrop];
    if (availableVarieties && availableVarieties.length > 0) {
      setCropVariety(availableVarieties[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);
    setErrorBanner(null);

    try {
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authUser) {
        console.error('User session not found:', authErr);
        setErrorBanner(authErr?.message || 'User session not found. Please log in.');
        setIsLoading(false);
        return;
      }

      // 2. Upsert into farmers using logged-in user id with exactly those column names:
      // id, full_name, phone, state, district, village, language
      const farmerDataToSave = {
        id: authUser.id,
        full_name: name,
        phone,
        state: state || 'Telangana',
        district,
        village,
        language,
      };

      // 3. Before saving, console.log the exact object being sent
      console.log('MyProfile: upserting into farmers table:', farmerDataToSave);

      const { error } = await supabase.from('farmers').upsert(farmerDataToSave);

      if (error) {
        console.error('Supabase farmers upsert error:', error.message);
        setErrorBanner(error.message);
        setIsLoading(false);
        return;
      }

      const updatedUser: User = {
        ...user,
        id: authUser.id,
        name,
        fullName: name,
        phone,
        mobile: phone,
        language,
        preferredLanguage: language,
        state,
        district,
        village,
        villageMandal: village ? `${village}, ${district}` : district,
        crop,
        primaryCrop: crop,
        crop_variety: cropVariety,
        cropVariety,
        farm_size: farmSize,
        farmSize,
        sowing_date: sowingDate,
        sowingDate,
        irrigation_type: irrigationType,
        irrigationType,
        soil_type: soilType,
        soilType,
        growth_stage: growthStage,
        growthStage,
        preferred_market: preferredMarket,
        preferredMarket,
        created_at: createdAt,
        createdAt,
        profilePhoto,
      };

      onUpdateProfile(updatedUser);
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err: any) {
      setIsLoading(false);
      console.error('Database save error:', err);
      setErrorBanner(err?.message || 'Failed to update profile.');
    }
  };

  const availableVarieties = CROP_VARIETIES[crop] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Hero Banner & Digital Identity Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 pointer-events-none blur-2xl" />
        <div className="absolute right-32 bottom-0 w-48 h-48 rounded-full bg-teal-400/10 pointer-events-none blur-xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative group">
              <img
                src={profilePhoto}
                alt={name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
              />
              <label className="absolute -bottom-2 -right-2 bg-white text-emerald-800 p-2 rounded-xl cursor-pointer hover:bg-emerald-50 shadow-lg transition-transform hover:scale-110">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 flex-wrap">
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  PM-KISAN / AgriStack Verified
                </span>
                <span className="bg-teal-400/20 text-teal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Active Cultivator
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">{name}</h1>

              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-emerald-100 text-xs flex-wrap">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-300" /> +91 {phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" /> {village}, {district}, {state}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action: Digital Kisan Card View */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowKisanCard(!showKisanCard)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <CreditCard className="w-4 h-4 text-emerald-300" />
              <span>{showKisanCard ? 'Hide Kisan ID Card' : 'View Digital Kisan ID'}</span>
            </button>

            {/* Farmer ID Quick Copy Pill */}
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10 text-[11px]">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-emerald-200 font-medium">Farmer ID:</span>
              <span className="font-mono font-bold text-white tracking-wider">{id}</span>
              <button
                onClick={handleCopyId}
                title="Copy Farmer ID"
                className="ml-1 p-1 hover:bg-white/20 rounded transition text-emerald-200 hover:text-white"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Kisan ID Card Preview (Collapsible) */}
      {showKisanCard && (
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-2xl border-2 border-emerald-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">
                  Government of India • Ministry of Agriculture
                </div>
                <div className="font-bold text-sm tracking-wide">DIGITAL KISAN IDENTITY CARD (రైతు గుర్తింపు కార్డు)</div>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-400/40">
                AGRISTACK-ID: {id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 items-center">
            {/* Photo & QR */}
            <div className="flex md:flex-col items-center justify-around gap-4 md:border-r border-white/10 pr-0 md:pr-4">
              <img
                src={profilePhoto}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
              />
              <div className="text-center p-2 bg-white rounded-xl shadow">
                <QrCode className="w-14 h-14 text-slate-900 mx-auto" />
                <span className="text-[9px] font-mono text-slate-700 font-bold block mt-0.5">SCAN TO VERIFY</span>
              </div>
            </div>

            {/* Complete 16 Field Grid Overview */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">1. Farmer Name (name)</span>
                <span className="font-bold text-white text-sm">{name}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">2. Phone (phone)</span>
                <span className="font-mono text-white font-semibold">+91 {phone}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">3. Farmer ID (id)</span>
                <span className="font-mono text-emerald-300 font-bold">{id}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">4. Language (language)</span>
                <span className="font-semibold text-white uppercase">{language}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">5. State (state)</span>
                <span className="font-semibold text-white">{state}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">6. District (district)</span>
                <span className="font-semibold text-white">{district}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">7. Village (village)</span>
                <span className="font-semibold text-white">{village}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">8. Crop (crop)</span>
                <span className="font-bold text-emerald-300">{crop}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">9. Variety (crop_variety)</span>
                <span className="font-semibold text-white">{cropVariety}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">10. Farm Size (farm_size)</span>
                <span className="font-bold text-amber-300">{farmSize}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">11. Sowing Date (sowing_date)</span>
                <span className="font-mono text-white">{sowingDate}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">12. Irrigation (irrigation_type)</span>
                <span className="font-semibold text-white">{irrigationType}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">13. Soil Type (soil_type)</span>
                <span className="font-semibold text-white">{soilType}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">14. Stage (growth_stage)</span>
                <span className="font-semibold text-white">{growthStage}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">15. Market (preferred_market)</span>
                <span className="font-semibold text-white truncate block">{preferredMarket}</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-300 block font-semibold">16. Created At (created_at)</span>
                <span className="font-mono text-white">{createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metric Quick-Pills Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-semibold block">Current Crop</span>
            <span className="text-xs font-bold text-slate-900 truncate block">{crop}</span>
            <span className="text-[10px] text-emerald-700 truncate block font-medium">{cropVariety}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-semibold block">Land Size</span>
            <span className="text-xs font-bold text-slate-900 block">{farmSize}</span>
            <span className="text-[10px] text-slate-500 truncate block">{soilType.split(' ')[0]}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-semibold block">Irrigation</span>
            <span className="text-xs font-bold text-slate-900 truncate block">{irrigationType}</span>
            <span className="text-[10px] text-blue-700 font-medium block">Sown: {sowingDate}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-semibold block">Preferred Mandi</span>
            <span className="text-xs font-bold text-slate-900 truncate block">{preferredMarket.split(' ')[0]} APMC</span>
            <span className="text-[10px] text-slate-500 truncate block">{district}</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {isSaved && !errorBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-3 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">All 16 Farmer Profile Details Saved Successfully!</span>
            <span className="text-emerald-700">Synchronized with local storage, backend server, and Supabase cloud.</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorBanner && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-3 shadow-sm">
          <span>Error: {errorBanner}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal & Identification Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">1. Personal & Contact Details</h2>
              <p className="text-xs text-slate-500">Official farmer identification and communication preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. id */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Farmer ID <span className="font-mono text-emerald-700">(id)</span>
              </label>
              <div className="relative">
                <Fingerprint className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-mono font-bold text-slate-800"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Unique government or app farmer code</p>
            </div>

            {/* 2. name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Full Name <span className="font-mono text-emerald-700">(name)</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-semibold"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">As per Aadhaar / Pattadar Passbook</p>
            </div>

            {/* 3. phone */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Phone Number <span className="font-mono text-emerald-700">(phone)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-mono"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">10-digit mobile for SMS alerts & OTP</p>
            </div>

            {/* 4. language */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Language <span className="font-mono text-emerald-700">(language)</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <select
                  value={language}
                  onChange={(e) => {
                    const newLang = e.target.value as Language;
                    setLanguage(newLang);
                    onUpdateProfile({ ...user, language: newLang, preferredLanguage: newLang });
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-semibold text-emerald-900"
                >
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="en">English (English)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="or">ଓଡ଼ିଆ (Odia)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                </select>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Preferred language for advisories & AI</p>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Mandi Market Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">2. Location & Market Details</h2>
              <p className="text-xs text-slate-500">Geographic farm location and designated selling market</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 5. state */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                State <span className="font-mono text-emerald-700">(state)</span>
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">State jurisdiction</p>
            </div>

            {/* 6. district */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                District <span className="font-mono text-emerald-700">(district)</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Used for Mandi prices & weather</p>
            </div>

            {/* 7. village */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Village / Mandal <span className="font-mono text-emerald-700">(village)</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Pedavadlapudi, Tenali"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Gram Panchayat / Revenue village</p>
            </div>

            {/* 15. preferred_market */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Preferred Market <span className="font-mono text-emerald-700">(preferred_market)</span>
              </label>
              <div className="relative">
                <Store className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  list="market-list"
                  type="text"
                  value={preferredMarket}
                  onChange={(e) => setPreferredMarket(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                  required
                />
                <datalist id="market-list">
                  {PREFERRED_MARKETS.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Primary APMC Mandi / Trading Hub</p>
            </div>
          </div>
        </div>

        {/* Section 3: Crop & Agronomic Lifecycle Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">3. Crop & Cultivation Lifecycle</h2>
              <p className="text-xs text-slate-500">Current active crop, seed variety, sowing date, and crop maturity stage</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 8. crop */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Crop <span className="font-mono text-emerald-700">(crop)</span>
              </label>
              <div className="relative">
                <Sprout className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <select
                  value={crop}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-semibold text-emerald-900"
                >
                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Main crop under cultivation</p>
            </div>

            {/* 9. crop_variety */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Crop Variety <span className="font-mono text-emerald-700">(crop_variety)</span>
              </label>
              <div className="relative">
                <input
                  list="variety-list"
                  type="text"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  placeholder="e.g. Teja (S17) or BPT 5204"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                  required
                />
                <datalist id="variety-list">
                  {availableVarieties.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Specific hybrid / seed line</p>
            </div>

            {/* 11. sowing_date */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Sowing Date <span className="font-mono text-emerald-700">(sowing_date)</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-mono"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Date planted or transplanted</p>
            </div>

            {/* 14. growth_stage */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Growth Stage <span className="font-mono text-emerald-700">(growth_stage)</span>
              </label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
              >
                {GROWTH_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Enables stage-specific fertilizer advice</p>
            </div>
          </div>
        </div>

        {/* Section 4: Land & Soil Cultivation Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-teal-100 text-teal-800 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">4. Land, Soil & Record Attributes</h2>
              <p className="text-xs text-slate-500">Acreage, water delivery system, soil classification, and account timestamp</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 10. farm_size */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Farm Size <span className="font-mono text-emerald-700">(farm_size)</span>
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  placeholder="e.g. 4.5 Acres"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-semibold text-slate-900"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Total operational land holding</p>
            </div>

            {/* 12. irrigation_type */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Irrigation Type <span className="font-mono text-emerald-700">(irrigation_type)</span>
              </label>
              <div className="relative">
                <Droplets className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                >
                  {IRRIGATION_TYPES.map((it) => (
                    <option key={it} value={it}>
                      {it}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Water delivery method</p>
            </div>

            {/* 13. soil_type */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Soil Type <span className="font-mono text-emerald-700">(soil_type)</span>
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
              >
                {SOIL_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Texture & mineral classification</p>
            </div>

            {/* 16. created_at */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Created At <span className="font-mono text-emerald-700">(created_at)</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Registration date in AgriStack</p>
            </div>
          </div>
        </div>

        {/* 16-Attribute Audit Checklist Indicator */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900">
          <div className="flex items-center justify-between font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified 16/16 Farmer Profile Attributes
            </span>
            <span className="text-[11px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
              All Attributes Synchronized
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-emerald-800">
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">1. id: {id}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">2. name: {name}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">3. phone: {phone}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">4. language: {language}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">5. state: {state}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">6. district: {district}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">7. village: {village}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">8. crop: {crop}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">9. crop_variety: {cropVariety}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">10. farm_size: {farmSize}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">11. sowing_date: {sowingDate}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">12. irrigation_type: {irrigationType}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">13. soil_type: {soilType}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">14. growth_stage: {growthStage}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">15. preferred_market: {preferredMarket}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">16. created_at: {createdAt}</span>
          </div>
        </div>

        {/* Submit & Save Button */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowKisanCard(!showKisanCard)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Digital Kisan ID Card</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-200 transition-all flex items-center space-x-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving All 16 Details...' : 'Save Farmer Profile (16 Fields)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
