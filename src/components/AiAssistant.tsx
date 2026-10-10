import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, User, Language } from '../types';
import {
  Bot,
  Send,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  Globe,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface AiAssistantProps {
  currentUser: User | null;
  language: Language;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ currentUser, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text:
        language === 'te'
          ? 'నమస్తే! నేను అగ్రోసారథి AI వ్యవసాయ సహాయకుని. మీ పంట, ఎరువులు లేదా వ్యాధుల గురించి ఏమైనా అడగండి.'
          : language === 'hi'
          ? 'नमस्ते! मैं एग्रोसारथी AI कृषि सहायक हूँ। अपनी फसल, उर्वरक या बीमारी के बारे में सवाल पूछें।'
          : 'Namaste! I am AgroSarathi AI Agricultural Assistant. Ask me anything about your crop, fertilizers, weather, or government schemes!',
      timestamp: 'Just now',
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Which crop should I grow in red soil with moderate water?',
    'How can I increase paddy yield per acre?',
    'What fertilizer is suitable for chilli yellow leaf spots?',
    'Which government schemes can I apply for right now?',
    'How to prevent thrips attack in cotton crop?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuestion;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          language,
          farmerContext: {
            district: currentUser?.district || 'Guntur',
            primaryCrop: currentUser?.primaryCrop || 'Chilli',
          },
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.answer || 'Thank you for your question. Please consult your local Krishi Vigyan Kendra (KVK) for additional guidance.',
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'I am temporarily offline. Please check your internet connection or retry.',
          timestamp: 'Just now',
        },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 h-[calc(100vh-140px)] flex flex-col">
      {/* Header Banner */}
      <div className="bg-[#1B3022] text-white rounded-3xl p-4 sm:p-6 shadow-md border border-emerald-900/80 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-[#1B3022] flex items-center justify-center font-bold shadow">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              AI Farming Assistant <Sparkles className="w-4 h-4 text-emerald-400" />
            </h1>
            <p className="text-xs text-emerald-300">
              Powered by Gemini AI • Multilingual Support (Telugu, Hindi, English)
            </p>
          </div>
        </div>

        <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30 hidden sm:inline-block">
          Language: <span className="uppercase font-bold text-white">{language}</span>
        </span>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex space-x-2 overflow-x-auto pb-1 shrink-0 scrollbar-none text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Sample Questions:
        </span>
        {sampleQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            className="px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-medium rounded-full border border-slate-200 shrink-0 transition-colors shadow-sm"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-emerald-100 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-amber-400 text-emerald-950 font-bold shadow'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none font-medium'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <div
                className={`text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl max-w-[200px]">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>AI Assistant thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-md border border-emerald-200 shrink-0 flex items-center space-x-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a farming question in Telugu, Hindi, or English..."
          className="flex-1 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !inputQuestion.trim()}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
