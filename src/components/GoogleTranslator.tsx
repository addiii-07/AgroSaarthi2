import React, { useEffect } from 'react';
import { Language } from '../types';
import { applyFullDOMTranslation } from '../services/universalTranslator';

interface GoogleTranslatorProps {
  language: Language;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export const GoogleTranslator: React.FC<GoogleTranslatorProps> = ({ language }) => {
  useEffect(() => {
    // 1. Immediately apply universal full-DOM translation engine
    // Translates 100% of letters, words, sentences, units, and numbers across all visible components
    applyFullDOMTranslation(language);

    // 2. Cooperative Google Translate script invocation
    const setTranslateCookie = (lang: string) => {
      try {
        const hostname = window.location.hostname;
        document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname}`;
        document.cookie = `googtrans=/en/${lang}; path=/`;
      } catch (e) {
        // Ignore cookie write errors in restricted iframes
      }
    };

    setTranslateCookie(language);

    const triggerComboChange = () => {
      try {
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (combo && combo.value !== language) {
          combo.value = language;
          combo.dispatchEvent(new Event('change'));
        }
      } catch (e) {
        // Ignore
      }
    };

    // Load Google Translate script if not present
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        try {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,te,hi,ta,kn,mr,bn,gu,pa,or,ml',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );
            setTimeout(triggerComboChange, 300);
          }
        } catch (e) {
          // Fallback handled by universalTranslator
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      triggerComboChange();
    }
  }, [language]);

  return (
    <>
      <div id="google_translate_element" className="opacity-0 pointer-events-none fixed -top-96 left-0 h-0 w-0 overflow-hidden" />
      <style>{`
        .goog-te-banner-frame, .goog-te-balloon-frame, iframe.goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-text-highlight {
          background: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
};
