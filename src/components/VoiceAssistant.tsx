import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Globe,
  AlertCircle,
  Loader2,
  Bot,
  User as UserIcon,
  LogIn,
} from 'lucide-react';

export interface AssistantLanguage {
  label: string;
  code: string;       // BCP-47 for speech recognition & synthesis: e.g. 'en-IN'
  shortCode: string;  // short code for Supabase edge function: e.g. 'en'
}

export const ASSISTANT_LANGUAGES: AssistantLanguage[] = [
  { label: 'English (en-IN)', code: 'en-IN', shortCode: 'en' },
  { label: 'Hindi (hi-IN)', code: 'hi-IN', shortCode: 'hi' },
  { label: 'Telugu (te-IN)', code: 'te-IN', shortCode: 'te' },
  { label: 'Tamil (ta-IN)', code: 'ta-IN', shortCode: 'ta' },
  { label: 'Malayalam (ml-IN)', code: 'ml-IN', shortCode: 'ml' },
  { label: 'Kannada (kn-IN)', code: 'kn-IN', shortCode: 'kn' },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface VoiceAssistantProps {
  currentUser: User | null;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  currentUser,
  onOpenAuthModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<AssistantLanguage>(ASSISTANT_LANGUAGES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat panel to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Clean up speech recognition & synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sync default language to user's preferred language if available
  useEffect(() => {
    if (currentUser?.language || currentUser?.preferredLanguage) {
      const userLang = (currentUser.language || currentUser.preferredLanguage || '').toLowerCase();
      const matched = ASSISTANT_LANGUAGES.find((l) => l.shortCode === userLang);
      if (matched) {
        setSelectedLang(matched);
      }
    }
  }, [currentUser]);

  // Speech Synthesis: Speak text aloud using selected language code
  const speakText = (text: string, langCode: string, shortCode: string) => {
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(
        (v) =>
          v.lang === langCode ||
          v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase() ||
          v.lang.startsWith(shortCode)
      );

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis notice:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Check if running inside an embedded iframe preview
  const isEmbeddedIframe = () => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      return true;
    }
  };

  // Toggle browser speech recognition with proper user-initiated media permission check
  const toggleListening = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    setErrorMsg(null);

    // 1. Check for secure context (Speech & Media APIs require HTTPS or localhost)
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      setErrorMsg('Microphone access requires a secure connection (HTTPS or localhost).');
      return;
    }

    // 2. Check whether window.SpeechRecognition or window.webkitSpeechRecognition is supported
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setErrorMsg(
        'Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari, or type your question below.'
      );
      return;
    }

    // 3. User-initiated permission check using navigator.mediaDevices.getUserMedia where supported
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      let tempStream: MediaStream | null = null;
      try {
        tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (mediaErr: any) {
        console.warn('Microphone permission check notice:', mediaErr);
        setIsListening(false);

        const inIframe = isEmbeddedIframe();
        const errName = mediaErr?.name || '';
        const errMsg = mediaErr?.message || '';

        if (
          errName === 'NotAllowedError' ||
          errName === 'PermissionDeniedError' ||
          errMsg.includes('Permission denied') ||
          errMsg.includes('not allowed')
        ) {
          if (inIframe) {
            setErrorMsg(
              'Microphone access is blocked by the embedded preview iframe. Please grant microphone permission in your browser or open the app directly in a full browser tab, or type your question below.'
            );
          } else {
            setErrorMsg(
              'Microphone permission was denied. Please click the camera/mic icon in your browser address bar to allow microphone access, or type your question below.'
            );
          }
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setErrorMsg(
            'No microphone was found on your device. Please connect an audio input device or type your question below.'
          );
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          setErrorMsg(
            'Microphone is currently in use by another application or tab. Please free the audio device and try again.'
          );
        } else if (errName === 'SecurityError') {
          setErrorMsg(
            inIframe
              ? 'Microphone access is restricted by iframe security policy. Please open the app in a full browser window or type your question below.'
              : 'Microphone access was blocked by browser security policy. Please type your question below.'
          );
        } else {
          setErrorMsg(
            `Unable to access microphone (${errMsg || errName || 'device error'}). Please type your question below.`
          );
        }
        return;
      } finally {
        // 4. Crucial: Stop the temporary audio stream tracks immediately after checking permission
        // so the audio hardware is released and SpeechRecognition can acquire it without conflict!
        if (tempStream) {
          try {
            tempStream.getTracks().forEach((track) => track.stop());
          } catch (stopErr) {
            console.warn('Error releasing temporary media tracks:', stopErr);
          }
        }
      }
    }

    // 5. Start SpeechRecognition from user interaction
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang.code;
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const err = event?.error || '';
        console.warn('SpeechRecognition error notice:', err);

        const inIframe = isEmbeddedIframe();

        switch (err) {
          case 'not-allowed':
          case 'permission-denied':
            if (inIframe) {
              setErrorMsg(
                'Microphone access is blocked by the embedded preview iframe. Please grant microphone permission in your browser or open the app directly in a full browser tab, or type your question below.'
              );
            } else {
              setErrorMsg(
                'Microphone permission was denied. Please allow microphone access in your browser site settings or address bar icon.'
              );
            }
            break;
          case 'no-speech':
            // No speech detected, quietly finish listening without an invasive error banner
            break;
          case 'audio-capture':
            setErrorMsg(
              'No audio input was captured from your microphone. Please verify your microphone is connected and not muted.'
            );
            break;
          case 'network':
            setErrorMsg('Speech recognition network error. Please check your internet connection.');
            break;
          case 'language-not-supported':
            setErrorMsg(
              `Language "${selectedLang.label}" is not supported by your browser's speech recognition engine.`
            );
            break;
          case 'service-not-allowed':
            setErrorMsg(
              'Speech recognition service is disabled or blocked by your browser/network settings.'
            );
            break;
          case 'aborted':
            // Speech recognition stopped intentionally by user
            break;
          default:
            setErrorMsg(`Voice recognition notice: ${err}. You can also type your question below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (startErr: any) {
      console.error('Speech recognition start error:', startErr);
      setIsListening(false);
      const inIframe = isEmbeddedIframe();
      if (
        startErr?.name === 'NotAllowedError' ||
        startErr?.message?.includes('denied') ||
        startErr?.message?.includes('not allowed')
      ) {
        setErrorMsg(
          inIframe
            ? 'Microphone access is blocked by the embedded preview iframe. Please open the app in a full browser tab or type your question below.'
            : 'Microphone permission was denied. Please allow microphone access in your browser settings.'
        );
      } else {
        setErrorMsg(
          `Failed to initialize voice recognition: ${startErr?.message || 'unknown error'}. Please type your question below.`
        );
      }
    }
  };

  // Send question to Supabase edge function 'agrosaarthi-assistant'
  const handleSend = async (questionOverride?: string) => {
    const q = (questionOverride || inputText).trim();
    if (!q) return;

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !currentUser) {
      setErrorMsg('Please log in first');
      return;
    }

    // Stop listening & speaking if in progress
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
    stopSpeaking();

    setErrorMsg(null);
    setInputText('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('agrosaarthi-assistant', {
        body: {
          question: q,
          language: selectedLang.shortCode,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        setErrorMsg(error.message || 'Failed to get answer from assistant.');
        setIsLoading(false);
        return;
      }

      const answer =
        data?.answer ||
        data?.reply ||
        data?.text ||
        data?.response ||
        data?.message ||
        (typeof data === 'string' ? data : 'No response text received.');

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      // Read answer aloud with speechSynthesis using selected language code
      speakText(answer, selectedLang.code, selectedLang.shortCode);
    } catch (err: any) {
      console.error('Unexpected voice assistant error:', err);
      setErrorMsg(err?.message || 'Error occurred while contacting assistant.');
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'How should I irrigate my crops this week?',
    'What fertilizer is suitable for fungal leaf spots?',
    'Which government schemes are available for small farmers?',
  ];

  return (
    <>
      {/* 1. Floating Mic Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setErrorMsg(null);
          }}
          className={`relative group flex items-center justify-center p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-rose-300'
              : isSpeaking
              ? 'bg-emerald-600 text-white animate-bounce shadow-emerald-300'
              : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:scale-105 shadow-emerald-500/30'
          }`}
          title={isOpen ? 'Close Voice Assistant' : 'Open Voice Assistant'}
          aria-label="AgroSaarthi Voice Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : isListening ? (
            <Mic className="w-6 h-6 text-white animate-pulse" />
          ) : isSpeaking ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6" />
          )}

          {/* Pulse ring animation when idle */}
          {!isOpen && !isListening && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* 2. Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-36 right-3 sm:bottom-22 sm:right-6 z-50 w-[94vw] sm:w-[410px] h-[540px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#16271C] text-[#E8F1E9] p-4 flex items-center justify-between border-b border-emerald-900/60 shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-950" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif leading-tight">AgroSaarthi Voice</h3>
                <p className="text-[10px] text-emerald-300">Multilingual Farm Copilot</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Language Dropdown */}
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-emerald-300 absolute left-2 pointer-events-none" />
                <select
                  value={selectedLang.code}
                  onChange={(e) => {
                    const found = ASSISTANT_LANGUAGES.find((l) => l.code === e.target.value);
                    if (found) {
                      setSelectedLang(found);
                      stopSpeaking();
                    }
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white text-xs pl-7 pr-2 py-1 rounded-xl border border-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium cursor-pointer"
                  title="Select Voice Language"
                >
                  {ASSISTANT_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mute/Stop Speaking Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg transition-colors"
                  title="Stop Speaking"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  stopSpeaking();
                  if (isListening && recognitionRef.current) {
                    try {
                      recognitionRef.current.stop();
                    } catch {}
                    setIsListening(false);
                  }
                }}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-rose-50 border-b border-rose-200 px-3.5 py-2.5 text-xs text-rose-800 shrink-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{errorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="text-rose-400 hover:text-rose-700 p-0.5 rounded transition-colors shrink-0"
                  title="Dismiss notice"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {errorMsg.toLowerCase().includes('log in') && onOpenAuthModal && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => onOpenAuthModal('login')}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg flex items-center space-x-1 shrink-0 shadow-xs"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Log In</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F8FAF7]">
            {/* Empty State */}
            {messages.length === 0 && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 font-serif">Voice Agricultural Assistant</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[260px]">
                    Tap the microphone to speak or type in {selectedLang.label.split(' ')[0]}. Answers will be read aloud.
                  </p>
                </div>

                <div className="w-full space-y-1.5 pt-2 text-left">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                    Suggested Questions
                  </p>
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-700 p-2.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Bubble List */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1 opacity-75 text-[10px]">
                    {msg.sender === 'user' ? (
                      <>
                        <UserIcon className="w-3 h-3" />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-emerald-600" />
                        <span className="font-bold text-emerald-800">AgroSaarthi</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Read Aloud button for assistant replies */}
                  {msg.sender === 'assistant' && (
                    <div className="mt-2 pt-1 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => speakText(msg.text, selectedLang.code, selectedLang.shortCode)}
                        className="text-[10px] text-emerald-700 font-bold hover:text-emerald-900 flex items-center space-x-1"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Read aloud</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="bg-white border border-slate-200 text-slate-600 rounded-2xl rounded-bl-xs px-3.5 py-2.5 text-xs flex items-center space-x-2 shadow-xs">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="italic">Thinking in {selectedLang.label.split(' ')[0]}...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Listening Live Indicator */}
          {isListening && (
            <div className="bg-emerald-50 border-t border-emerald-200 px-3.5 py-1.5 flex items-center justify-between text-xs text-emerald-800 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span className="font-medium animate-pulse">Listening... speak in {selectedLang.label}</span>
              </div>
              <button
                onClick={toggleListening}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800"
              >
                Done
              </button>
            </div>
          )}

          {/* Bottom Input Box Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0"
          >
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-200'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
              }`}
              title={isListening ? 'Stop Listening' : `Speak in ${selectedLang.label}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Box */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask in ${selectedLang.label.split(' ')[0]} or tap mic...`}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-colors shrink-0"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
