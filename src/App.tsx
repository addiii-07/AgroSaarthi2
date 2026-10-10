import React, { useState, useEffect } from 'react';
import {
  User,
  FarmDetails,
  GovernmentScheme,
  Advisory,
  MarketPriceItem,
  Language,
} from './types';
import {
  MOCK_USERS,
  MOCK_FARMS,
  MOCK_GOVT_SCHEMES,
  MOCK_ADVISORIES,
  MOCK_MARKET_PRICES,
  MOCK_WEATHER_DATA,
} from './data/mockData';
import {
  supabase,
  fetchFarmerProfileFromSupabase,
  fetchFarmsFromSupabase,
  mapSupabaseFarmToDetails,
} from './lib/supabase';

import { Navbar } from './components/Navbar';
import { GoogleTranslator } from './components/GoogleTranslator';
import { getTranslation } from './i18n';
import { AuthModal } from './components/AuthModal';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MyFarm } from './components/MyFarm';
import { MyProfile } from './components/MyProfile';
import { GovernmentSchemes } from './components/GovernmentSchemes';
import { NotificationsModal } from './components/NotificationsModal';

// AgroSaarthi 2.0 Core Components
import { HomeDashboard2 } from './components/HomeDashboard2';
import { FarmHealthPage } from './components/FarmHealthPage';
import { AlertCenter } from './components/AlertCenter';
import { MarketAdvisorPage } from './components/MarketAdvisorPage';
import { WeatherDashboard2 } from './components/WeatherDashboard2';
import { CropAdvisor2 } from './components/CropAdvisor2';
import { AskAgroSaarthi2 } from './components/AskAgroSaarthi2';
import { TrustCenter } from './components/TrustCenter';
import { ExpertEscalationModal } from './components/ExpertEscalationModal';
import { LandingPage } from './components/LandingPage';
import { MobileFarmerMode } from './components/MobileFarmerMode';
import { VoiceAssistant } from './components/VoiceAssistant';
import { AgroAi } from './components/AgroAi';

import {
  Home,
  Sprout,
  Activity,
  TrendingUp,
  CloudRain,
  BookOpen,
  FileText,
  AlertTriangle,
  Bot,
  Layers,
  User as UserIcon,
  ShieldCheck,
  Smartphone,
  Lock,
  Sparkles,
} from 'lucide-react';

function buildFarmDetailsFromUser(user: User): FarmDetails {
  const landAreaMatch = user.farm_size
    ? parseFloat(String(user.farm_size))
    : user.farmSize
    ? parseFloat(String(user.farmSize))
    : 2;
  const landArea = isNaN(landAreaMatch) || landAreaMatch <= 0 ? 2 : landAreaMatch;

  return {
    id: `farm-${user.id}`,
    userId: user.id,
    landArea,
    landUnit: 'Acres',
    soilType: (user.soil_type as any) || (user.soilType as any) || 'Black Soil',
    irrigationType: (user.irrigation_type as any) || (user.irrigationType as any) || 'Canal/Borewell',
    cropSeason: (user.season as any) || 'Kharif',
    previousCrop: 'None',
    farmLocation: {
      address: `${user.village || user.villageMandal || 'Village'}, ${user.district || 'Telangana'}`,
    },
    farmImages: [],
    updatedAt: new Date().toISOString(),
  };
}

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentFarm, setCurrentFarm] = useState<FarmDetails | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isFarmerMode, setIsFarmerMode] = useState(false);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  // Dynamic Data
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(MOCK_GOVT_SCHEMES);
  const [advisories, setAdvisories] = useState<Advisory[]>(MOCK_ADVISORIES);
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>(MOCK_MARKET_PRICES);

  const loadUserDataForSession = async (userId: string) => {
    try {
      // 1. Load profile from Supabase farmers table for that user only
      const { data: farmerData, error: farmerError } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', userId)
        .limit(1);

      if (farmerError) {
        console.error('Error loading farmer profile from Supabase:', farmerError.message);
      }

      const farmerProfile = farmerData && farmerData.length > 0 ? farmerData[0] : null;
      console.log('App: loaded farmers row from Supabase:', farmerProfile);

      // 2. Load farms from Supabase farms table for that user only
      const { data: farmsData, error: farmsError } = await supabase
        .from('farms')
        .select('*')
        .eq('farmer_id', userId)
        .order('id', { ascending: false });

      if (farmsError) {
        console.error('Error loading farms from Supabase:', farmsError.message);
      }

      const farmRecord = farmsData && farmsData.length > 0 ? farmsData[0] : null;

      const { data: { user: authUser } } = await supabase.auth.getUser();
      const meta = authUser?.user_metadata || {};

      const resolvedDisplayName =
        farmerProfile?.full_name || farmerProfile?.name || meta.full_name || meta.fullName || meta.name || 'Farmer';

      const loadedUser: User = {
        id: userId,
        name: resolvedDisplayName,
        fullName: resolvedDisplayName,
        full_name: resolvedDisplayName,
        phone: farmerProfile?.phone || meta.phone || meta.mobile || '',
        mobile: farmerProfile?.phone || meta.phone || meta.mobile || '',
        role: meta.role || 'farmer',
        state: farmerProfile?.state || meta.state || 'Telangana',
        district: farmerProfile?.district || meta.district || '',
        village: farmerProfile?.village || meta.village || meta.villageMandal || '',
        villageMandal: farmerProfile?.village || meta.village || meta.villageMandal || '',
        crop: farmRecord?.crop || meta.crop || meta.primaryCrop || '',
        primaryCrop: farmRecord?.crop || meta.crop || meta.primaryCrop || '',
        farm_size: farmRecord?.area_acres != null ? `${farmRecord.area_acres} Acres` : '',
        farmSize: farmRecord?.area_acres != null ? `${farmRecord.area_acres} Acres` : '',
        soil_type: farmRecord?.soil_type || '',
        soilType: farmRecord?.soil_type || '',
        irrigation_type: farmRecord?.irrigation || '',
        irrigationType: farmRecord?.irrigation || '',
        sowing_date: farmRecord?.sowing_date || '',
        sowingDate: farmRecord?.sowing_date || '',
        language: farmerProfile?.language || meta.language || 'en',
        preferredLanguage: (farmerProfile?.language || meta.language || 'en') as Language,
        createdAt: authUser?.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      };

      setCurrentUser(loadedUser);
      if (loadedUser.language) {
        setLanguage(loadedUser.language as Language);
      }

      if (farmRecord) {
        setCurrentFarm({
          id: farmRecord.id || `farm-${userId}`,
          userId,
          landArea: Number(farmRecord.area_acres || 0),
          landUnit: 'Acres',
          soilType: farmRecord.soil_type || 'Black Soil',
          irrigationType: farmRecord.irrigation || 'Drip',
          cropSeason: farmRecord.crop_season || 'Kharif',
          previousCrop: farmRecord.previous_crop || '',
          farmLocation: {
            address: farmRecord.address || farmRecord.name || 'Main Farm Plot',
          },
          farmImages: [],
          updatedAt: farmRecord.sowing_date || new Date().toISOString().split('T')[0],
        });
      } else {
        setCurrentFarm(buildFarmDetailsFromUser(loadedUser));
      }
    } catch (e) {
      console.error('Error loading user data from Supabase:', e);
    }
  };

  // Load real authenticated session from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session get error:', sessionError);
        }
        if (session?.user && isMounted) {
          await loadUserDataForSession(session.user.id);
        }
      } catch (e) {
        console.error('Error restoring Supabase session:', e);
      }
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && isMounted) {
        await loadUserDataForSession(session.user.id);
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setCurrentUser(null);
        setCurrentFarm(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Switch User Role (Farmer, Officer, Admin)
  const handleRoleChange = (role: 'farmer' | 'officer' | 'admin') => {
    if (role === 'farmer') {
      if (currentUser) {
        setCurrentUser({ ...currentUser, role: 'farmer' });
      }
    } else {
      const targetUser = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
      setCurrentUser(targetUser);
    }
    setActiveTab('dashboard');
  };

  // Login handler
  const handleLoginSuccess = async (user: User) => {
    await loadUserDataForSession(user.id);
    setActiveTab('dashboard');
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setCurrentUser(null);
    setCurrentFarm(null);
    setActiveTab('dashboard');
  };

  // AgroSaarthi 2.0 Farmer Primary Navigation Tabs
  const farmerTabs = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'myFarm', label: 'My Farm', icon: <Layers className="w-4 h-4 text-emerald-600" /> },
    { id: 'farmHealth', label: 'Farm Health', icon: <Activity className="w-4 h-4 text-teal-600" /> },
    { id: 'market', label: 'Market Advisor', icon: <TrendingUp className="w-4 h-4 text-blue-600" /> },
    { id: 'weather', label: 'Weather Risk', icon: <CloudRain className="w-4 h-4 text-sky-600" /> },
    { id: 'cropAdvisor', label: 'Crop Advisor', icon: <Sprout className="w-4 h-4 text-amber-600" /> },
    { id: 'schemes', label: 'Govt Schemes', icon: <FileText className="w-4 h-4 text-teal-700" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4 text-rose-600" /> },
    { id: 'agroAi', label: 'Agro AI', icon: <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" /> },
    { id: 'askAgroSaarthi', label: 'Ask Copilot', icon: <Bot className="w-4 h-4 text-emerald-700" /> },
    { id: 'trustCenter', label: 'Trust Center', icon: <ShieldCheck className="w-4 h-4 text-slate-600" /> },
  ];

  // If in Simplified Mobile Farmer Mode
  if (isFarmerMode && currentUser?.role === 'farmer') {
    return (
      <div className="min-h-screen bg-[#F8FAF6] text-slate-800 font-sans">
        <GoogleTranslator language={language} />
        <MobileFarmerMode
          user={currentUser}
          farm={currentFarm || buildFarmDetailsFromUser(currentUser)}
          language={language}
          onNavigate={(tab) => {
            setActiveTab(tab);
            setIsFarmerMode(false);
          }}
          onExit={() => setIsFarmerMode(false)}
        />
      </div>
    );
  }

  // If Landing Page is explicitly requested or user is logged out
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F7F2] text-slate-800 font-sans flex flex-col">
        <GoogleTranslator language={language} />
        <header className="sticky top-0 z-40 bg-[#16271C] text-[#E8F1E9] p-4 shadow-lg flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-lg font-bold text-[#16271C]">
              A
            </div>
            <span className="text-xl font-extrabold text-white font-serif">AgroSaarthi</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
              2.0
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentUser(MOCK_USERS[0]);
                setActiveTab('agroAi');
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              title="Test Agro AI Copilot directly"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Try Agro AI</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:text-white transition rounded-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Register as Farmer
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <LandingPage
            onEnterApp={() => {
              setAuthMode('register');
              setIsAuthModalOpen(true);
            }}
            onEnterDemo={() => {
              setCurrentUser(MOCK_USERS[0]);
              setActiveTab('agroAi');
            }}
            onSignIn={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            onRegister={() => {
              setAuthMode('register');
              setIsAuthModalOpen(true);
            }}
          />
        </main>

        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            initialMode={authMode}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            onSuccess={handleLoginSuccess}
          />
        )}

        {/* Floating Voice Assistant */}
        <VoiceAssistant
          currentUser={currentUser}
          onOpenAuthModal={(mode) => {
            setAuthMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
        />
      </div>
    );
  }

  const activeFarm = currentFarm || buildFarmDetailsFromUser(currentUser);

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-slate-800 font-sans flex flex-col selection:bg-emerald-200">
      {/* Dynamic DOM Translation */}
      <GoogleTranslator language={language} />

      {/* Top Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentUser.role}
        language={language}
        unreadCount={3}
        isMobilePreview={isMobilePreview}
        isFarmerMode={isFarmerMode}
        activeTab={activeTab}
        onSwitchRole={handleRoleChange}
        onSelectLanguage={setLanguage}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        onToggleFarmerMode={() => setIsFarmerMode(!isFarmerMode)}
        onOpenNotifications={() => setActiveTab('alerts')}
        onLogout={handleLogout}
        onOpenAuthModal={(mode) => {
          setAuthMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Primary Content Container */}
      <main
        className={`flex-1 transition-all duration-300 mx-auto w-full p-4 sm:p-6 pb-24 ${
          isMobilePreview
            ? 'max-w-md bg-[#F4F7F2] min-h-[750px] shadow-2xl rounded-3xl my-4 border-8 border-[#16271C]'
            : 'max-w-7xl'
        }`}
      >
        {/* Navigation Secondary Bar for Farmer */}
        {currentUser.role === 'farmer' && (
          <div className="mb-6 overflow-x-auto scrollbar-none pb-2 border-b border-emerald-900/10 hidden sm:flex items-center space-x-2 text-xs font-bold">
            {farmerTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-2xl transition-all flex items-center space-x-2 shrink-0 ${
                    isActive
                      ? 'bg-[#16271C] text-emerald-400 shadow-md border border-emerald-800'
                      : 'bg-white text-slate-700 hover:bg-emerald-50/80 border border-emerald-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.id === 'alerts' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 ml-0.5" />
                  )}
                </button>
              );
            })}

            <div className="ml-auto flex items-center space-x-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => setActiveTab('trustCenter')}
                className={`px-3 py-2 rounded-2xl border font-bold flex items-center space-x-1.5 transition ${
                  activeTab === 'trustCenter'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
                title="Verify Supabase Backend & Deployed Edge Functions"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backend Status</span>
              </button>
              <button
                onClick={() => setActiveTab('myProfile')}
                className={`px-3.5 py-2.5 rounded-2xl border font-bold flex items-center space-x-1.5 ${
                  activeTab === 'myProfile'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50/80'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Profile (16 Fields)</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Route View Switching for Farmer */}
        {currentUser.role === 'farmer' && (
          <>
            {activeTab === 'dashboard' && (
              <HomeDashboard2
                user={currentUser}
                farm={activeFarm}
                language={language}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenExpertModal={() => setIsExpertModalOpen(true)}
              />
            )}

            {activeTab === 'myFarm' && (
              <MyFarm
                farm={activeFarm}
                userId={currentUser.id}
                onUpdateFarm={(updated) => setCurrentFarm(updated)}
              />
            )}

            {activeTab === 'farmHealth' && (
              <FarmHealthPage
                user={currentUser}
                farm={activeFarm}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenExpertModal={() => setIsExpertModalOpen(true)}
              />
            )}

            {activeTab === 'market' && (
              <MarketAdvisorPage
                user={currentUser}
                farm={activeFarm}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'weather' && (
              <WeatherDashboard2
                user={currentUser}
                initialDistrict={currentUser.district || 'Rangareddy'}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'cropAdvisor' && (
              <CropAdvisor2
                user={currentUser}
                language={language}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'schemes' && (
              <GovernmentSchemes currentUser={currentUser} language={language} />
            )}

            {activeTab === 'alerts' && <AlertCenter onNavigate={(tab) => setActiveTab(tab)} />}

            {activeTab === 'agroAi' && (
              <AgroAi
                user={currentUser}
                farm={activeFarm}
                language={language}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'askAgroSaarthi' && (
              <AskAgroSaarthi2
                user={currentUser}
                language={language}
                onOpenExpertModal={() => setIsExpertModalOpen(true)}
              />
            )}

            {activeTab === 'myProfile' && (
              <MyProfile
                user={currentUser}
                onUpdateProfile={(updated) => {
                  setCurrentUser(updated);
                  if (updated.language || updated.preferredLanguage) {
                    setLanguage((updated.language || updated.preferredLanguage) as Language);
                  }
                }}
              />
            )}

            {activeTab === 'trustCenter' && <TrustCenter />}

            {activeTab === 'landing' && (
              <LandingPage
                onEnterApp={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                onEnterDemo={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                onSignIn={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                onRegister={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
              />
            )}
          </>
        )}

        {/* Government Officer View */}
        {currentUser.role === 'officer' && (
          <OfficerDashboard
            user={currentUser}
            schemes={schemes}
            advisories={advisories}
            onAdvisoryPublished={(newAdv) => setAdvisories((prev) => [newAdv, ...prev])}
          />
        )}

        {/* Admin View */}
        {currentUser.role === 'admin' && <AdminDashboard user={currentUser} />}
      </main>

      {/* Mobile View Bottom Navigation Bar (Visible on mobile screens) */}
      {currentUser.role === 'farmer' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 sm:hidden shadow-2xl flex justify-around p-2 text-[10px] font-bold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center p-1 ${
              activeTab === 'dashboard' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('myFarm')}
            className={`flex flex-col items-center p-1 ${
              activeTab === 'myFarm' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span>Farm</span>
          </button>

          <button
            onClick={() => setActiveTab('cropAdvisor')}
            className={`flex flex-col items-center p-1 ${
              activeTab === 'cropAdvisor' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
            }`}
          >
            <Sprout className="w-5 h-5 mb-0.5" />
            <span>Advisor</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center p-1 relative ${
              activeTab === 'alerts' ? 'text-rose-800 font-extrabold' : 'text-slate-500'
            }`}
          >
            <AlertTriangle className="w-5 h-5 mb-0.5 text-rose-600" />
            <span>Alerts</span>
            <span className="w-2 h-2 rounded-full bg-rose-600 absolute top-1 right-2" />
          </button>

          <button
            onClick={() => setActiveTab('askAgroSaarthi')}
            className={`flex flex-col items-center p-1 ${
              activeTab === 'askAgroSaarthi' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
            }`}
          >
            <Bot className="w-5 h-5 mb-0.5 text-emerald-700" />
            <span>Copilot</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-7 border-t border-slate-800 text-center space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold font-serif text-white text-sm">AgroSaarthi 2.0</span>
            <span>• Proactive AI Farm Copilot</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <button onClick={() => setActiveTab('trustCenter')} className="hover:text-emerald-400">
              Trust & Sources
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('myProfile')} className="hover:text-emerald-400">
              Farmer Profile
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('landing')} className="hover:text-emerald-400">
              Landing Page
            </button>
          </div>
          <div className="text-slate-500 text-[11px] font-mono">
            "Know your farm. Know your risks. Know what to do next."
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Notifications Modal */}
      {isNotificationsOpen && (
        <NotificationsModal
          advisories={advisories}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}

      {/* Expert Escalation Modal */}
      {isExpertModalOpen && currentUser && (
        <ExpertEscalationModal
          user={currentUser}
          onClose={() => setIsExpertModalOpen(false)}
        />
      )}

      {/* Floating Voice Assistant */}
      <VoiceAssistant
        currentUser={currentUser}
        onOpenAuthModal={(mode) => {
          setAuthMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}

export default App;
