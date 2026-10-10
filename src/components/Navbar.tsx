import React, { useState } from 'react';
import {
  Sprout,
  User as UserIcon,
  Bell,
  Smartphone,
  Globe,
  LogOut,
  ShieldAlert,
  UserCheck,
  Building2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { User, UserRole, Language } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../i18n';

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole;
  language: Language;
  unreadCount: number;
  isMobilePreview: boolean;
  isFarmerMode?: boolean;
  isDemoMode?: boolean;
  activeTab?: string;
  onSwitchRole: (role: UserRole) => void;
  onSelectLanguage: (lang: Language) => void;
  onToggleMobilePreview: () => void;
  onToggleFarmerMode?: () => void;
  onToggleDemoFarmer?: () => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  language,
  unreadCount,
  isMobilePreview,
  isFarmerMode,
  isDemoMode = true,
  activeTab = 'dashboard',
  onSwitchRole,
  onSelectLanguage,
  onToggleMobilePreview,
  onToggleFarmerMode,
  onToggleDemoFarmer,
  onOpenNotifications,
  onLogout,
  onOpenAuthModal,
  onNavigate,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  return (
    <header className="sticky top-0 z-40 bg-[#16271C] text-[#E8F1E9] shadow-lg border-b border-emerald-900/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and App Title */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl font-extrabold italic text-[#16271C] shadow-md transform group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-serif">
                AgroSaarthi
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> 2.0 AI Copilot
              </span>
            </div>
            <p className="text-[10px] text-emerald-300/80 hidden sm:block tracking-wide font-medium">
              Proactive Agricultural Decision Support System
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">

          {/* Agro AI Direct Shortcut */}
          <button
            onClick={() => onNavigate('agroAi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition border cursor-pointer ${
              activeTab === 'agroAi'
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md ring-2 ring-emerald-300/50'
                : 'bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 shadow-sm'
            }`}
            title="Open Agro AI (Multi-turn Chat, Live Voice & Maps Scout)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Agro AI</span>
          </button>

          {/* Simple Farmer Mode Toggle */}
          {onToggleFarmerMode && (
            <button
              onClick={onToggleFarmerMode}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border ${
                isFarmerMode
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-white/10 hover:bg-white/15 text-emerald-100 border-white/10'
              }`}
              title="Toggle Large-Button Mobile Farmer Mode"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">
                {isFarmerMode ? 'Exit Farmer Mode' : 'Farmer Mode'}
              </span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-emerald-100 border border-white/15 flex items-center space-x-1.5 shadow-sm"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase font-bold tracking-wider">{language}</span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-1 text-slate-800 border border-emerald-100 z-50 max-h-72 overflow-y-auto">
                {SUPPORTED_LANGUAGES.map((langOpt) => (
                  <button
                    key={langOpt.code}
                    onClick={() => {
                      onSelectLanguage(langOpt.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between transition-colors ${
                      language === langOpt.code ? 'font-extrabold text-emerald-800 bg-emerald-50/80' : 'font-medium'
                    }`}
                  >
                    <span>
                      {langOpt.nativeName}{' '}
                      {langOpt.name !== langOpt.nativeName && (
                        <span className="text-[10px] text-slate-400 ml-1">({langOpt.name})</span>
                      )}
                    </span>
                    {language === langOpt.code && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-emerald-200 border border-white/15 flex items-center space-x-1.5 shadow-sm"
            >
              {currentRole === 'farmer' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
              {currentRole === 'officer' && <Building2 className="w-3.5 h-3.5 text-sky-400" />}
              {currentRole === 'admin' && <ShieldAlert className="w-3.5 h-3.5 text-[#F27D26]" />}
              <span className="capitalize text-white hidden sm:inline">{t(`${currentRole}Role`)}</span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl py-2 text-slate-800 border border-emerald-100 z-50">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('switchRole')} Demo
                </div>
                <button
                  onClick={() => {
                    onSwitchRole('farmer');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-emerald-50 flex items-center space-x-2 ${
                    currentRole === 'farmer' ? 'bg-emerald-50 text-emerald-800 font-bold' : ''
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Farmer View</div>
                    <div className="text-[10px] text-slate-500">Farmer Dashboard & Fields</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onSwitchRole('officer');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-sky-50 flex items-center space-x-2 ${
                    currentRole === 'officer' ? 'bg-sky-50 text-sky-800 font-bold' : ''
                  }`}
                >
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <div>
                    <div className="font-semibold">Government Officer</div>
                    <div className="text-[10px] text-slate-500">Dr. Murthy (District Agri)</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onSwitchRole('admin');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-orange-50 flex items-center space-x-2 ${
                    currentRole === 'admin' ? 'bg-orange-50 text-[#F27D26] font-bold' : ''
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-[#F27D26]" />
                  <div>
                    <div className="font-semibold">Admin Panel</div>
                    <div className="text-[10px] text-slate-500">State Command Center</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigate('alerts')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-100 relative transition-colors border border-white/10"
            title="View Alerts & Advisories"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#16271C]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          {currentUser ? (
            <div className="flex items-center space-x-1.5 pl-1.5 border-l border-emerald-900/60">
              <button
                onClick={() => onNavigate('myProfile')}
                className="flex items-center space-x-2 text-xs font-medium hover:text-emerald-300 transition-colors"
                title="View Farmer Profile"
              >
                <img
                  src={
                    currentUser.profilePhoto ||
                    'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser.name || currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400"
                />
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 text-emerald-300 hover:text-rose-300 hover:bg-white/10 rounded-xl transition-colors"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white transition-colors"
              >
                {t('login')}
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-colors"
              >
                {t('register')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

