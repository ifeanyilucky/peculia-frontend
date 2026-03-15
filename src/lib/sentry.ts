import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  replaysOnErrorSampleRate: 1.0,
  
  replaysSessionSampleRate: 0.1,
  
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],
  
  ignoreErrors: [
    /Network Error/i,
    /fetch failed/i,
    /ResizeObserver/i,
    /IntersectionObserver/i,
  ],
  
  beforeSend(event) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Sentry] Event:", event);
    }
    return event;
  },
});
