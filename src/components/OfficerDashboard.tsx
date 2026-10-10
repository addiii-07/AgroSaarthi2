import React, { useState } from 'react';
import { User, GovernmentScheme, Advisory, InsuranceClaim, SchemeApplication } from '../types';
import { MOCK_OFFICER_METRICS, DISTRICTS } from '../data/mockData';
import {
  Building2,
  Users,
  FileCheck,
  AlertTriangle,
  Send,
  CheckCircle2,
  XCircle,
  MapPin,
  Sparkles,
  ShieldAlert,
  Search,
  Filter,
} from 'lucide-react';

interface OfficerDashboardProps {
  user: User;
  schemes: GovernmentScheme[];
  advisories: Advisory[];
  onAdvisoryPublished: (adv: Advisory) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  user,
  schemes,
  advisories,
  onAdvisoryPublished,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'advisory' | 'schemes' | 'claims'>('overview');
  const [selectedDistrict, setSelectedDistrict] = useState(user.district || 'Guntur');

  // Publish Advisory State
  const [advTitle, setAdvTitle] = useState('');
  const [advCategory, setAdvCategory] = useState<'Pest Alert' | 'Weather Warning' | 'Subsidy Announcement' | 'Sowing Guide'>('Pest Alert');
  const [advCrops, setAdvCrops] = useState('Chilli, Paddy, Cotton');
  const [advContent, setAdvContent] = useState('');
  const [advUrgency, setAdvUrgency] = useState<'Normal' | 'High' | 'Critical Emergency'>('High');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Insurance Claims State for Officer Approval
  const [claimsList, setClaimsList] = useState<InsuranceClaim[]>([
    {
      id: 'claim-101',
      farmerId: 'farmer-1',
      farmerName: 'Ramesh Chowdary',
      mobile: '9876543210',
      district: 'Guntur',
      cropName: 'Chilli',
      landAreaAffected: 3.0,
      damageCause: 'Excess Rain / Flood',
      damageDate: '2026-08-02',
      estimatedLossPercentage: 75,
      damagePhotos: [
        'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?w=600&auto=format&fit=crop&q=80',
      ],
      claimedAmount: 60000,
      status: 'Submitted',
    },
    {
      id: 'claim-102',
      farmerId: 'farmer-2',
      farmerName: 'K. Venkateswara Rao',
      mobile: '9123456789',
      district: 'Guntur',
      cropName: 'Paddy (Rice)',
      landAreaAffected: 4.5,
      damageCause: 'Pest Attack',
      damageDate: '2026-07-28',
      estimatedLossPercentage: 50,
      damagePhotos: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
      ],
      claimedAmount: 45000,
      status: 'Submitted',
    },
  ]);

  // Selected claim modal for inspection
  const [inspectingClaim, setInspectingClaim] = useState<InsuranceClaim | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [sanctionedAmount, setSanctionedAmount] = useState<number>(50000);

  const handlePublishAdvisory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advTitle || !advContent) return;

    setIsPublishing(true);
    try {
      const res = await fetch('/api/officer/advisories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: advTitle,
          category: advCategory,
          targetCrops: advCrops.split(',').map((c) => c.trim()),
          district: selectedDistrict,
          content: advContent,
          urgency: advUrgency,
          officerName: user.fullName,
        }),
      });

      const data = await res.json();
      setIsPublishing(false);

      if (res.ok && data.advisory) {
        onAdvisoryPublished(data.advisory);
        setPublishedSuccess(true);
        setAdvTitle('');
        setAdvContent('');
        setTimeout(() => setPublishedSuccess(false), 3000);
      }
    } catch (err) {
      setIsPublishing(false);
      console.warn('Failed to publish advisory:', err);
    }
  };

  const handleApproveClaim = (claimId: string, status: 'Approved' | 'Rejected') => {
    setClaimsList((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: status === 'Approved' ? 'Officer Inspected' : 'Rejected',
              officerRemarks: officerRemarks || 'Inspected by District Agriculture Officer. Verified damage on-site.',
              disbursedAmount: status === 'Approved' ? sanctionedAmount : 0,
            }
          : c
      )
    );
    setInspectingClaim(null);
    setOfficerRemarks('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Agriculture Department Portal
            </span>
            <span className="text-xs text-emerald-200">DAO Officer ID: #{user.id}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Welcome, {user.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            District Agriculture Officer • Managing {selectedDistrict} District Operations
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs shrink-0">
          <label className="block text-[10px] text-emerald-200 font-bold uppercase mb-1">
            District Jurisdiction
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 text-white font-bold text-xs border border-emerald-700"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex space-x-3 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>District Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('advisory')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'advisory'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4 text-sky-600" />
          <span>Publish District Advisory</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'claims'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Crop Damage Claims Inspection ({claimsList.length})</span>
        </button>
      </div>

      {/* TAB 1: DISTRICT OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Registered Farmers</div>
                <div className="text-2xl font-black font-mono text-emerald-900">
                  {MOCK_OFFICER_METRICS.totalFarmers.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
              <div className="p-3 bg-sky-100 text-sky-800 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Active Govt Schemes</div>
                <div className="text-2xl font-black font-mono text-sky-900">
                  {MOCK_OFFICER_METRICS.activeSchemes}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Claims Pending Review</div>
                <div className="text-2xl font-black font-mono text-amber-900">
                  {MOCK_OFFICER_METRICS.pendingClaims}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4">
              <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">District Advisories</div>
                <div className="text-2xl font-black font-mono text-teal-900">
                  {advisories.length}
                </div>
              </div>
            </div>
          </div>

          {/* Active Advisories List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-serif pb-3 border-b border-slate-100">
              Published District Advisories ({selectedDistrict})
            </h3>

            <div className="space-y-3">
              {advisories.map((adv) => (
                <div key={adv.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{adv.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        adv.urgency === 'Critical Emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {adv.urgency}
                    </span>
                  </div>
                  <p className="text-slate-600">{adv.content}</p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">
                    Published: {adv.publishedDate} • Category: {adv.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLISH ADVISORY FORM */}
      {activeTab === 'advisory' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100 max-w-3xl mx-auto space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-serif pb-3 border-b border-slate-100">
            Publish New District Agriculture Advisory
          </h2>

          {publishedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
              Advisory broadcasted to all farmers in {selectedDistrict} District successfully!
            </div>
          )}

          <form onSubmit={handlePublishAdvisory} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Advisory Title *</label>
              <input
                type="text"
                value={advTitle}
                onChange={(e) => setAdvTitle(e.target.value)}
                placeholder="e.g. Urgent Pest Warning: Thrips Outbreak in Chilli Fields"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                <select
                  value={advCategory}
                  onChange={(e) => setAdvCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  <option value="Pest Alert">Pest & Disease Outbreak Alert</option>
                  <option value="Weather Warning">Weather Warning (Rain / Flood)</option>
                  <option value="Subsidy Announcement">Subsidy & Scheme Announcement</option>
                  <option value="Sowing Guide">Crop Sowing & Fertilizer Advisory</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Urgency Level *</label>
                <select
                  value={advUrgency}
                  onChange={(e) => setAdvUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold"
                >
                  <option value="Normal">Normal Advisory</option>
                  <option value="High">High Importance</option>
                  <option value="Critical Emergency">Critical Emergency Alert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Crops (Comma-separated)</label>
              <input
                type="text"
                value={advCrops}
                onChange={(e) => setAdvCrops(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Detailed Message / Dosage Recommendations *</label>
              <textarea
                rows={5}
                value={advContent}
                onChange={(e) => setAdvContent(e.target.value)}
                placeholder="Type advisory instructions for farmers..."
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isPublishing ? 'Broadcasting...' : 'Broadcast Advisory to Farmers'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: DAMAGE CLAIMS INSPECTION */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-serif pb-3 border-b border-slate-100">
            Field Damage Inspection & Claim Sanction Portal
          </h2>

          <div className="space-y-4">
            {claimsList.map((claim) => (
              <div key={claim.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-slate-400 text-[10px]">Claim ID: #{claim.id}</span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {claim.farmerName} • {claim.cropName} ({claim.district})
                    </h3>
                    <p className="text-slate-500">
                      Cause: {claim.damageCause} • Area: {claim.landAreaAffected} Acres • Loss: {claim.estimatedLossPercentage}%
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-emerald-900">
                      Claimed: ₹{claim.claimedAmount.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        claim.status === 'Submitted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  {claim.damagePhotos?.[0] && (
                    <img
                      src={claim.damagePhotos[0]}
                      alt="Crop damage"
                      className="w-24 h-16 object-cover rounded-lg border"
                    />
                  )}

                  <div className="flex-1 space-y-1">
                    <div className="font-semibold text-slate-700">Remarks:</div>
                    <p className="text-slate-600">{claim.officerRemarks || 'Awaiting field officer inspection report.'}</p>
                  </div>

                  {claim.status === 'Submitted' && (
                    <button
                      onClick={() => {
                        setInspectingClaim(claim);
                        setSanctionedAmount(claim.claimedAmount);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-700 shrink-0"
                    >
                      Inspect & Sanction
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLAIM INSPECTION MODAL */}
      {inspectingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs border border-emerald-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Sanction Claim #{inspectingClaim.id}</h3>
              <button
                onClick={() => setInspectingClaim(null)}
                className="text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Farmer:</strong> {inspectingClaim.farmerName} (+91 {inspectingClaim.mobile})
              </p>
              <p>
                <strong>Crop & Loss:</strong> {inspectingClaim.cropName} ({inspectingClaim.estimatedLossPercentage}% loss)
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sanctioned Amount (₹)</label>
                <input
                  type="number"
                  value={sanctionedAmount}
                  onChange={(e) => setSanctionedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Inspection Officer Remarks</label>
                <textarea
                  rows={3}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder="Verified damage on-site..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => handleApproveClaim(inspectingClaim.id, 'Approved')}
                className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
              >
                Approve & Sanction
              </button>
              <button
                onClick={() => handleApproveClaim(inspectingClaim.id, 'Rejected')}
                className="py-2 px-4 bg-rose-100 text-rose-800 font-bold rounded-xl hover:bg-rose-200"
              >
                Reject Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
