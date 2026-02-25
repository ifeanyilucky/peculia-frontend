"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "peculia-cookie-consent";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing the banner for a better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        all: true,
        essential: true,
        analytics: true,
        timestamp: new Date().toISOString(),
      }),
    );
    setIsVisible(false);
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        all: false,
        essential: true,
        analytics: false,
        timestamp: new Date().toISOString(),
      }),
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-9999"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 overflow-hidden relative">
          {/* Subtle background gradient */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0 w-12 h-12 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-600">
              <Cookie size={24} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Your privacy
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cookies enable us to enhance your experience by personalizing
                content and analyzing traffic. You can accept all cookies, allow
                only essentials ones, or manage your preferences. See our{" "}
                <Link
                  href="/cookie-policy"
                  className="text-rose-600 hover:text-rose-700 font-medium underline underline-offset-4"
                >
                  cookie policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <button
              onClick={handleNecessaryOnly}
              className="px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-1"
            >
              Only necessary
            </button>
            <button className="px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full hover:border-rose-600 hover:text-rose-600 transition-all flex items-center justify-center gap-2 group">
              <Settings
                size={16}
                className="group-hover:rotate-45 transition-transform"
              />
              Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2.5 text-sm font-black uppercase tracking-widest text-white bg-slate-900 dark:bg-rose-600 rounded-full hover:bg-rose-600 dark:hover:bg-rose-700 transition-all flex-1 whitespace-nowrap border border-slate-200"
            >
              Accept all
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
