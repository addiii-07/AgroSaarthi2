import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_GOVT_SCHEMES, DISTRICTS, CROPS } from '../data/mockData';
import { GovernmentScheme, SchemeApplication, User, AISchemeRecommendation, Language } from '../types';
import {
  FileText,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle2,
  Award,
  Landmark,
  UserCheck,
  Sprout,
  MapPin,
  Layers,
  Globe,
} from 'lucide-react';

interface GovernmentSchemesProps {
  currentUser: User | null;
  language?: Language;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Maharashtra',
  'Uttar Pradesh',
  'Punjab',
  'Madhya Pradesh',
  'All India / Central Govt',
];

const FARMER_CATEGORIES = [
  'Small Farmer (< 2 Hectares / 5 Acres)',
  'Marginal Farmer (< 1 Hectare / 2.5 Acres)',
  'SC / ST Farmer',
  'Woman Farmer',
  'Tenant / Sharecropper Farmer (CCRC)',
  'Large Farmer (> 5 Acres)',
];

// UI Translations dictionary for component localization
const UI_TRANSLATIONS: Partial<Record<Language, Record<string, string>>> = {
  en: {
    badgeAi: '✨ AI Government Scheme Assistant',
    deptHeader: 'Department of Agriculture & Farmers Welfare',
    portalTitle: 'Government Schemes & Subsidies',
    portalSubtitle:
      'Personalized scheme finder powered by AI. Analyzes your State, District, Crop, Land Size, and Category to recommend the Top 5 best government subsidies with voice assistance.',
    stopVoice: 'Stop Voice',
    listenAll: 'Listen All Schemes (Voice)',
    tabAi: '✨ AI Scheme Assistant (Top 5 Suitable)',
    tabDirectory: 'All Active Schemes Directory',
    tabStatus: 'Application Status Tracker',
    farmerProfileTitle: 'Farmer Profile Attributes for AI Matching',
    farmerProfileDesc:
      'Select your farming credentials below. AI will match and rank the Top 5 most beneficial government schemes.',
    selectLanguage: 'Select Language:',
    state: 'State',
    district: 'District',
    crop: 'Primary Crop',
    landSize: 'Land Size',
    category: 'Category',
    matchedFor: 'Matched for:',
    btnAnalyze: 'Analyze & Recommend Top 5 Schemes',
    btnAnalyzing: 'AI Analyzing Government Database...',
    topRecommendedTitle: 'Top 5 Recommended Schemes for You',
    badgeLiveAi: '🤖 Live Gemini AI Analysis',
    badgeDbMatch: '📋 Database Scheme Match',
    whyRecommended: 'Why Recommended for Your Farm:',
    financialBenefits: 'Financial Support & Subsidy Benefits:',
    eligibilityCriteria: 'Eligibility Criteria:',
    requiredDocuments: 'Required Documents:',
    officialPortal: 'Visit Official Portal',
    applyViaAgroSaarthi: 'Apply via AgroSaarthi',
    listenVoice: 'Listen (Voice)',
    speaking: 'Speaking...',
    timelineTitle: 'Scheme Application Status Timeline',
    appRef: 'Application Ref:',
    applicant: 'Applicant:',
    statusApproved: 'Approved',
    statusSubmitted: 'Submitted',
    stepSubmitted: 'Submitted',
    stepMandal: 'Mandal Verification',
    stepSanctioned: 'Sanctioned',
    stepDisbursed: 'DBT Disbursed',
    applyModalTitle: 'Apply for',
    farmerName: 'Farmer Name',
    mobileNumber: 'Registered Mobile Number',
    verificationNote:
      'Your Aadhaar and Pattadar Passbook details registered under your profile will be used for direct verification by Mandal VAA officers.',
    confirmSubmit: 'Confirm & Submit Application',
    submitting: 'Submitting Application...',
    applySuccess: 'Application submitted successfully!',
    retryAi: 'Retry AI',
    benefitSubsidy: 'Benefit / Subsidy:',
    deadline: 'Deadline:',
    viewDetails: 'View Eligibility & Docs',
    applyNow: 'Apply Now',
    proceedToApply: 'Proceed to Apply →',
  },
  te: {
    badgeAi: '✨ AI ప్రభుత్వ పథకాల సహాయకుడు',
    deptHeader: 'వ్యవసాయ మరియు రైతు సంక్షేమ శాఖ',
    portalTitle: 'ప్రభుత్వ పథకాలు మరియు సబ్సిడీలు',
    portalSubtitle:
      'AI ఆధారిత పథకాల అసిస్టెంట్. మీ రాష్ట్రం, జిల్లా, పంట, భూమి విస్తీర్ణం మరియు వర్గం ఆధారంగా ఉత్తమ 5 ప్రభుత్వ పథకాలను వాయిస్ సహాయంతో సిఫార్సు చేస్తుంది.',
    stopVoice: 'వాయిస్ ఆపు',
    listenAll: 'అన్ని పథకాలు వినండి (వాయిస్)',
    tabAi: '✨ AI పథకాల సహాయకుడు (టాప్ 5)',
    tabDirectory: 'అన్ని క్రియాశీల పథకాల జాబితా',
    tabStatus: 'దరఖాస్తు స్థితి ట్రాకర్',
    farmerProfileTitle: 'AI మ్యాచింగ్ కోసం రైతు ప్రొఫైల్ వివరాలు',
    farmerProfileDesc:
      'కింది మీ వ్యవసాయ వివరాలను ఎంచుకోండి. AI మీకు అత్యంత ప్రయోజనకరమైన 5 ప్రభుత్వ పథకాలను ఎంచుకుంటుంది.',
    selectLanguage: 'భాషను ఎంచుకోండి:',
    state: 'రాష్ట్రం',
    district: 'జిల్లా',
    crop: 'ప్రధాన పంట',
    landSize: 'భూమి విస్తీర్ణం',
    category: 'వర్గం / కేటగిరీ',
    matchedFor: 'వివరాలకు అనుగుణంగా:',
    btnAnalyze: 'విశ్లేషించి టాప్ 5 పథకాలను పొందండి',
    btnAnalyzing: 'AI ప్రభుత్వ డేటాబేస్‌ను విశ్లేషిస్తోంది...',
    topRecommendedTitle: 'మీ కోసం టాప్ 5 సిఫార్సు చేసిన పథకాలు',
    badgeLiveAi: '🤖 లైవ్ జెమిని AI విశ్లేషణ',
    badgeDbMatch: '📋 డేటాబేస్ పథకాల మ్యాచింగ్',
    whyRecommended: 'మీ పొలానికి ఎందుకు సిఫార్సు చేయబడింది:',
    financialBenefits: 'ఆర్థిక సహాయం & సబ్సిడీ ప్రయోజనాలు:',
    eligibilityCriteria: 'అర్హత ప్రమాణాలు:',
    requiredDocuments: 'అవసరమైన పత్రాలు (డాక్యుమెంట్లు):',
    officialPortal: 'అధికారిక పోర్టల్‌ను సందర్శించండి',
    applyViaAgroSaarthi: 'అగ్రోసారథి ద్వారా దరఖాస్తు చేయండి',
    listenVoice: 'వినండి (వాయిస్)',
    speaking: 'మాట్లాడుతోంది...',
    timelineTitle: 'పథకం దరఖాస్తు స్థితి టైమ్‌లైన్',
    appRef: 'దరఖాస్తు సంఖ్య:',
    applicant: 'దరఖాస్తుదారు:',
    statusApproved: 'ఆమోదించబడింది',
    statusSubmitted: 'సమర్పించబడింది',
    stepSubmitted: 'సమర్పించబడింది',
    stepMandal: 'మండల పరిశీలన',
    stepSanctioned: 'మంజూరైంది',
    stepDisbursed: 'బ్యాంకు ఖాతాలో జమ (DBT)',
    applyModalTitle: 'దరఖాస్తు చేయండి:',
    farmerName: 'రైతు పేరు',
    mobileNumber: 'నమోదిత మొబైల్ నంబర్',
    verificationNote:
      'మీ ప్రొఫైల్‌లోని ఆధార్ మరియు పట్టాదార్ పాస్‌బుక్ వివరాలు విలేజ్ అగ్రికల్చర్ అసిస్టెంట్ (VAA) అధికారుల పరిశీలనకు ఉపయోగించబడతాయి.',
    confirmSubmit: 'దరఖాస్తును ధృవీకరించి సమర్పించండి',
    submitting: 'దరఖాస్తు సమర్పిస్తోంది...',
    applySuccess: 'దరఖాస్తు విజయవంతంగా సమర్పించబడింది!',
    retryAi: 'మళ్లీ ప్రయత్నించండి',
    benefitSubsidy: 'ప్రయోజనం / సబ్సిడీ:',
    deadline: 'గడువు తేదీ:',
    viewDetails: 'అర్హతలు & వివరాలు చూడండి',
    applyNow: 'ఇప్పుడే దరఖాస్తు చేయండి',
    proceedToApply: 'దరఖాస్తుకు ముందడుగు →',
  },
  hi: {
    badgeAi: '✨ एआई सरकारी योजना सहायक',
    deptHeader: 'कृषि एवं किसान कल्याण विभाग',
    portalTitle: 'सरकारी योजनाएं और सब्सिडी',
    portalSubtitle:
      'एआई संचालित योजना खोजक। आपके राज्य, जिले, फसल, भूमि के आकार और श्रेणी का विश्लेषण करके आवाज सहायता के साथ शीर्ष 5 सरकारी सब्सिडी की सिफारिश करता है।',
    stopVoice: 'आवाज बंद करें',
    listenAll: 'सभी योजनाएं सुनें (आवाज)',
    tabAi: '✨ एआई योजना सहायक (शीर्ष 5 उपयुक्त)',
    tabDirectory: 'सभी सक्रिय योजनाओं की निर्देशिका',
    tabStatus: 'आवेदन स्थिति ट्रैकर',
    farmerProfileTitle: 'एआई मिलान के लिए किसान प्रोफाइल विवरण',
    farmerProfileDesc:
      'नीचे अपनी कृषि जानकारी चुनें। एआई शीर्ष 5 सबसे लाभदायक सरकारी योजनाओं की सिफारिश करेगा।',
    selectLanguage: 'भाषा चुनें:',
    state: 'राज्य',
    district: 'जिला',
    crop: 'मुख्य फसल',
    landSize: 'भूमि का आकार',
    category: 'श्रेणी',
    matchedFor: 'के लिए मिलान:',
    btnAnalyze: 'विश्लेषण करें और शीर्ष 5 योजनाएं प्राप्त करें',
    btnAnalyzing: 'एआई सरकारी डेटाबेस का विश्लेषण कर रहा है...',
    topRecommendedTitle: 'आपके लिए शीर्ष 5 अनुशंसित योजनाएं',
    badgeLiveAi: '🤖 लाइव जेमिनी एआई विश्लेषण',
    badgeDbMatch: '📋 डेटाबेस योजना मिलान',
    whyRecommended: 'आपके खेत के लिए क्यों अनुशंसित है:',
    financialBenefits: 'वित्तीय सहायता और सब्सिडी लाभ:',
    eligibilityCriteria: 'पात्रता मानदंड:',
    requiredDocuments: 'आवश्यक दस्तावेज:',
    officialPortal: 'आधिकारिक पोर्टल पर जाएं',
    applyViaAgroSaarthi: 'एग्रोसारथी के माध्यम से आवेदन करें',
    listenVoice: 'सुनें (आवाज)',
    speaking: 'बोल रहा है...',
    timelineTitle: 'योजना आवेदन स्थिति समय-सीमा',
    appRef: 'आवेदन संख्या:',
    applicant: 'आवेदक:',
    statusApproved: 'स्वीकृत',
    statusSubmitted: 'जमा किया गया',
    stepSubmitted: 'जमा किया गया',
    stepMandal: 'मंडल सत्यापन',
    stepSanctioned: 'मंजूर किया गया',
    stepDisbursed: 'डीबीटी हस्तांतरित',
    applyModalTitle: 'के लिए आवेदन करें:',
    farmerName: 'किसान का नाम',
    mobileNumber: 'पंजीकृत मोबाइल नंबर',
    verificationNote:
      'आपकी प्रोफाइल के तहत पंजीकृत आधार और पट्टादार पासबुक विवरण का उपयोग मंडल कृषि अधिकारियों द्वारा सीधा सत्यापन के लिए किया जाएगा।',
    confirmSubmit: 'पुष्टि करें और आवेदन जमा करें',
    submitting: 'आवेदन जमा किया जा रहा है...',
    applySuccess: 'आवेदन सफलतापूर्वक जमा किया गया!',
    retryAi: 'पुनः प्रयास करें',
    benefitSubsidy: 'लाभ / सब्सिडी:',
    deadline: 'अंतिम तिथि:',
    viewDetails: 'पात्रता और दस्तावेज देखें',
    applyNow: 'अभी आवेदन करें',
    proceedToApply: 'आगे बढ़ें →',
  },
};

import { fetchGovernmentSchemesFromSupabase, fetchSchemeMatchesFromSupabase } from '../lib/supabase';

export const GovernmentSchemes: React.FC<GovernmentSchemesProps> = ({
  currentUser,
  language = 'en',
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(MOCK_GOVT_SCHEMES);
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [activeTab, setActiveTab] = useState<'aiAssistant' | 'schemes' | 'myApplications'>('aiAssistant');

  // AI Assistant Form State
  const [stateName, setStateName] = useState<string>('Andhra Pradesh');
  const [district, setDistrict] = useState<string>(currentUser?.district || 'Guntur');
  const [crop, setCrop] = useState<string>(currentUser?.primaryCrop || 'Paddy (Rice)');
  const [landSize, setLandSize] = useState<string>('2.5 Acres');
  const [farmerCategory, setFarmerCategory] = useState<string>('Small Farmer (< 2 Hectares / 5 Acres)');

  // AI Recommendations State
  const [recommendations, setRecommendations] = useState<AISchemeRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'gemini_ai' | 'database_match' | null>(null);

  // Load from Supabase `government_schemes` and `scheme_matches`
  useEffect(() => {
    fetchGovernmentSchemesFromSupabase().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((row: any, idx: number) => ({
          id: row.id || `db-sch-${idx}`,
          schemeName: row.scheme_name || row.name || 'Govt Scheme',
          department: row.department || 'Ministry of Agriculture',
          shortDescription: row.short_description || row.description || '',
          fullDescription: row.full_description || row.description || '',
          subsidyPercentage: row.subsidy_percentage || row.subsidy || '40% - 90%',
          eligibility: Array.isArray(row.eligibility) ? row.eligibility : [row.eligibility || 'Eligible Farmers'],
          requiredDocuments: Array.isArray(row.required_documents) ? row.required_documents : ['Aadhaar', 'Land Passbook'],
          applicationDeadline: row.deadline || '2026-12-31',
          contactHelpline: row.helpline || '1800-180-1551',
          portalUrl: row.portal_url || 'https://agricoop.nic.in',
          category: row.category || 'Direct Income Support',
        }));
        setSchemes(mapped);
      }
    }).catch((e) => console.warn('Supabase government_schemes fetch note:', e));

    if (currentUser?.id) {
      fetchSchemeMatchesFromSupabase(currentUser.id).then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // If pre-computed matches exist in Supabase scheme_matches table
          setDataSource('database_match');
        }
      }).catch((e) => console.warn('Supabase scheme_matches fetch note:', e));
    }
  }, [currentUser?.id]);

  // Speech / Bhashini Voice State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  // Sync selectedLanguage if prop updates
  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  // Translation helper
  const t = (key: string): string => {
    return UI_TRANSLATIONS[selectedLanguage]?.[key] || UI_TRANSLATIONS.en[key] || key;
  };

  // Map Language code to Bhashini / SpeechSynthesis voice lang tag
  const voiceLangTagMap: Record<Language, string> = {
    te: 'te-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    or: 'or-IN',
    ml: 'ml-IN',
    en: 'en-IN',
  };
  const voiceLangTag = voiceLangTagMap[selectedLanguage] || 'en-IN';

  // Application State
  const [applications, setApplications] = useState<SchemeApplication[]>([
    {
      id: 'app-1',
      schemeId: 'sch-1',
      schemeName: 'YSR Rythu Bharosa / PM-KISAN',
      farmerId: currentUser?.id || 'farmer-1',
      farmerName: currentUser?.fullName || 'Ramesh Chowdary',
      mobile: currentUser?.mobile || '9876543210',
      district: currentUser?.district || 'Guntur',
      status: 'Approved',
      appliedDate: '2026-01-10',
      amountClaimed: 13500,
    },
  ]);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySchemeData, setApplySchemeData] = useState<{ id: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedSuccessMsg, setAppliedSuccessMsg] = useState('');

  // Fetch AI Recommendations with language parameter
  const fetchAiRecommendations = useCallback(
    async (
      reqState: string,
      reqDistrict: string,
      reqCrop: string,
      reqLand: string,
      reqCategory: string,
      reqLang: Language
    ) => {
      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        const res = await fetch('/api/schemes/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: reqState,
            district: reqDistrict,
            crop: reqCrop,
            landSize: reqLand,
            farmerCategory: reqCategory,
            language:
              reqLang === 'te'
                ? 'Telugu'
                : reqLang === 'hi'
                ? 'Hindi'
                : reqLang === 'ta'
                ? 'Tamil'
                : reqLang === 'kn'
                ? 'Kannada'
                : reqLang === 'mr'
                ? 'Marathi'
                : reqLang === 'bn'
                ? 'Bengali'
                : reqLang === 'gu'
                ? 'Gujarati'
                : reqLang === 'pa'
                ? 'Punjabi'
                : reqLang === 'or'
                ? 'Odia'
                : reqLang === 'ml'
                ? 'Malayalam'
                : 'English',
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to generate recommendations (HTTP ${res.status})`);
        }

        const data = await res.json();
        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
          setDataSource(data.source || 'database_match');
        } else {
          throw new Error('No schemes found for this criteria.');
        }
      } catch (err: any) {
        console.error('AI Scheme Recommendation error:', err);
        setAnalysisError(err?.message || 'Failed to analyze schemes.');
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  // Auto-run analysis when inputs or language change
  useEffect(() => {
    fetchAiRecommendations(stateName, district, crop, landSize, farmerCategory, selectedLanguage);
  }, [selectedLanguage]);

  // Bhashini / Speech Synthesis Voice Handler
  const handleSpeak = (text: string, index?: number) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Voice responses are not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
      if (index === speakingIndex) return; // Toggle off
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLangTag;
    utterance.rate = 0.9; // Slightly slower rate for clear rural comprehension

    const voices = window.speechSynthesis.getVoices();
    const matchVoice = voices.find((v) => v.lang.startsWith(voiceLangTag.split('-')[0]));
    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (index !== undefined) setSpeakingIndex(index);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingIndex(null);
  };

  const handleSpeakAllRecommendations = () => {
    if (recommendations.length === 0) return;
    const fullText = recommendations
      .map(
        (rec, i) =>
          `Scheme ${i + 1}: ${rec.schemeName}. Benefits: ${rec.benefits}. Reason: ${rec.whyRecommended}`
      )
      .join('. ');
    handleSpeak(fullText, 999);
  };

  const handleApplyScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applySchemeData || !currentUser) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/schemes/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: applySchemeData.id,
          farmerId: currentUser.id,
          farmerName: currentUser.fullName,
          mobile: currentUser.mobile,
          district: currentUser.district,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.application) {
        setApplications((prev) => [data.application, ...prev]);
        setAppliedSuccessMsg(t('applySuccess') + ` (Ref #${data.application.id})`);
        setTimeout(() => {
          setIsApplyModalOpen(false);
          setAppliedSuccessMsg('');
          setActiveTab('myApplications');
        }, 1500);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.warn('Failed to submit scheme application:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Portal Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-sky-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-1">
            <span className="bg-amber-400 text-sky-950 font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-sky-950" /> {t('badgeAi')}
            </span>
            <span className="bg-white/10 text-emerald-200 text-xs px-3 py-1 rounded-full border border-white/20">
              {t('deptHeader')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">{t('portalTitle')}</h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl mt-1 leading-relaxed">
            {t('portalSubtitle')}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {isSpeaking ? (
            <button
              onClick={stopSpeaking}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
            >
              <VolumeX className="w-4 h-4 animate-bounce" /> {t('stopVoice')}
            </button>
          ) : (
            <button
              onClick={handleSpeakAllRecommendations}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-sky-950 text-xs font-extrabold rounded-xl shadow transition-all flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" /> {t('listenAll')}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-3 border-b border-slate-200 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('aiAssistant')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'aiAssistant'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t('tabAi')}</span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'schemes'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>
            {t('tabDirectory')} ({schemes.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('myApplications')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'myApplications'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            {t('tabStatus')} ({applications.length})
          </span>
        </button>
      </div>

      {/* TAB 1: AI GOVERNMENT SCHEME ASSISTANT */}
      {activeTab === 'aiAssistant' && (
        <div className="space-y-6">
          {/* Farmer Input Form Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  {t('farmerProfileTitle')}
                </h2>
                <p className="text-xs text-slate-500">{t('farmerProfileDesc')}</p>
              </div>

              {/* Language Selector Bar */}
              <div className="flex items-center gap-2 shrink-0 bg-emerald-50 p-1.5 rounded-xl border border-emerald-200">
                <Globe className="w-4 h-4 text-emerald-700 ml-1" />
                <span className="text-[11px] font-extrabold text-emerald-900">{t('selectLanguage')}</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="text-xs font-extrabold bg-white text-emerald-950 rounded-lg px-2.5 py-1 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              {/* State */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-sky-600" /> {t('state')}
                </label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> {t('district')}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" /> {t('crop')}
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Land Size */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" /> {t('landSize')}
                </label>
                <input
                  type="text"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  placeholder="e.g. 2.5 Acres"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Farmer Category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-purple-600" /> {t('category')}
                </label>
                <select
                  value={farmerCategory}
                  onChange={(e) => setFarmerCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {FARMER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 font-medium">
                {t('matchedFor')} <strong className="text-slate-800">{farmerCategory}</strong> •{' '}
                <strong className="text-slate-800">{crop}</strong> on{' '}
                <strong className="text-slate-800">{landSize}</strong> in{' '}
                <strong className="text-slate-800">
                  {district}, {stateName}
                </strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() =>
                    fetchAiRecommendations(
                      stateName,
                      district,
                      crop,
                      landSize,
                      farmerCategory,
                      selectedLanguage
                    )
                  }
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{t('btnAnalyzing')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>{t('btnAnalyze')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error / Fallback Note */}
          {analysisError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <span>{analysisError}</span>
              <button
                onClick={() =>
                  fetchAiRecommendations(
                    stateName,
                    district,
                    crop,
                    landSize,
                    farmerCategory,
                    selectedLanguage
                  )
                }
                className="font-bold underline text-amber-900 hover:text-amber-950 shrink-0"
              >
                {t('retryAi')}
              </button>
            </div>
          )}

          {/* AI Recommendations Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 font-serif flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              {t('topRecommendedTitle')}
            </h2>
            {dataSource && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {dataSource === 'gemini_ai' ? t('badgeLiveAi') : t('badgeDbMatch')}
              </span>
            )}
          </div>

          {/* TOP 5 SCHEMES LIST */}
          <div className="space-y-5">
            {recommendations.map((scheme, index) => (
              <div
                key={scheme.id || index}
                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                  speakingIndex === index
                    ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-50/20'
                    : 'border-emerald-100 hover:shadow-md'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{scheme.schemeName}</h3>
                      <p className="text-[11px] text-slate-500 font-semibold">{scheme.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-sky-200">
                      {scheme.category}
                    </span>

                    {/* Speech / Voice button */}
                    <button
                      onClick={() =>
                        handleSpeak(
                          scheme.bhashiniSummary ||
                            `${scheme.schemeName}. ${scheme.benefits}. ${scheme.whyRecommended}`,
                          index
                        )
                      }
                      className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        speakingIndex === index
                          ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse'
                          : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900'
                      }`}
                      title={t('listenVoice')}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {speakingIndex === index ? t('speaking') : t('listenVoice')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Scheme Content Grid */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Why Recommended Callout Box */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 space-y-1">
                    <div className="font-extrabold text-amber-900 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                      {t('whyRecommended')}
                    </div>
                    <p className="text-slate-800 font-medium leading-relaxed pt-0.5">
                      {scheme.whyRecommended}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-100 space-y-1">
                    <div className="font-extrabold text-sky-950 flex items-center gap-1.5 text-xs">
                      <Award className="w-4 h-4 text-sky-600" />
                      {t('financialBenefits')}
                    </div>
                    <p className="text-slate-900 font-semibold leading-relaxed pt-0.5">
                      {scheme.benefits}
                    </p>
                  </div>
                </div>

                {/* Eligibility & Documents */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
                  {/* Eligibility */}
                  <div>
                    <span className="font-extrabold text-slate-900 block mb-1.5">
                      {t('eligibilityCriteria')}
                    </span>
                    <ul className="space-y-1 pl-1 text-slate-700">
                      {scheme.eligibility.map((crit, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <span className="font-extrabold text-slate-900 block mb-1.5">
                      {t('requiredDocuments')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.requiredDocuments.map((doc, dIdx) => (
                        <span
                          key={dIdx}
                          className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-medium text-[11px]"
                        >
                          📄 {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href={scheme.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t('officialPortal')} ({scheme.officialWebsite.replace('https://', '')})
                  </a>

                  <button
                    onClick={() => {
                      setApplySchemeData({ id: scheme.id, name: scheme.schemeName });
                      setIsApplyModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('applyViaAgroSaarthi')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SCHEMES DIRECTORY */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {scheme.category}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {t('deadline')} {scheme.applicationDeadline}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{scheme.schemeName}</h3>
                <p className="text-[11px] text-slate-500 font-medium">{scheme.department}</p>

                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  {scheme.shortDescription}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="font-semibold text-emerald-800">{t('benefitSubsidy')}</div>
                  <div className="font-bold text-slate-900">{scheme.subsidyPercentage}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                >
                  {t('viewDetails')} <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setApplySchemeData({ id: scheme.id, name: scheme.schemeName });
                    setIsApplyModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('applyNow')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MY APPLICATIONS STATUS TIMELINE */}
      {activeTab === 'myApplications' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-serif">{t('timelineTitle')}</h2>

          {applications.length > 0 ? (
            <div className="space-y-6">
              {applications.map((app) => (
                <div key={app.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {t('appRef')} #{app.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{app.schemeName}</h3>
                      <div className="text-xs text-slate-500">
                        {t('applicant')} {app.farmerName} • {t('district')}: {app.district}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold self-start ${
                        app.status === 'Approved' || app.status === 'Disbursed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Submitted'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t('statusApproved')}: {app.status}
                    </span>
                  </div>

                  {/* Progress Timeline */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto">
                        ✓
                      </div>
                      <div className="font-bold text-slate-800">{t('stepSubmitted')}</div>
                      <div className="text-slate-400">{app.appliedDate}</div>
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`w-6 h-6 rounded-full font-bold flex items-center justify-center mx-auto ${
                          app.status !== 'Submitted' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        2
                      </div>
                      <div className="font-semibold text-slate-700">{t('stepMandal')}</div>
                      <div className="text-slate-400">VAA Approved</div>
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`w-6 h-6 rounded-full font-bold flex items-center justify-center mx-auto ${
                          app.status === 'Approved' || app.status === 'Disbursed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        3
                      </div>
                      <div className="font-semibold text-slate-700">{t('stepSanctioned')}</div>
                      <div className="text-slate-400">DAO Sanction</div>
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`w-6 h-6 rounded-full font-bold flex items-center justify-center mx-auto ${
                          app.status === 'Disbursed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        4
                      </div>
                      <div className="font-semibold text-slate-700">{t('stepDisbursed')}</div>
                      <div className="text-slate-400">Aadhaar Bank Credit</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">No scheme applications submitted yet.</div>
          )}
        </div>
      )}

      {/* SCHEME DETAIL MODAL */}
      {selectedScheme && !isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs border border-emerald-100 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {selectedScheme.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{selectedScheme.schemeName}</h3>
                <p className="text-[11px] text-slate-500">{selectedScheme.department}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-700 leading-relaxed">{selectedScheme.fullDescription}</p>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-900">{t('benefitSubsidy')}</span>
              <p className="text-slate-800 font-semibold">{selectedScheme.subsidyPercentage}</p>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">{t('eligibilityCriteria')}</span>
              <ul className="space-y-1 pl-3 text-slate-700">
                {selectedScheme.eligibility.map((e, idx) => (
                  <li key={idx} className="list-disc">
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">{t('requiredDocuments')}</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedScheme.requiredDocuments.map((doc, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                  >
                    📄 {doc}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <a
                href={selectedScheme.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 font-bold hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> {t('officialPortal')}
              </a>
              <button
                onClick={() => {
                  setApplySchemeData({ id: selectedScheme.id, name: selectedScheme.schemeName });
                  setIsApplyModalOpen(true);
                }}
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-700"
              >
                {t('proceedToApply')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLY NOW MODAL */}
      {isApplyModalOpen && applySchemeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs border border-emerald-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {t('applyModalTitle')} {applySchemeData.name}
              </h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {appliedSuccessMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 font-bold rounded-xl text-center border border-emerald-200">
                {appliedSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleApplyScheme} className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{t('farmerName')}</label>
                  <input
                    type="text"
                    value={currentUser?.fullName || 'Ramesh Chowdary'}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{t('mobileNumber')}</label>
                  <input
                    type="text"
                    value={currentUser?.mobile || '9876543210'}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {t('district')} / Mandal
                  </label>
                  <input
                    type="text"
                    value={`${currentUser?.district || district}, ${currentUser?.villageMandal || 'Tenali'}`}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Note:</strong> {t('verificationNote')}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  {isSubmitting ? t('submitting') : t('confirmSubmit')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
