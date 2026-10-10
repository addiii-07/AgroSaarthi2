export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'speaking';

export interface VoiceServiceCallbacks {
  onStatusChange?: (status: VoiceStatus) => void;
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
}

class VoiceService {
  private status: VoiceStatus = 'idle';
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private callbacks: VoiceServiceCallbacks = {};

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
          this.setStatus('listening');
        };

        this.recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript;
              this.setStatus('processing');
              this.callbacks.onTranscript?.(text);
              return;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (interim) {
            this.callbacks.onTranscript?.(interim);
          }
        };

        this.recognition.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e?.error);
          this.setStatus('idle');
          this.callbacks.onError?.(e?.error || 'Voice input interrupted');
        };

        this.recognition.onend = () => {
          if (this.status === 'listening') {
            this.setStatus('idle');
          }
        };
      }

      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  public setCallbacks(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;
  }

  private setStatus(status: VoiceStatus) {
    this.status = status;
    this.callbacks.onStatusChange?.(status);
  }

  public startListening(lang: 'en' | 'hi' | 'te' = 'en') {
    const langCodeMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
    };

    if (this.recognition) {
      try {
        this.recognition.lang = langCodeMap[lang] || 'en-IN';
        this.recognition.start();
        return;
      } catch (err) {
        console.warn('Native speech recognition start note:', err);
      }
    }

    // Fallback simulation for unsupported browsers/preview environments
    this.setStatus('listening');
    const demoPhrases = [
      'Should I irrigate my tomato crop today?',
      'Is tomato mandi price favorable to sell this week?',
      'What are the priority farming actions for tomorrow?',
    ];
    const picked = demoPhrases[Math.floor(Math.random() * demoPhrases.length)];

    setTimeout(() => {
      this.setStatus('processing');
      this.callbacks.onTranscript?.(picked);
      setTimeout(() => {
        this.setStatus('idle');
      }, 700);
    }, 2800);
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
    }
    this.setStatus('idle');
  }

  public speak(text: string, lang: 'en' | 'hi' | 'te' = 'en', onDone?: () => void) {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.95;

        utterance.onstart = () => this.setStatus('speaking');
        utterance.onend = () => {
          this.setStatus('idle');
          onDone?.();
        };
        utterance.onerror = () => {
          this.setStatus('idle');
          onDone?.();
        };

        this.synthesis.speak(utterance);
        return;
      } catch (e) {
        console.warn('Speech synthesis note:', e);
      }
    }

    // Fallback simulation
    this.setStatus('speaking');
    setTimeout(() => {
      this.setStatus('idle');
      onDone?.();
    }, 3000);
  }

  public cancelSpeech() {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.setStatus('idle');
  }
}

export const voiceService = new VoiceService();
