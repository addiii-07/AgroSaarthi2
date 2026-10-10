import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Lock,
  User as UserIcon,
  MapPin,
  Sprout,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Building,
} from 'lucide-react';
import { DISTRICTS, CROPS, INDIAN_STATES } from '../data/mockData';
import { User, Language, UserRole } from '../types';
import {
  supabase,
  SUPABASE_URL,
  saveFarmerToSupabase,
  saveFarmToSupabase,
  fetchFarmerProfileFromSupabase,
} from '../lib/supabase';

function formatAuthErrorMessage(error: any): string {
  if (!error) return 'Authentication request failed.';
  if (typeof error === 'string') return error;
  return error.message || error.error_description || 'Authentication request failed.';
}

interface AuthModalProps {
  isOpen?: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess?: (user: User) => void;
  onLoginSuccess?: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = true,
  initialMode = 'register',
  onClose,
  onSuccess,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode || 'register');

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const notifySuccess = (user: User) => {
    if (onSuccess) onSuccess(user);
    if (onLoginSuccess) onLoginSuccess(user);
  };

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [mobile, setMobile] = useState('');
  const [state, setState] = useState('Telangana');
  const [district, setDistrict] = useState('Rangareddy');
  const [villageMandal, setVillageMandal] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('Tomato');
  const [cropVariety, setCropVariety] = useState('Arka Rakshak (Hybrid)');
  const [landSize, setLandSize] = useState('2.0');
  const [landUnit, setLandUnit] = useState('Acres');
  const [irrigationType, setIrrigationType] = useState('Drip Irrigation');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('te');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Return null ONLY if explicitly passed as false
  if (isOpen === false) return null;

  const handleSendOtp = () => {
    if (!mobile || mobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setSuccessMsg('OTP requested for +91 ' + mobile + '.');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Full Name is required');
      return;
    }
    if (!mobile || mobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!villageMandal.trim()) {
      setErrorMsg('Village / Mandal is required');
      return;
    }
    if (!landSize || isNaN(Number(landSize)) || Number(landSize) <= 0) {
      setErrorMsg('Please enter a valid land size');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must agree to the Terms & Conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Use explicit email or supported mobile account identifier
      const authEmail = emailInput.trim() || `${mobile.trim()}@agrosaarthi.farm`;

      // 1. Real Supabase Auth Sign Up
      // Pass ALL form fields in signUp metadata with full_name (not name)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: mobile,
            state: state || 'Telangana',
            district,
            village: villageMandal,
            language: preferredLanguage,
            role,
            primaryCrop,
            cropVariety,
            farmSize: `${landSize} ${landUnit}`,
            landArea: Number(landSize),
            landUnit,
            irrigationType,
          },
        },
      });

      if (authError) {
        setIsLoading(false);
        setErrorMsg(formatAuthErrorMessage(authError));
        return;
      }

      const authUser = authData.user;
      if (!authUser) {
        setIsLoading(false);
        setErrorMsg('Registration failed: No user returned from authentication service.');
        return;
      }

      // 2. Persist farmer record directly to public.farmers table using session user.id
      // Exactly columns: id, full_name, phone, state, district, village, language
      const farmerRecordToSave = {
        id: authUser.id,
        full_name: fullName,
        phone: mobile,
        state: state || 'Telangana',
        district,
        village: villageMandal,
        language: preferredLanguage,
      };

      // 3. Before saving, console.log the exact object being sent
      console.log('Register: upserting into farmers table:', farmerRecordToSave);

      const { error: farmerError } = await supabase.from('farmers').upsert(farmerRecordToSave);

      if (farmerError) {
        console.error('Failed to save profile to Supabase during registration:', farmerError);
        setIsLoading(false);
        setErrorMsg(farmerError.message);
        return;
      }

      // 3. Persist initial farm record to public.farms table with exact columns:
      // farmer_id, name, crop, crop_variety, area_acres, soil_type, irrigation, crop_season, previous_crop, sowing_date, address
      const initialFarmPayload = {
        farmer_id: authUser.id,
        name: `${fullName}'s Farm`,
        crop: primaryCrop,
        crop_variety: cropVariety || 'Default Hybrid',
        area_acres: Number(landSize) || 0,
        soil_type: 'Black Soil',
        irrigation: irrigationType,
        crop_season: 'Kharif',
        previous_crop: 'None',
        sowing_date: new Date().toISOString().split('T')[0],
        address: `${villageMandal}, ${district}`,
      };

      console.log('Register: inserting into farms table:', initialFarmPayload);

      const { error: farmError } = await supabase.from('farms').insert(initialFarmPayload);

      if (farmError) {
        console.error('Failed to save farm details to Supabase during registration:', farmError);
        setIsLoading(false);
        setErrorMsg(farmError.message);
        return;
      }

      const appUser: User = {
        id: authUser.id,
        name: fullName,
        fullName,
        full_name: fullName,
        phone: mobile,
        mobile,
        role,
        district,
        village: villageMandal,
        villageMandal,
        crop: primaryCrop,
        primaryCrop,
        crop_variety: cropVariety,
        farm_size: `${landSize} ${landUnit}`,
        farmSize: `${landSize} ${landUnit}`,
        irrigation_type: irrigationType,
        language: preferredLanguage,
        preferredLanguage,
        state: state || 'Telangana',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setIsLoading(false);
      setSuccessMsg('Account registered and saved successfully!');
      setTimeout(() => {
        notifySuccess(appUser);
        onClose();
      }, 600);
    } catch (err: any) {
      setIsLoading(false);
      console.error('Registration exception:', err);
      setErrorMsg(formatAuthErrorMessage(err));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!mobile) {
      setErrorMsg('Please enter your registered mobile number or email.');
      return;
    }

    setIsLoading(true);

    try {
      const email = mobile.includes('@') ? mobile.trim() : `${mobile.trim().replace(/\D/g, '')}@agrosaarthi.farm`;
      let authUser: any = null;

      if (isOtpMode) {
        if (!otpCode || otpCode.trim().length < 4) {
          setIsLoading(false);
          setErrorMsg('Please enter the 4-digit verification code.');
          return;
        }
        const { data: otpData, error: otpErr } = await supabase.auth.verifyOtp({
          email,
          token: otpCode.trim(),
          type: 'email',
        });
        if (otpErr) {
          setIsLoading(false);
          setErrorMsg(formatAuthErrorMessage(otpErr));
          return;
        }
        authUser = otpData?.user;
      } else {
        if (!password) {
          setIsLoading(false);
          setErrorMsg('Please enter your password.');
          return;
        }
        // 1. Authenticate with Supabase Auth using email/password
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInErr) {
          setIsLoading(false);
          setErrorMsg(formatAuthErrorMessage(signInErr));
          return;
        }
        authUser = signInData?.user;
      }

      if (!authUser) {
        setIsLoading(false);
        setErrorMsg('Authentication failed: No user returned.');
        return;
      }

      // 4. After login, load the farmers row and show these values in the profile
      const { data: farmerData, error: farmerErr } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', authUser.id)
        .limit(1);

      if (farmerErr) {
        console.error('Error fetching farmer profile from Supabase:', farmerErr.message);
      }

      const farmerProfile = farmerData && farmerData.length > 0 ? farmerData[0] : null;
      console.log('Login: loaded farmer row from Supabase farmers table:', farmerProfile);

      const { data: farmsData, error: farmsErr } = await supabase
        .from('farms')
        .select('*')
        .eq('farmer_id', authUser.id)
        .order('id', { ascending: false })
        .limit(1);

      if (farmsErr) {
        console.error('Error fetching farm details from Supabase:', farmsErr.message);
      }

      const farm = farmsData && farmsData.length > 0 ? farmsData[0] : null;
      const meta = authUser.user_metadata || {};

      const resolvedFullName =
        farmerProfile?.full_name || farmerProfile?.name || meta.full_name || meta.fullName || meta.name || 'Farmer';
      const resolvedPhone =
        farmerProfile?.phone || meta.phone || meta.mobile || mobile;
      const resolvedState =
        farmerProfile?.state || meta.state || 'Telangana';
      const resolvedDistrict =
        farmerProfile?.district || meta.district || district;
      const resolvedVillage =
        farmerProfile?.village || meta.village || meta.villageMandal || '';
      const resolvedLanguage =
        farmerProfile?.language || meta.language || preferredLanguage;

      const appUser: User = {
        id: authUser.id,
        name: resolvedFullName,
        fullName: resolvedFullName,
        full_name: resolvedFullName,
        phone: resolvedPhone,
        mobile: resolvedPhone,
        role: meta.role || 'farmer',
        district: resolvedDistrict,
        village: resolvedVillage,
        villageMandal: resolvedVillage,
        crop: farm?.crop || meta.crop || meta.primaryCrop || '',
        primaryCrop: farm?.crop || meta.crop || meta.primaryCrop || '',
        farm_size: farm?.area_acres != null ? `${farm.area_acres} Acres` : '',
        farmSize: farm?.area_acres != null ? `${farm.area_acres} Acres` : '',
        soil_type: farm?.soil_type || '',
        soilType: farm?.soil_type || '',
        irrigation_type: farm?.irrigation || '',
        irrigationType: farm?.irrigation || '',
        sowing_date: farm?.sowing_date || '',
        sowingDate: farm?.sowing_date || '',
        language: resolvedLanguage,
        preferredLanguage: resolvedLanguage as Language,
        state: resolvedState,
        createdAt: authUser.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      };

      setIsLoading(false);
      setSuccessMsg('Login successful!');
      setTimeout(() => {
        notifySuccess(appUser);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(formatAuthErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-emerald-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 mb-2">
            <Sprout className="w-7 h-7 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            {mode === 'register' ? 'Join Agrosaarthi' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'register'
              ? 'Create your free account to access AI crop tools & schemes'
              : 'Sign in with your mobile number to manage your farm'}
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            {/* User Role Selection */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select User Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    role === 'farmer'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🌾 Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('officer')}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    role === 'officer'
                      ? 'bg-sky-600 text-white border-sky-600 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🏛️ Govt Officer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    role === 'admin'
                      ? 'bg-amber-600 text-white border-amber-600 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chowdary"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Mobile Number & OTP Verification UI */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mobile Number (10 digits) *
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-mono"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl whitespace-nowrap transition-colors"
                >
                  {otpSent ? 'Resend OTP' : 'Verify OTP'}
                </button>
              </div>
            </div>

            {/* OTP Code Box if OTP sent */}
            {otpSent && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-amber-900">Enter 4-Digit OTP Code</span>
                  <span className="text-[10px] text-amber-700 font-mono">Demo OTP: 1234</span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono py-1 rounded-lg border border-amber-300 bg-white"
                />
              </div>
            )}

            {/* State & District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">State *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Village / Mandal */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Village / Mandal *</label>
              <input
                type="text"
                placeholder="e.g. Shamshabad Mandal"
                value={villageMandal}
                onChange={(e) => setVillageMandal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                required
              />
            </div>

            {/* Crop & Crop Variety */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary Crop *</label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Crop Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Arka Rakshak / Hybrid"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Land Size & Unit + Irrigation */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Land Size *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="2.0"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Land Unit</label>
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  <option value="Acres">Acres</option>
                  <option value="Guntas">Guntas</option>
                  <option value="Bigha">Bigha</option>
                  <option value="Hectares">Hectares</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Irrigation</label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  <option value="Drip Irrigation">Drip</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Canal / Flood">Canal / Flood</option>
                  <option value="Borewell / Tube Well">Borewell</option>
                  <option value="Rainfed">Rainfed</option>
                </select>
              </div>
            </div>

            {/* Email (Optional) & Preferred Language */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="farmer@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-semibold text-emerald-800"
                >
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Confirm Password *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <label htmlFor="terms" className="text-slate-600 cursor-pointer">
                I agree to the <span className="text-emerald-700 font-semibold underline">Terms & Conditions</span> and Privacy Policy.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? 'Creating Account...' : 'Register as Farmer'}
            </button>

            {/* Toggle to Login */}
            <div className="text-center pt-2 text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Sign In Here
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {/* Login Method Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setIsOtpMode(false)}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  !isOtpMode ? 'bg-white text-emerald-800 shadow' : 'text-slate-600'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOtpMode(true);
                  if (!otpSent) handleSendOtp();
                }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  isOtpMode ? 'bg-white text-emerald-800 shadow' : 'text-slate-600'
                }`}
              >
                OTP Login
              </button>
            </div>

            {/* Mobile / Email Login Identifier */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Registered Mobile Number or Email *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or farmer@example.com"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-sm"
                  required
                />
              </div>
            </div>

            {!isOtpMode ? (
              /* Password Field */
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              /* OTP Field */
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-amber-900">Enter 4-Digit OTP Code</span>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] text-amber-800 underline font-bold"
                  >
                    Resend Code
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-xl font-mono py-2 rounded-xl border border-amber-300 bg-white"
                />
              </div>
            )}

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-600">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => setSuccessMsg('Password reset link sent to registered mobile via SMS.')}
                className="text-emerald-700 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>

            {/* Switch to Register */}
            <div className="text-center pt-2 text-slate-500">
              New to AgroSarathi?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Create Account Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
