import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Send,
  MapPin,
  ExternalLink,
  Volume2,
  VolumeX,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Cpu,
  Brain,
  Compass,
  Radio,
  Square,
  AlertCircle,
  Building,
  Store,
  Layers,
  Clock,
  Navigation,
  Globe,
  Sliders,
  Image as ImageIcon,
  X,
  Trash2,
  Download,
  Camera,
  ShieldCheck,
  HelpCircle,
  CloudSun,
  FileCheck2,
} from 'lucide-react';
import { User, FarmDetails, Language } from '../types';

interface AgroAiProps {
  user: User | null;
  farm?: FarmDetails | null;
  language?: Language;
  onNavigate?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  image?: string;
  groundingUrls?: Array<{ uri: string; title: string }>;
}

type AiMode = 'chat' | 'live_voice' | 'maps_scout';
type GeminiModel = 'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
type SystemRole =
  | 'agronomist'
  | 'soil_expert'
  | 'pest_doctor'
  | 'market_analyst'
  | 'climate_advisor'
  | 'scheme_expert';

const ROLE_SUGGESTIONS: Record<SystemRole, string[]> = {
  agronomist: [
    'How to optimize Paddy yield at panicle initiation stage?',
    'Best crop rotation schedule following Chilli in Black Cotton soil',
    'Proper seed treatment protocol for Cotton Bt seeds (FIR method)',
    'How to calculate drip irrigation discharge hours per acre?',
  ],
  soil_expert: [
    'How do I correct high soil pH (alkali soil) with gypsum?',
    'What are the visual symptoms of Zinc deficiency in Maize?',
    'How to prepare enriched Farm Yard Manure (FYM) with Trichoderma?',
    'Recommended NPK split doses for Tomato in Red Loam soil',
  ],
  pest_doctor: [
    'How to control thrips & yellow leaf curl virus in Chilli?',
    'Organic neem formulation and dosage for whiteflies & aphids',
    'Identification & management of Fall Armyworm in Maize',
    'How to treat bacterial leaf blight in Paddy naturally and chemically?',
  ],
  market_analyst: [
    'What are the current Chilli auction rates in Guntur Mirchi Yard?',
    'How does e-NAM electronic bidding work for farmers?',
    'How to get warehouse pledge loans (NWR) to avoid distress selling?',
    'What moisture percentage is mandatory before bringing Cotton to market?',
  ],
  climate_advisor: [
    'Heavy rainstorm forecast: Pre-storm drainage protocol for vegetable crops',
    'Drought mitigation spray formula using 1% Potassium Nitrate',
    'How to prevent flower drop during severe summer heatwave?',
    'Frost protection techniques for early morning winter farming',
  ],
  scheme_expert: [
    'How to check PM-KISAN 17th installment e-KYC status?',
    'PM Fasal Bima (PMFBY): How to report crop damage within 72 hours?',
    'How to apply for 70-90% subsidy on drip irrigation under PMKSY?',
    'Eligibility documents needed for SMAM tractor & implement subsidy',
  ],
};

export interface ConstitutionalLanguage {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

// The 22 Languages recognised by the Eighth Schedule to the Constitution of India
export const CONSTITUTIONAL_22_LANGUAGES: ConstitutionalLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', speechCode: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechCode: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechCode: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speechCode: 'ur-IN' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', speechCode: 'sa-IN' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', speechCode: 'mai-IN' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', speechCode: 'brx-IN' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', speechCode: 'doi-IN' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر / कॉशुर', speechCode: 'ks-IN' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', speechCode: 'gom-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', speechCode: 'mni-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', speechCode: 'ne-NP' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', speechCode: 'sat-IN' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', speechCode: 'sd-IN' },
];

export const AgroAi: React.FC<AgroAiProps> = ({ user, farm, language = 'en', onNavigate }) => {
  const [activeMode, setActiveMode] = useState<AiMode>('chat');

  // --- 1. CHAT COPILOT STATE ---
  // Default to user's saved language or Telugu/Hindi from the 22 constitutional languages
  const [selectedLangCode, setSelectedLangCode] = useState<string>(() => {
    if (user?.language) {
      const match = CONSTITUTIONAL_22_LANGUAGES.find((l) => l.code === user.language);
      if (match) return match.code;
    }
    if (language) {
      const match = CONSTITUTIONAL_22_LANGUAGES.find((l) => l.code === language);
      if (match) return match.code;
    }
    return 'hi';
  });

  const currentLangObj =
    CONSTITUTIONAL_22_LANGUAGES.find((l) => l.code === selectedLangCode) ||
    CONSTITUTIONAL_22_LANGUAGES[0];

  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-3.8-flash');
  const [systemRole, setSystemRole] = useState<SystemRole>('agronomist');
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<{
    base64: string;
    preview: string;
    name: string;
  } | null>(null);
  const [isListening, setIsListening] = useState(false);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Namaste${user?.name ? ' ' + user.name : ''}! 🙏 I am **Agro AI**, your advanced multimodal agricultural intelligence copilot.\n\n🇮🇳 **22 Constitutional Languages Supported**: You can select any of the 22 official languages of India from the Language menu above, and I will reply strictly in that SAME language (not in English).\n\n• **Crop & Soil Science**: Balanced NPK, bio-fertilizers, sowing cycles, and drip irrigation scheduling\n• **Pest & Disease Diagnosis**: Integrated Pest Management (IPM), fungal blast, and organic remedies with photo diagnostics\n• **APMC Mandis & Grounding**: Real-time mandi prices, trading arrival windows, and geo-located agricultural facilities\n• **Real-Time Voice**: Hands-free field voice conversations powered by \`gemini-3.8-live\`\n\nHow can I help your farm today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Handle Constitutional Language Selection Switch
  const handleLanguageChange = (newCode: string) => {
    setSelectedLangCode(newCode);
    const langObj = CONSTITUTIONAL_22_LANGUAGES.find((l) => l.code === newCode);
    if (!langObj) return;

    const noticeGreeting: Record<string, string> = {
      te: 'నమస్కారం! భాష తెలుగుగా ఎంపిక చేయబడింది. ఇకపై ఆగ్రో AI సమాధానాలన్నీ పూర్తిగా తెలుగులోనే ఉంటాయి (ఆంగ్లంలో కాదు). మీ పంట గురించి ఏదైనా అడగండి!',
      hi: 'नमस्ते! भाषा बदलकर हिंदी कर दी गई है। अब एग्रो एआई के सभी उत्तर पूरी तरह से केवल हिंदी में ही दिए जाएंगे (अंग्रेजी में नहीं)। अपने खेत के बारे में कुछ भी पूछें!',
      ta: 'வணக்கம்! மொழி தமிழாக தேர்ந்தெடுக்கப்பட்டது. இனி அக்ரோ AI பதில்கள் அனைத்தும் தமிழில் மட்டுமே வழங்கப்படும் (ஆங்கிலத்தில் அல்ல). உங்கள் பயிர் பற்றி கேளுங்கள்!',
      kn: 'ನಮಸ್ಕಾರ! ಭಾಷೆಯನ್ನು ಕನ್ನಡ ಎಂದು ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ. ಇನ್ನು ಮುಂದೆ ಆಗ್ರೋ AI ಉತ್ತರಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಕನ್ನಡದಲ್ಲೇ ಇರುತ್ತವೆ (ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಅಲ್ಲ). ನಿಮ್ಮ ಬೆಳೆ ಬಗ್ಗೆ ಕೇಳಿ!',
      ml: 'നമസ്കാരം! ഭാഷ മലയാളമായി തെരഞ്ഞെടുത്തു. ഇനി അഗ്രോ AI മറുപടികൾ പൂർണ്ണമായും മലയാളത്തിലായിരിക്കും (ഇംഗ്ലീഷിലല്ല). നിങ്ങളുടെ കൃഷിയെക്കുറിച്ച് ചോദിക്കൂ!',
      mr: 'नमस्कार! भाषा मराठी निवडली आहे. आता अ‍ॅग्रो AI ची उत्तरे पूर्णपणे मराठीतच मिळतील (इंग्रजीत नाही). आपल्या पिकाबद्दल प्रश्न विचारा!',
      bn: 'নমস্কার! ভাষা পরিবর্তন করে বাংলা করা হয়েছে। এখন থেকে এগ্রো এআই সম্পূর্ণ বাংলায় উত্তর দেবে (ইংরেজিতে নয়)। আপনার ফসল সম্পর্কে জিজ্ঞাসা করুন!',
      gu: 'નમસ્તે! ભાષા ગુજરાતી પસંદ કરવામાં આવી છે. હવેથી એગ્રો AI ના તમામ જવાબો સંપૂર્ણપણે ગુજરાતીમાં જ આવશે (અંગ્રેજીમાં નહીં). તમારા પાક વિશે પૂછો!',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਚੁਣੀ ਗਈ ਹੈ। ਹੁਣ ਐਗਰੋ ਏਆਈ ਦੇ ਸਾਰੇ ਜਵਾਬ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਹੋਣਗੇ (ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਨਹੀਂ)। ਆਪਣੀ ਫ਼ਸਲ ਬਾਰੇ ਪੁੱਛੋ!',
      or: 'ନମସ୍କାର! ଭାଷା ଓଡ଼ିଆ ଚୟନ କରାଗଲା। ବର୍ତ୍ତମାନଠାରୁ ଆଗ୍ରୋ AI ର ସମସ୍ତ ଉତ୍ତର ସମ୍ପୂର୍ଣ୍ଣ ଭାବରେ ଓଡ଼ିଆରେ ମିଳିବ (ଇଂରାଜୀରେ ନୁହେଁ)। ଆପଣଙ୍କ ଫସଲ ବିଷୟରେ ପଚାରନ୍ତୁ!',
      as: 'নমস্কাৰ! ভাষা অসমীয়া হিচাপে বাছনি কৰা হ’ল। এতিয়াৰ পৰা এগ্ৰো AIৰ সকলো উত্তৰ সম্পূৰ্ণভাৱে অসমীয়াত দিয়া হ’ব (ইংৰাজীত নহয়)। আপোনাৰ শস্যৰ বিষয়ে সোধক!',
      ur: 'السلام علیکم! زبان اردو منتخب کر لی گئی ہے۔ اب ایگرو اے آئی کے تمام جوابات مکمل طور پر صرف اردو میں ہوں گے (انگریزی میں نہیں)۔ اپنی فصل کے بارے میں پوچھیں!',
      sa: 'नमस्कारः! भाषा संस्कृतम् इति चिता। इतः परं एग्रो-AI इत्यस्य सर्वाणि उत्तराणि संस्कृतेनैव भविष्यन्ति। स्वकृषिविषये पृच्छतु!',
      mai: 'प्रणाम! भाषा मैथिली चुनल गेल अछि। अब एग्रो एआईक सब उत्तर केवल मैथिली में भेटत। अपन फसलक संबंध में पूछू!',
      brx: 'खुलुमबाय! रावखौ बड़ो हिसाबै सायख’नाय जाबाय। एग्रो AI या बड़ो रावावनो गासै फिननाय हरगोन!',
      doi: 'नमस्ते! भाशा डोगरी चुनी गेई ऐ। हुण सारे जवाब डोगरी च गै मिलङन!',
      ks: 'سلام! زبانہٕ گیٔ کٲشُر منتخب کٔرمژ۔ وۆنٛہ گژھن ایگرو AI ہٕکۍ سٲری جواب کٲشرِس منٛز دِنہٕ!',
      gom: 'नमस्कार! भास कोंकणी वेंचून काडली। आतां एग्रो AI चीं जापो पुराय कोंकणींत आसतलीं!',
      mni: 'খোইৰুমজরি! লোন্সি মৈতৈলোন্ ওইনা খনরে। হৌজিক্কীদি এগ্রো AI গী পাউখুমশিং মৈতৈলোন্দা ফংলগনি!',
      ne: 'नमस्ते! भाषा नेपाली चयन गरिएको छ। अब एग्रो एआईका सबै जवाफहरू पूर्ण रूपमा नेपालीमै आउनेछन्!',
      sat: 'ᱡᱚᱦᱟᱨ! ᱯᱟᱹᱨᱥᱤ ᱥᱟᱱᱛᱟᱲᱤ ᱵᱟᱪᱷᱟᱣ ᱮᱱᱟ। ᱱᱤᱛᱚᱜ ᱫᱚ ᱮᱜᱽᱨᱳ AI ᱡᱚᱛᱚ ᱛᱮᱞᱟ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮᱜᱮ ᱮᱢᱟᱭ!',
      sd: 'سلام! ٻولي سنڌي چونڊجي وئي آھي. ھاڻي سڀ جواب سنڌيءَ ۾ ملندا!',
    };

    const textNotice =
      noticeGreeting[langObj.code] ||
      `Language selected: ${langObj.name} (${langObj.nativeName}). Agro AI will now respond strictly in ${langObj.name} and not in English.`;

    setMessages((prev) => [
      ...prev,
      {
        id: `lang-switch-${Date.now()}`,
        role: 'model',
        content: `🌐 **${langObj.name} (${langObj.nativeName}) — Selected**\n\n${textNotice}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  // Handle Photo/Image Attachment
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Selected image exceeds 8MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAttachedImage({
        base64: result,
        preview: result,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Speech-to-Text in Chat
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLangObj.speechCode || 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };
      recognition.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      setIsListening(false);
    }
  };

  // --- SEND CHAT MESSAGE ---
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputQuery.trim();
    if ((!textToSend && !attachedImage) || isSending) return;

    const currentImg = attachedImage?.preview;
    const currentBase64 = attachedImage?.base64;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend || 'Diagnose attached crop/plant image and recommend remedy.',
      image: currentImg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputQuery('');
    setAttachedImage(null);
    setIsSending(true);

    try {
      const res = await fetch('/api/agro-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          systemRole,
          imageBase64: currentBase64,
          language: currentLangObj.name,
          languageCode: currentLangObj.code,
          userContext: {
            name: user?.name,
            district: user?.district || selectedDistrict,
            crop: user?.crop || farm?.cropType || 'Chilli / Paddy',
            farmSize: farm?.totalArea || user?.farm_size || '3.5',
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            content: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            modelUsed: data.model || selectedModel,
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to get answer from Agro AI');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `model-err-${Date.now()}`,
          role: 'model',
          content: `⚠️ **Agro AI Notice:** ${err?.message || 'Unable to complete response. Please check your network or try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Reset/Clear Chat
  const handleClearChat = () => {
    if (confirm('Clear conversation history with Agro AI?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          content: `Chat history reset. How can Agro AI assist your farm in ${user?.district || selectedDistrict} today in ${currentLangObj.name} (${currentLangObj.nativeName})?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        },
      ]);
    }
  };

  // --- 2. LIVE VOICE (gemini-3.8-live) STATE ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'speaking' | 'listening'>('disconnected');
  const [liveVoiceName, setLiveVoiceName] = useState<'Zephyr' | 'Puck' | 'Kore' | 'Fenrir'>('Zephyr');
  const [liveTranscript, setLiveTranscript] = useState<Array<{ sender: 'user' | 'agro_ai'; text: string; time: string }>>([
    {
      sender: 'agro_ai',
      text: 'Agro AI Voice Copilot is ready. Press "Start Live Conversation" to talk with gemini-3.8-live in real time.',
      time: 'Ready',
    },
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const liveAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // --- 3. GOOGLE MAPS GROUNDING STATE ---
  const [mapsQuery, setMapsQuery] = useState('Nearest APMC Mandi and Rythu Bharosa Kendra');
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'Guntur');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);
  const [mapsResultText, setMapsResultText] = useState<string | null>(null);
  const [mapsPlaces, setMapsPlaces] = useState<any[]>([]);
  const [isLiveMapsGrounding, setIsLiveMapsGrounding] = useState(false);

  // Helper: Get user geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // --- TTS READ ALOUD ---
  const handleSpeak = async (msgId: string, text: string) => {
    if (playingAudioId === msgId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingAudioId(null);
      return;
    }

    try {
      setPlayingAudioId(msgId);
      const res = await fetch('/api/agro-ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.replace(/[*#_`]/g, ''), voice: 'Kore' }),
      });

      const data = await res.json();
      if (res.ok && data.audio) {
        const audioSrc = `data:audio/wav;base64,${data.audio}`;
        if (!audioPlayerRef.current) {
          audioPlayerRef.current = new Audio();
        }
        audioPlayerRef.current.src = audioSrc;
        audioPlayerRef.current.onended = () => setPlayingAudioId(null);
        await audioPlayerRef.current.play();
      } else {
        // Fallback to browser SpeechSynthesis
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
          utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
          utterance.onend = () => setPlayingAudioId(null);
          window.speechSynthesis.speak(utterance);
        } else {
          setPlayingAudioId(null);
        }
      }
    } catch {
      setPlayingAudioId(null);
    }
  };

  // --- COPY TEXT ---
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- 2. LIVE VOICE CONVERSATION (gemini-3.8-live) ---
  const startLiveConversation = async () => {
    try {
      setLiveStatus('connecting');

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // AudioContext for output (24kHz for Live API)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;

      // AudioContext for input (16kHz for mic)
      inputAudioCtxRef.current = new AudioCtx({ sampleRate: 16000 });
      const source = inputAudioCtxRef.current.createMediaStreamSource(stream);
      const processor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      // WebSocket connection to server Live API bridge
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsLiveActive(true);
        setLiveStatus('listening');
        setLiveTranscript((prev) => [
          ...prev,
          {
            sender: 'agro_ai',
            text: '🎙️ Live Voice connected to gemini-3.8-live! Speak into your microphone anytime.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            console.error('Live API server error:', msg.error);
            setLiveTranscript((prev) => [
              ...prev,
              {
                sender: 'agro_ai',
                text: `Live API notice: ${msg.error}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            return;
          }

          if (msg.interrupted) {
            // Cancel audio playback queue
            liveAudioSourcesRef.current.forEach((src) => {
              try {
                src.stop();
              } catch {}
            });
            liveAudioSourcesRef.current = [];
            if (outputAudioCtxRef.current) {
              nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
            }
            setLiveStatus('listening');
            return;
          }

          if (msg.audio) {
            playLiveAudioChunk(msg.audio);
          }
        } catch (e) {
          console.warn('Live message parse error:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket live error:', err);
        setLiveStatus('disconnected');
      };

      ws.onclose = () => {
        setIsLiveActive(false);
        setLiveStatus('disconnected');
      };

      // Mic processor loop
      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to 16-bit PCM
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert PCM buffer to base64
        const bytes = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Audio = btoa(binary);

        wsRef.current.send(JSON.stringify({ audio: base64Audio }));
      };

      source.connect(processor);
      processor.connect(inputAudioCtxRef.current.destination);
    } catch (err: any) {
      console.error('Failed to start Live conversation:', err);
      alert(`Could not start live voice: ${err?.message || 'Microphone access denied.'}`);
      setIsLiveActive(false);
      setLiveStatus('disconnected');
    }
  };

  // Playback Live 24kHz PCM chunks with gapless scheduling
  const playLiveAudioChunk = (base64Data: string) => {
    const ctx = outputAudioCtxRef.current;
    if (!ctx) return;

    try {
      setLiveStatus('speaking');
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit LE PCM to Float32
      const int16View = new Int16Array(bytes.buffer);
      const audioBuffer = ctx.createBuffer(1, int16View.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < int16View.length; i++) {
        channelData[i] = int16View[i] / 32768.0;
      }

      const sourceNode = ctx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(ctx.destination);

      const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
      sourceNode.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;

      liveAudioSourcesRef.current.push(sourceNode);
      sourceNode.onended = () => {
        liveAudioSourcesRef.current = liveAudioSourcesRef.current.filter((s) => s !== sourceNode);
        if (liveAudioSourcesRef.current.length === 0) {
          setLiveStatus('listening');
        }
      };
    } catch (err) {
      console.warn('Playback error:', err);
    }
  };

  // Interrupt Live Audio
  const handleInterruptLive = () => {
    liveAudioSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    liveAudioSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setLiveStatus('listening');
  };

  // Stop Live Conversation
  const stopLiveConversation = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    liveAudioSourcesRef.current = [];
    setIsLiveActive(false);
    setLiveStatus('disconnected');
  };

  useEffect(() => {
    return () => {
      stopLiveConversation();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  // --- 3. GOOGLE MAPS GROUNDING SEARCH ---
  const handleSearchMaps = async (customQuery?: string) => {
    const q = customQuery || mapsQuery.trim();
    if (!q || isSearchingMaps) return;

    setIsSearchingMaps(true);
    setMapsResultText(null);

    try {
      const res = await fetch('/api/agro-ai/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          district: selectedDistrict,
          latitude: userCoords?.lat,
          longitude: userCoords?.lng,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMapsResultText(data.text);
        setMapsPlaces(data.places || []);
        setIsLiveMapsGrounding(!!data.isLiveMaps);
      } else {
        throw new Error(data.error || 'Failed to search places.');
      }
    } catch (err: any) {
      console.error('Maps scout error:', err);
      setMapsResultText(
        `Unable to reach Google Maps scout: ${err?.message || 'Check connection or retry.'}`
      );
    } finally {
      setIsSearchingMaps(false);
    }
  };

  // Run initial maps search if opening tab
  useEffect(() => {
    if (activeMode === 'maps_scout' && mapsPlaces.length === 0) {
      handleSearchMaps('APMC Mandi Yard and Krishi Vigyan Kendra');
    }
  }, [activeMode]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* 1. Header Banner & Agro AI Hero */}
      <div className="bg-gradient-to-r from-[#16271C] via-[#1E3A2B] to-[#16271C] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                Next-Gen Multimodal Agri Suite
              </span>
              <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Google Gemini Powered
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
              Agro AI Copilot
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl leading-relaxed">
              Autonomous agronomic reasoning, real-time voice conversations via <code className="bg-emerald-950/60 text-emerald-300 px-1 py-0.5 rounded text-xs font-mono font-bold">gemini-3.8-live</code>, and agricultural places grounding with Google Maps.
            </p>
          </div>

          {/* Three Main Mode Tabs */}
          <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto backdrop-blur-md">
            <button
              onClick={() => setActiveMode('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'chat'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chat Copilot</span>
            </button>

            <button
              onClick={() => setActiveMode('live_voice')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'live_voice'
                  ? 'bg-rose-600 text-white shadow-md animate-pulse'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live Voice</span>
            </button>

            <button
              onClick={() => setActiveMode('maps_scout')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'maps_scout'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Maps & Mandis</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB 1: MULTI-TURN CHAT INTERFACE */}
      {activeMode === 'chat' && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col min-h-[640px]">
          {/* Top Controls: Language Option, Model Switcher, System Role & Clear Chat */}
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* 22 Constitutional Languages Option Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 bg-emerald-100/90 text-emerald-900 px-2.5 py-1 rounded-xl border border-emerald-300">
                <Globe className="w-3.5 h-3.5 text-emerald-700" /> Language:
              </span>
              <select
                value={selectedLangCode}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl border-2 border-emerald-600 bg-white text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                title="Select from 22 Recognized Languages of the Indian Constitution"
              >
                {CONSTITUTIONAL_22_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Gemini Model Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Model:
              </span>

              <button
                onClick={() => setSelectedModel('gemini-3.8-flash')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedModel === 'gemini-3.8-flash'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Recommended for general agricultural reasoning, crop advice, and weather planning"
              >
                🌿 gemini-3.8-flash <span className="text-[10px] opacity-80">(Flagship)</span>
              </button>

              <button
                onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Deep agricultural reasoning: complex soil chemistry, multi-year rotations, disease diagnosis"
              >
                🔬 gemini-3.1-pro-preview <span className="text-[10px] opacity-80">(Complex Tasks)</span>
              </button>

              <button
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Ultra-fast quick queries and rapid calculations"
              >
                ⚡ gemini-3.1-flash-lite <span className="text-[10px] opacity-80">(Fast)</span>
              </button>
            </div>

            {/* System Role Preset Selector & Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-blue-600" /> Specialist:
              </span>
              <select
                value={systemRole}
                onChange={(e) => setSystemRole(e.target.value as SystemRole)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
              >
                <option value="agronomist">🌾 Chief Agronomist (All-Round Crop Production)</option>
                <option value="soil_expert">🧪 Soil & Nutrient Doctor (NPK & Fertilizers)</option>
                <option value="pest_doctor">🐛 Plant Pathology & Pest Specialist (IPM)</option>
                <option value="market_analyst">📈 Mandi & APMC Strategist (Rates & Sales)</option>
                <option value="climate_advisor">🌦️ Climate & Weather Risk Advisor</option>
                <option value="scheme_expert">🏛️ Govt Schemes & Subsidies Specialist</option>
              </select>

              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 22 Constitutional Languages Quick-Select Bar */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-emerald-200/80 flex items-center gap-2 text-xs overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-extrabold text-emerald-950 shrink-0 flex items-center gap-1 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>22 Languages:</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {CONSTITUTIONAL_22_LANGUAGES.map((lang) => {
                const isSelected = selectedLangCode === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                        : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100/70 hover:text-emerald-900'
                    }`}
                    title={`Switch Agro AI response language to ${lang.name} (${lang.nativeName})`}
                  >
                    {lang.nativeName} <span className="text-[10px] opacity-75">({lang.name})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strict Language Guarantee Banner */}
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white text-xs font-semibold flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block shrink-0" />
              <span>
                Agro AI Response Language: <strong className="text-emerald-200 underline decoration-emerald-400 underline-offset-2">{currentLangObj.nativeName} ({currentLangObj.name})</strong> — Agro AI will respond strictly in <strong>{currentLangObj.name}</strong> (NOT in English).
              </span>
            </div>
            <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-700">
              🇮🇳 22 Constitutional Languages
            </span>
          </div>

          {/* Dynamic Role-specific Quick Prompts Strip */}
          <div className="px-5 py-2.5 bg-emerald-50/50 border-b border-emerald-100/60 overflow-x-auto scrollbar-none flex items-center gap-2 text-xs">
            <span className="text-[10px] font-bold text-emerald-800 shrink-0 uppercase tracking-wider">
              {systemRole === 'agronomist'
                ? '🌾 Agronomy Queries:'
                : systemRole === 'soil_expert'
                ? '🧪 Soil Inquiries:'
                : systemRole === 'pest_doctor'
                ? '🐛 Pest Remedies:'
                : systemRole === 'market_analyst'
                ? '📈 Mandi Topics:'
                : systemRole === 'climate_advisor'
                ? '🌦️ Weather Actions:'
                : '🏛️ Schemes & Subsidies:'}
            </span>
            {(ROLE_SUGGESTIONS[systemRole] || ROLE_SUGGESTIONS.agronomist).map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 rounded-lg shrink-0 font-medium transition cursor-pointer text-[11px]"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[500px]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                      isUser
                        ? 'bg-slate-800 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isUser ? '👨‍🌾' : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5`}>
                    <div className={`flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[11px] font-bold text-slate-500">
                        {isUser ? user?.name || 'You (Farmer)' : 'Agro AI'}
                      </span>
                      {msg.modelUsed && (
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                          {msg.modelUsed}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {/* Attached Crop Image if sent by user */}
                      {msg.image && (
                        <div className="mb-3">
                          <img
                            src={msg.image}
                            alt="Crop / Leaf sample"
                            className="rounded-xl max-h-56 max-w-full object-cover border border-white/20 shadow-sm"
                          />
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Action buttons for model replies */}
                      {!isUser && (
                        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-200/60">
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
                          >
                            {playingAudioId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                                <span>Stop Reading</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Read Aloud</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer ml-3"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Advice</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Agro AI ({selectedModel}) is analyzing agricultural knowledge base...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Box with Camera & Voice Mic */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
            {/* Attached Photo Preview Pill */}
            {attachedImage && (
              <div className="flex items-center justify-between gap-3 p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-2xl max-w-md">
                <div className="flex items-center gap-2.5">
                  <img
                    src={attachedImage.preview}
                    alt="Upload thumbnail"
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block truncate max-w-[200px]">
                      {attachedImage.name}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-medium">
                      Leaf/Crop image ready for diagnosis
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="p-1 text-emerald-900 hover:text-rose-600 rounded-lg transition cursor-pointer"
                  title="Remove Photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Hidden File Input for Camera/Gallery */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Camera Photo Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-300 hover:border-emerald-400 rounded-2xl transition cursor-pointer shadow-sm shrink-0 flex items-center justify-center"
                title="Attach plant/leaf photo for multimodal disease analysis"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Voice Input Mic Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-3 rounded-2xl border transition cursor-pointer shadow-sm shrink-0 flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border-slate-300 hover:border-emerald-400'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to speak question'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                placeholder={
                  isListening
                    ? `Listening in ${currentLangObj.name} (${currentLangObj.nativeName})... Speak your question`
                    : attachedImage
                    ? `Describe symptoms for diagnosis in ${currentLangObj.name} (${currentLangObj.nativeName})...`
                    : `Ask Agro AI in ${currentLangObj.name} (${currentLangObj.nativeName}) — answers strictly in ${currentLangObj.name}...`
                }
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isSending}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />

              <button
                type="submit"
                disabled={(!inputQuery.trim() && !attachedImage) || isSending}
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md shrink-0"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Language Guarantee Indicator under input */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <Globe className="w-3 h-3 text-emerald-600" />
                Active Language: <strong className="text-emerald-950 font-bold">{currentLangObj.nativeName} ({currentLangObj.name})</strong> — Agro AI answers strictly in this language, NOT in English
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                8th Schedule • 22 Official Languages
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: LIVE VOICE CONVERSATION (gemini-3.8-live) */}
      {activeMode === 'live_voice' && (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-rose-100 text-rose-700 rounded-xl">
                  <Radio className="w-4 h-4 text-rose-600" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Live Voice Conversation
                </h2>
                <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct real-time two-way audio streaming via WebSocket Live API. Speak into your mic and listen to instant responses.
              </p>
            </div>

            {/* Voice Persona Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Voice Persona:</label>
              <select
                value={liveVoiceName}
                onChange={(e) => setLiveVoiceName(e.target.value as any)}
                disabled={isLiveActive}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer disabled:opacity-60"
              >
                <option value="Zephyr">Zephyr (Warm & Conversational)</option>
                <option value="Puck">Puck (Energetic & Dynamic)</option>
                <option value="Kore">Kore (Gentle & Clear)</option>
                <option value="Fenrir">Fenrir (Authoritative & Deep)</option>
              </select>
            </div>
          </div>

          {/* Interactive Voice Stage Card */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-inner space-y-6">
            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold font-mono bg-white/10 border border-white/20">
              <span
                className={`w-2 h-2 rounded-full ${
                  liveStatus === 'connected' || liveStatus === 'listening'
                    ? 'bg-emerald-400 animate-ping'
                    : liveStatus === 'speaking'
                    ? 'bg-rose-400 animate-pulse'
                    : liveStatus === 'connecting'
                    ? 'bg-amber-400 animate-bounce'
                    : 'bg-slate-400'
                }`}
              />
              <span className="capitalize">
                {liveStatus === 'connected' || liveStatus === 'listening'
                  ? 'Listening to Farmer (Speak Now)...'
                  : liveStatus === 'speaking'
                  ? 'Agro AI is Speaking...'
                  : liveStatus === 'connecting'
                  ? 'Connecting to gemini-3.8-live...'
                  : 'Live Session Inactive'}
              </span>
            </div>

            {/* Pulsing Visualizer Rings */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              {isLiveActive && (
                <>
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/10 animate-pulse" />
                </>
              )}
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all transform ${
                  isLiveActive
                    ? 'bg-gradient-to-tr from-rose-600 to-emerald-600 scale-105'
                    : 'bg-slate-800 border-2 border-slate-700'
                }`}
              >
                {isLiveActive ? (
                  <Mic className="w-10 h-10 text-white animate-pulse" />
                ) : (
                  <MicOff className="w-10 h-10 text-slate-500" />
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {!isLiveActive ? (
                <button
                  onClick={startLiveConversation}
                  disabled={liveStatus === 'connecting'}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <Radio className="w-4 h-4" />
                  <span>Start Live Conversation</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleInterruptLive}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    title="Stop AI speech and resume listening immediately"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Interrupt AI</span>
                  </button>

                  <button
                    onClick={stopLiveConversation}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>End Voice Call</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
              Live API operates over low-latency 16kHz PCM audio stream to model <span className="font-mono text-emerald-400">gemini-3.8-live</span> with 24kHz synthesized speech feedback.
            </p>
          </div>

          {/* Live Session Activity Feed */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Session Activity & Log
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {liveTranscript.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-800">
                      {t.sender === 'agro_ai' ? '🌿 Agro AI:' : '👨‍🌾 You:'}
                    </span>
                    <span className="text-slate-700">{t.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: GOOGLE MAPS AGRICULTURAL SCOUT (gemini-3.5-flash with googleMaps tool) */}
      {activeMode === 'maps_scout' && (
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="p-1.5 bg-blue-100 text-blue-700 rounded-xl">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Agricultural Places & Infrastructure Scout
                </h2>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  gemini-3.5-flash • googleMaps tool
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Grounding with Google Maps to discover verified Mandis, Krishi Vigyan Kendras, Rythu Bharosa Kendras, and cold storage facilities.
              </p>
            </div>

            {/* Geolocation Pin status */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{userCoords ? 'GPS Acquired' : 'Use My GPS'}</span>
              </button>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {['Guntur', 'Hyderabad', 'Warangal', 'Krishna', 'Kurnool', 'Visakhapatnam', 'Rangareddy'].map((d) => (
                  <option key={d} value={d}>
                    District: {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchMaps();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Search agricultural places: e.g. Nearest Chilli Mandi, Cold Storage, Seed Store, KVK..."
              value={mapsQuery}
              onChange={(e) => setMapsQuery(e.target.value)}
              disabled={isSearchingMaps}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSearchingMaps}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              <Compass className={`w-4 h-4 ${isSearchingMaps ? 'animate-spin' : ''}`} />
              <span>{isSearchingMaps ? 'Scouting...' : 'Search Places'}</span>
            </button>
          </form>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Categories:</span>
            {[
              'APMC Chilli & Grain Mandis',
              'Krishi Vigyan Kendra (KVK)',
              'Rythu Bharosa Kendra (RBK)',
              'Certified Seed & Fertilizer Depots',
              'Agricultural Cold Storage',
              'Soil Testing Laboratory',
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => {
                  setMapsQuery(cat);
                  handleSearchMaps(cat);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg border border-slate-200 transition cursor-pointer text-[11px] font-medium"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Verified Grounding Places Cards Grid */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                <span>Verified Agricultural Places in {selectedDistrict}</span>
                <span className="text-xs font-mono font-normal bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {mapsPlaces.length} locations
                </span>
              </h3>
              {isLiveMapsGrounding && (
                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <Globe className="w-3 h-3 text-blue-600" /> Live Google Maps Grounding
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mapsPlaces.map((place, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl p-5 transition shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                        {place.type || 'Agricultural Facility'}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 font-serif">
                      {place.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{place.address}</span>
                    </p>

                    {place.timing && (
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{place.timing}</span>
                      </p>
                    )}

                    {place.features && place.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {place.features.map((f: string, fi: number) => (
                          <span
                            key={fi}
                            className="bg-white text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Direct Link to Google Maps */}
                  <a
                    href={place.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-300 hover:border-blue-600 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              ))}
            </div>

            {/* AI Analytical Narrative */}
            {mapsResultText && (
              <div className="mt-6 p-5 bg-blue-50/50 border border-blue-200 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                <span className="font-bold text-blue-900 block mb-1">
                  Agro AI Scout Guidance & Insights:
                </span>
                {mapsResultText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
