import React, { useState } from 'react';
import { DiseaseDetectionResult } from '../types';
import { CROPS } from '../data/mockData';
import {
  Upload,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  FileText,
  Activity,
  Droplets,
  Stethoscope,
} from 'lucide-react';

interface DiseaseDetectionProps {
  language?: string;
}

export const DiseaseDetection: React.FC<DiseaseDetectionProps> = ({ language = 'en' }) => {
  const [selectedCrop, setSelectedCrop] = useState('Chilli');
  const [symptomsDescription, setSymptomsDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?w=600&auto=format&fit=crop&q=80'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);

  const sampleDiseaseImages = [
    {
      title: 'Chilli Leaf Curl & Yellowing',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?w=600&auto=format&fit=crop&q=80',
      crop: 'Chilli',
      symptoms: 'Downward leaf curling with yellowing along veins',
    },
    {
      title: 'Paddy Leaf Spot & Blight',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
      crop: 'Paddy (Rice)',
      symptoms: 'Dark brown elliptical lesions on leaf blades',
    },
    {
      title: 'Cotton Leaf Rust & Wilting',
      url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80',
      crop: 'Cotton',
      symptoms: 'Reddish brown pustules on underside of leaves',
    },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/detect-disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          cropName: selectedCrop,
          symptomsDescription,
          language,
        }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (res.ok && data.result) {
        setResult(data.result);
      }
    } catch (err) {
      console.warn('Error analyzing image with AI:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#1B3022] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-900/80">
        <div className="flex items-center space-x-3 mb-2">
          <span className="bg-[#F27D26] text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Stethoscope className="w-3.5 h-3.5" /> AI Plant Doctor
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Crop Disease Detection</h1>
        <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl mt-1">
          Upload a clear photo of your affected crop leaf or stem. Our AI vision model detects pests, fungal infections, and nutrient deficiencies with instant treatment plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-rose-600" />
            Upload Affected Crop Photo
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Crop Type</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 bg-slate-50 font-semibold text-slate-800"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Drag and Drop / Upload Box */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Crop Leaf / Stem Image *</label>
              <div className="relative border-2 border-dashed border-rose-200 rounded-2xl p-4 text-center bg-rose-50/30 hover:bg-rose-50/60 transition-colors cursor-pointer group">
                {imagePreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <label className="absolute bottom-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer hover:bg-rose-700 shadow">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="block cursor-pointer py-6">
                    <Upload className="w-10 h-10 text-rose-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-700">Click to upload crop image</span>
                    <span className="block text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div>
              <label className="block text-slate-600 font-medium mb-1.5 text-[11px]">
                Or click sample diseased leaf to test:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sampleDiseaseImages.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImagePreview(sample.url);
                      setSelectedCrop(sample.crop);
                      setSymptomsDescription(sample.symptoms);
                    }}
                    className="p-1 rounded-xl border border-slate-200 hover:border-rose-400 overflow-hidden text-left bg-slate-50 transition-all hover:shadow-sm"
                  >
                    <img src={sample.url} alt={sample.title} className="w-full h-12 object-cover rounded-lg" />
                    <div className="text-[9px] font-bold truncate text-slate-700 mt-1 px-0.5">{sample.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Observed Symptoms (Optional)</label>
              <textarea
                rows={2}
                value={symptomsDescription}
                onChange={(e) => setSymptomsDescription(e.target.value)}
                placeholder="e.g. Yellow leaves, dark spots, curling, wilting"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 bg-slate-50"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !imagePreview}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Diagnosing Crop Pathology with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyze Crop & Get Treatment Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Diagnosis Output Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-6">
              {/* Diagnosis Banner */}
              <div className="bg-gradient-to-r from-rose-800 to-amber-900 text-white rounded-2xl p-6 shadow-md relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-rose-400 text-rose-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mb-1">
                      AI Pathology Diagnosis
                    </span>
                    <h2 className="text-xl font-extrabold font-serif">{result.diseaseName}</h2>
                    {result.scientificName && (
                      <p className="text-xs italic text-rose-200 mt-0.5">{result.scientificName}</p>
                    )}
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-center border border-white/20">
                    <div className="text-[10px] text-rose-200">AI Confidence</div>
                    <div className="text-lg font-black font-mono text-amber-300">{result.confidenceScore}%</div>
                  </div>
                </div>

                <div className="mt-3 text-xs bg-rose-950/40 p-3 rounded-xl border border-rose-400/30">
                  <span className="font-bold text-amber-300">Urgent Advisory: </span>
                  {result.advisoryMessage}
                </div>
              </div>

              {/* Symptoms List */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                  Key Symptoms Identified
                </div>
                <ul className="space-y-1.5 pl-2">
                  {result.symptoms?.map((sym, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-700">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Treatments (Chemical & Organic) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Organic / Bio Control */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Organic & Bio Treatment
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    {result.recommendedTreatment?.organic?.map((org, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{org}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Treatment */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-amber-600" />
                    Chemical Spray Control
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    {result.recommendedTreatment?.chemical?.map((chem, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{chem}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-[10px] text-amber-800 font-semibold pt-1 border-t border-amber-200/60">
                    Dosage: {result.recommendedTreatment?.dosage}
                  </div>
                </div>
              </div>

              {/* Prevention Methods */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs">
                <div className="font-bold text-slate-900 mb-2">Long-term Prevention Guidelines</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  {result.preventionMethods?.map((prev, i) => (
                    <div key={i} className="flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{prev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Crop Image Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select or upload a crop leaf image on the left panel and click "Analyze Crop" to generate instant disease identification and treatment recipes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
