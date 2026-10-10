import React, { useState } from 'react';
import { InsuranceClaim, User } from '../types';
import { CROPS, MOCK_INSURANCE_CLAIMS } from '../data/mockData';
import {
  ShieldCheck,
  AlertTriangle,
  Upload,
  Clock,
  CheckCircle2,
  FileCheck,
  Sparkles,
  Camera,
} from 'lucide-react';

interface CropInsuranceProps {
  currentUser: User | null;
}

export const CropInsurance: React.FC<CropInsuranceProps> = ({ currentUser }) => {
  const [claims, setClaims] = useState<InsuranceClaim[]>(MOCK_INSURANCE_CLAIMS);
  const [activeTab, setActiveTab] = useState<'claimsHistory' | 'fileClaim'>('claimsHistory');

  // File Claim Form State
  const [cropName, setCropName] = useState('Chilli');
  const [landAreaAffected, setLandAreaAffected] = useState(2.5);
  const [damageCause, setDamageCause] = useState<
    'Drought' | 'Excess Rain / Flood' | 'Pest Attack' | 'Cyclone / Hailstorm' | 'Unseasonal Frost'
  >('Excess Rain / Flood');
  const [damageDate, setDamageDate] = useState('2026-08-01');
  const [estimatedLossPercentage, setEstimatedLossPercentage] = useState(60);
  const [claimedAmount, setClaimedAmount] = useState(45000);
  const [damagePhoto, setDamagePhoto] = useState<string>(
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?w=600&auto=format&fit=crop&q=80'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDamagePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/insurance/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: currentUser?.id || 'farmer-1',
          farmerName: currentUser?.fullName || 'Ramesh Chowdary',
          mobile: currentUser?.mobile || '9876543210',
          district: currentUser?.district || 'Guntur',
          cropName,
          landAreaAffected,
          damageCause,
          damageDate,
          estimatedLossPercentage,
          damagePhotos: [damagePhoto],
          claimedAmount,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.claim) {
        setClaims((prev) => [data.claim, ...prev]);
        setSuccessMsg(`Crop Damage Claim Ref #${data.claim.id} logged successfully!`);
        setTimeout(() => {
          setSuccessMsg('');
          setActiveTab('claimsHistory');
        }, 1500);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.warn('Failed to submit insurance claim:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-sky-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-teal-800">
        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-amber-400 text-teal-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> PM Fasal Bima Yojana (PMFBY)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">Crop Insurance & Claim Portal</h1>
        <p className="text-xs sm:text-sm text-teal-100 max-w-2xl mt-1">
          Report crop damage from unseasonal rains, flood, or drought with field photo proof for expedited district inspection and direct bank disbursal.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('claimsHistory')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'claimsHistory'
              ? 'border-teal-600 text-teal-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Claim History & Status ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fileClaim')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'fileClaim'
              ? 'border-teal-600 text-teal-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>File New Damage Claim</span>
        </button>
      </div>

      {/* TAB 1: CLAIMS HISTORY */}
      {activeTab === 'claimsHistory' && (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">Claim ID: #{claim.id}</span>
                  <h3 className="font-bold text-slate-900 text-base">
                    {claim.cropName} Damage ({claim.damageCause})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Affected Area: {claim.landAreaAffected} Acres • Loss: {claim.estimatedLossPercentage}%
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                      claim.status === 'Disbursed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : claim.status === 'Approved' || claim.status === 'Officer Inspected'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {claim.status}
                  </span>
                  <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                    Claimed: ₹{claim.claimedAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Photo & Officer Remarks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Damage Photo Preview */}
                {claim.damagePhotos?.[0] && (
                  <div>
                    <span className="font-semibold text-slate-500 block mb-1">Uploaded Damage Photo:</span>
                    <img
                      src={claim.damagePhotos[0]}
                      alt="Crop Damage"
                      className="w-full h-28 object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}

                {/* Officer Remarks */}
                <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    District Agriculture Officer Report & Remarks
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {claim.officerRemarks || 'Pending physical inspection by Mandal Agriculture Officer.'}
                  </p>
                  {claim.disbursedAmount ? (
                    <div className="font-bold text-emerald-800 text-xs pt-1">
                      ✓ Amount Disbursed via Direct Benefit Transfer: ₹
                      {claim.disbursedAmount.toLocaleString('en-IN')}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: FILE NEW CLAIM FORM */}
      {activeTab === 'fileClaim' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100 max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
            File New Crop Damage Claim (PMFBY)
          </h2>

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Damaged Crop Type *</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-slate-50"
                >
                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Cause of Damage *</label>
                <select
                  value={damageCause}
                  onChange={(e) => setDamageCause(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-slate-50"
                >
                  <option value="Excess Rain / Flood">Excess Rain / Inundation Flood</option>
                  <option value="Drought">Severe Drought / Water Scarcity</option>
                  <option value="Pest Attack">Pest Attack / Disease Epidemic</option>
                  <option value="Cyclone / Hailstorm">Cyclone / Hailstorm / High Winds</option>
                  <option value="Unseasonal Frost">Unseasonal Frost / Thermal Shock</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Land Area Affected (Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={landAreaAffected}
                  onChange={(e) => setLandAreaAffected(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date of Calamity *</label>
                <input
                  type="date"
                  value={damageDate}
                  onChange={(e) => setDamageDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estimated Loss (%) *</label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={estimatedLossPercentage}
                  onChange={(e) => setEstimatedLossPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-slate-50 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estimated Claim Amount (₹) *</label>
                <input
                  type="number"
                  value={claimedAmount}
                  onChange={(e) => setClaimedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-slate-50 font-bold text-teal-800"
                  required
                />
              </div>
            </div>

            {/* Photo Upload Box */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Field Damage Photo Proof *
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={damagePhoto}
                  alt="Damage preview"
                  className="w-28 h-20 object-cover rounded-xl border-2 border-teal-300"
                />
                <label className="px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold rounded-xl cursor-pointer transition-colors flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Upload Field Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow transition-colors"
            >
              {isSubmitting ? 'Filing Claim...' : 'Submit Damage Claim for District Inspection'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
