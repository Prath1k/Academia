import React, { useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { LegalPageType } from './LegalPage';

const COOKIE_CHOICE_KEY = 'academianexus-cookie-choice-v1';

interface Props {
  onOpenPolicy: (page: LegalPageType) => void;
}

export const CookieConsentBanner: React.FC<Props> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return window.localStorage.getItem(COOKIE_CHOICE_KEY) !== 'necessary';
    } catch {
      return true;
    }
  });

  const continueWithNecessary = () => {
    try {
      window.localStorage.setItem(COOKIE_CHOICE_KEY, 'necessary');
    } catch {
      // Privacy controls still work when storage is unavailable.
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="cookie-banner" role="region" aria-label="Cookie notice">
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-950">Privacy choices</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">This prototype uses necessary storage for sign-in, security, and this choice. It does not run analytics or advertising cookies.</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={continueWithNecessary} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800">Continue with necessary cookies</button>
            <button type="button" onClick={() => onOpenPolicy('cookies')} className="text-xs font-bold text-blue-700 underline underline-offset-2 hover:text-blue-900">Read cookie policy</button>
          </div>
        </div>
        <button type="button" onClick={continueWithNecessary} aria-label="Close cookie notice" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
      </div>
    </aside>
  );
};