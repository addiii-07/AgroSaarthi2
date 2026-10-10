import React, { useState, useEffect } from 'react';
import { User, Language, StructuredAiResponse } from '../types';
import { aiService } from '../services/aiService';
import { voiceService, VoiceStatus } from '../services/voiceService';
import {
  logVoiceInteractionToSupabase,
  fetchVoiceInteractionsFromSupabase,
} from '../lib/supabase';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  CheckCircle,
  ExternalLink,
  Globe,
  RefreshCw,
  ArrowRight,
  Database,
} from 'lucide-react';

interface AskAgroSaarthi2Props {
  user: User;
  language: Language;
  onOpenExpertModal: () => void;
}

export const AskAgroSaarthi2: React.FC<AskAgroSaarthi2Props> = ({
  user,
  language: initialLang,
  onOpenExpertModal,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'en' | 'hi' | 'te'>('en');
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null);

  const [history, setHistory] = useState<
    Array<{
      id: string;
      query: string;
      response: StructuredAiResponse;
      timestamp: string;
    }>
  >([
    {
      id: 'demo-1',
      query: 'Should I irrigate my tomato crop today?',
      response: {
        recommendation: 'Delay scheduled irrigation for the next 24 to 36 hours.',
        reason:
          'Heavy rainfall (>30 mm) is predicted with 82% probability in Rangareddy, and current soil moisture (65%) is already adequate for tomato root zones.',
        actions: [
          'Turn off the automated or manual drip irrigation valve immediately.',
          'Clear all furrow drainage exits to prevent ponding and root collar asphyxiation.',
          'Re-check topsoil feel-and-appearance on Wednesday morning before resuming watering.',
        ],
        risk_level: 'medium',
        confidence: 0.92,
        sources: [
          { name: 'IMD Hyderabad High-Resolution Rain Forecast' },
          { name: 'ICAR-IIHR Tomato Water Management Bulletin' },
        ],
        requires_expert: false,
      },
      timestamp: 'Today, 08:15 AM',
    },
  ]);

  const suggestedQuestions = [
    'Should I irrigate today?',
    'Is it a good time to sell?',
    'What should I do this week?',
    'Are there any schemes for me?',
    'My crop leaves are turning yellow.',
  ];

  useEffect(() => {
    voiceService.setCallbacks({
      onStatusChange: (status) => setVoiceStatus(status),
      onTranscript: (transcript) => {
        setQuery(transcript);
        handleSend(transcript);
      },
      onError: (err) => console.warn('Voice error:', err),
    });

    // Optionally load existing voice interaction records from Supabase
    fetchVoiceInteractionsFromSupabase(user.id).then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const loaded = res.data.map((row: any) => ({
          id: `db-voice-${row.id || Math.random()}`,
          query: row.query || '',
          response: {
            recommendation: row.response || '',
            reason: 'Logged from Supabase voice_interactions table',
            actions: [],
            risk_level: 'low' as const,
            confidence: 0.9,
            sources: [{ name: 'Supabase voice_interactions' }],
            requires_expert: false,
          },
          timestamp: row.created_at
            ? new Date(row.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : 'Recent',
        }));
        setHistory((prev) => [...prev, ...loaded]);
      }
    }).catch((e) => console.warn('Voice history fetch note:', e));

    return () => {
      voiceService.cancelSpeech();
      voiceService.stopListening();
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setQuery('');

    try {
      const response = await aiService.askQuestion(q, {
        crop: user.crop || 'Tomato',
        district: user.district || 'Rangareddy',
        language: voiceLang as Language,
      });

      const newEntry = {
        id: `chat-${Date.now()}`,
        query: q,
        response,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [newEntry, ...prev]);

      // Log interaction to Supabase `voice_interactions` table
      logVoiceInteractionToSupabase({
        farmerId: user.id,
        query: q,
        response: response.recommendation || response.reason || 'Agronomic advisory response',
        language: voiceLang,
      }).catch((logErr) => console.warn('Supabase voice_interactions logging note:', logErr));
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (voiceStatus === 'listening') {
      voiceService.stopListening();
    } else {
      voiceService.startListening(voiceLang);
    }
  };

  const handleSpeak = (text: string, index: number) => {
    if (activeSpeechIndex === index) {
      voiceService.cancelSpeech();
      setActiveSpeechIndex(null);
    } else {
      setActiveSpeechIndex(index);
      voiceService.speak(text, voiceLang, () => {
        setActiveSpeechIndex(null);
      });
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    const pct = Math.round(confidence * 100);
    if (pct >= 85) {
      return (
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
          🟢 High ({pct}%) • AI confidence estimate
        </span>
      );
    }
    if (pct >= 70) {
      return (
        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
          🟡 Medium ({pct}%) • AI confidence estimate
        </span>
      );
    }
    return (
      <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-200">
        🔴 Low ({pct}%) • Consider Expert Consultation
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* 1. Header & Voice Configuration */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Bot className="w-4 h-4 text-emerald-700" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Conversational Farm Copilot
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Ask AgroSaarthi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Context-aware agricultural recommendations grounded in your farm profile ({user.crop || 'Tomato'}, {user.district}).
          </p>
        </div>

        {/* Voice Language Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
          <button
            onClick={() => setVoiceLang('en')}
            className={`px-3 py-1 rounded-xl transition-all ${
              voiceLang === 'en' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setVoiceLang('hi')}
            className={`px-3 py-1 rounded-xl transition-all ${
              voiceLang === 'hi' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setVoiceLang('te')}
            className={`px-3 py-1 rounded-xl transition-all ${
              voiceLang === 'te' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* 2. Interactive Input Bar with Voice Feedback */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-300 shadow-md space-y-3">
        {/* Voice Status Pill */}
        {voiceStatus !== 'idle' && (
          <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold animate-pulse">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {voiceStatus === 'listening'
                ? 'Listening to your question... Speak clearly into your mic.'
                : voiceStatus === 'processing'
                ? 'Processing agricultural context...'
                : 'Speaking response aloud...'}
            </span>
            <button
              onClick={() => voiceService.stopListening()}
              className="text-[11px] text-emerald-900 underline font-normal"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            title={voiceStatus === 'listening' ? 'Stop Listening' : 'Click to Speak'}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center flex-shrink-0 ${
              voiceStatus === 'listening'
                ? 'bg-rose-600 text-white shadow-lg animate-bounce'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
            }`}
          >
            {voiceStatus === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              voiceStatus === 'listening'
                ? 'Listening... (Speak now)'
                : 'Ask anything about your crop, irrigation, disease, or prices...'
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-xs sm:text-sm font-medium"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!query.trim() || isLoading}
            className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 flex-shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Suggested Quick Question Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap mr-1">Suggested:</span>
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors border border-slate-200"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Structured Response Cards Feed */}
      <div className="space-y-6">
        {history.map((item, idx) => (
          <div key={item.id} className="space-y-3">
            {/* User Question Bubble */}
            <div className="flex justify-end">
              <div className="bg-emerald-800 text-white rounded-3xl rounded-tr-sm px-5 py-3 max-w-lg shadow-sm text-xs sm:text-sm font-medium">
                {item.query}
              </div>
            </div>

            {/* Structured AI Response Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-sm space-y-4">
              {/* Header: Recommendation & Confidence */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                  </span>
                  <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-900">
                    🌱 AgroSaarthi Recommendation
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getConfidenceBadge(item.response.confidence)}
                  <button
                    onClick={() => handleSpeak(`${item.response.recommendation} ${item.response.reason}`, idx)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    title="Read Aloud"
                  >
                    {activeSpeechIndex === idx ? (
                      <VolumeX className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                <h3 className="text-base sm:text-lg font-extrabold text-emerald-950 font-serif">
                  {item.response.recommendation}
                </h3>
              </div>

              {/* Why Explanation */}
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-slate-900 text-xs block">Why?</span>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {item.response.reason}
                </p>
              </div>

              {/* Numbered What to do steps */}
              <div className="text-xs space-y-2">
                <span className="font-extrabold text-slate-900 text-xs block">What to do:</span>
                <ol className="space-y-2">
                  {item.response.actions.map((act, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {aIdx + 1}
                      </span>
                      <span className="text-slate-800 font-medium leading-relaxed">{act}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Low Confidence / Requires Expert Warning & Escalation */}
              {item.response.requires_expert && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-amber-900 block">
                      ⚠️ AgroSaarthi could not confidently determine this issue without laboratory/microscopic confirmation.
                    </span>
                    <span className="text-amber-800 text-[11px]">
                      Consider consulting a certified agricultural officer or plant pathologist.
                    </span>
                  </div>
                  <button
                    onClick={onOpenExpertModal}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0 shadow-sm"
                  >
                    <span>Ask an Expert</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Sources & Trust Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-700">Verified Sources:</span>
                  {item.response.sources.map((s, sIdx) => (
                    <span key={sIdx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono text-[10px]">
                      {s.name}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-slate-400">{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
