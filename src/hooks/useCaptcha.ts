import { useState, useCallback, useEffect } from "react";

declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export const useCaptcha = (action: string = "booking") => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) {
      console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured - CAPTCHA disabled");
      setIsLoaded(true);
      return;
    }

    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        setIsLoaded(true);
      }
    };

    if (window.grecaptcha) {
      setIsLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      script.onload = loadRecaptcha;
      document.head.appendChild(script);
    }
  }, []);

  const executeCaptcha = useCallback(async () => {
    if (!SITE_KEY || !window.grecaptcha) {
      setToken("skip");
      return "skip";
    }

    try {
      const newToken = await window.grecaptcha.execute(SITE_KEY, { action });
      setToken(newToken);
      setError(null);
      return newToken;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Captcha failed";
      setError(message);
      console.error("Captcha error:", message);
      return null;
    }
  }, [action]);

  const resetCaptcha = useCallback(() => {
    setToken(null);
    setError(null);
  }, []);

  return {
    token,
    isLoaded: !!SITE_KEY && isLoaded,
    isEnabled: !!SITE_KEY,
    error,
    executeCaptcha,
    resetCaptcha,
  };
};
