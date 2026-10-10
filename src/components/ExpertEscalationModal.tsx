import React, { useState } from 'react';
import { User, ExpertQuery } from '../types';
import {
  X,
  HelpCircle,
  Camera,
  Send,
  CheckCircle,
  Clock,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface ExpertEscalationModalProps {
  user: User;
  onClose: () => void;
}

export const ExpertEscalationModal: React.FC<ExpertEscalationModalProps> = ({
  user,
  onClose,
}) => {
  const [crop, setCrop] = useState(user.crop || 'Tomato');
  const [category, setCategory] = useState('Pest / Disease Unidentified');
  const [location, setLocation] = useState(`${user.village || 'Shamshabad'}, ${user.district || 'Rangareddy'}`);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [existingQueries, setExistingQueries] = useState<ExpertQuery[]>([
    {
      id: 'eq-1',
      farmerId: user.id,
      farmerName: user.name || user.fullName,
      crop: 'Tomato',
      category: 'Blossom Drop & Petiole Browning',
      description: 'Noticed flower drop on 30% of plants after two cloudy humid days. No visible caterpillar pests.',
      location: 'Shamshabad, Rangareddy',
      status: 'Resolved',
      createdAt: '2 days ago',
      expertName: 'Dr. K. Srinivas (Senior Horticulturist, PJTSAU)',
      response:
        'Induced by sudden calcium mobility drop under overcast high-humidity conditions. Recommended applying 1g/L Boron with calcium nitrate foliar spray early morning. Withhold nitrogen fertigation.',
    },
  ]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newQuery: ExpertQuery = {
      id: `eq-${Date.now()}`,
      farmerId: user.id,
      farmerName: user.name || user.fullName,
      crop,
      category,
      description,
      location,
      photoUrl: photoUrl || undefined,
      status: 'Under Review',
      createdAt: 'Just now',
      expertName: 'Assigned to Mandal Extension Officer (MAO Shamshabad)',
      response: 'Your query and field telemetry are currently being reviewed by the district plant pathology wing. Expected response within 4 hours.',
    };

    setExistingQueries([newQuery, ...existingQueries]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      setPhotoUrl(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <HelpCircle className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Escalate to Agricultural Expert
            </h2>
            <p className="text-xs text-slate-500">
              Direct consultation with certified horticultural scientists and Mandal Agricultural Officers (MAO).
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {isSubmitted && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-bold">Query submitted successfully! Assigned to District Expert Officer.</span>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Crop</label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Pest / Disease Unidentified">Pest / Disease Unidentified</option>
                <option value="Leaf Yellowing / Nutrient Deficiency">Leaf Yellowing / Nutrient Deficiency</option>
                <option value="Flower Drop / Fruit Setting Failure">Flower Drop / Fruit Setting Failure</option>
                <option value="Root Rot / Waterlogging Damage">Root Rot / Waterlogging Damage</option>
                <option value="Pesticide Dosage Verification">Pesticide Dosage Verification</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Farm Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Describe the Problem & Visual Symptoms
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Lower leaves showing circular brown rings, plants wilting after heavy rain..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              required
            />
          </div>

          {/* Photo Attachment */}
          <div className="flex items-center gap-4">
            <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer text-slate-700 font-bold flex items-center gap-2 border border-slate-200">
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Attach Leaf / Pest Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            {photoUrl && (
              <div className="flex items-center gap-2">
                <img src={photoUrl} alt="Preview" className="w-10 h-10 rounded-lg object-cover border" />
                <span className="text-[11px] text-emerald-700 font-semibold">Photo attached</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit to Agricultural Extension Officer</span>
            </button>
          </div>
        </form>

        {/* Existing / Previous Consultations */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Previous Consultations & Expert Replies
          </h3>

          <div className="space-y-3">
            {existingQueries.map((q) => (
              <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{q.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({q.crop})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] italic">"{q.description}"</p>

                {q.response && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{q.expertName}</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">{q.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
