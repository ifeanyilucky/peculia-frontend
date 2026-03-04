"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "glamyad-cookie-consent";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
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
        <div className="bg-white/80 backdrop-blur-xl border border-glam-blush/50 rounded-3xl p-5 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-glam-blush/30 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0 w-12 h-12 bg-glam-blush/50 rounded-2xl flex items-center justify-center text-glam-plum">
              <Cookie size={24} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-lg font-bold text-glam-plum mb-1">
                Your privacy
              </h3>
              <p className="text-sm text-glam-charcoal leading-relaxed">
                Cookies enable us to enhance your experience by personalizing
                content and analyzing traffic. You can accept all cookies, allow
                only essentials ones, or manage your preferences. See our{" "}
                <Link
                  href="/cookie-policy"
                  className="text-glam-plum hover:text-glam-gold font-medium underline underline-offset-4"
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
              className="px-4 py-2.5 text-sm font-bold text-glam-plum bg-glam-blush/50 border border-glam-blush rounded-full hover:bg-glam-blush transition-colors flex-1"
            >
              Only necessary
            </button>
            <button className="px-4 py-2.5 text-sm font-bold text-glam-plum bg-white border border-glam-blush rounded-full hover:border-glam-gold hover:text-glam-gold transition-all flex items-center justify-center gap-2 group">
              <Settings
                size={16}
                className="group-hover:rotate-45 transition-transform"
              />
              Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2.5 text-sm font-black uppercase tracking-widest text-white bg-glam-plum rounded-full hover:bg-glam-plum/90 transition-all flex-1 whitespace-nowrap border border-glam-plum"
            >
              Accept all
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
