import posthog from "posthog-js";

if (typeof window !== "undefined") {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (posthogKey && process.env.NODE_ENV === "production") {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      capture_pageview: false, // We'll handle this manually or via the provider
      capture_pageleave: true,
      session_recording: {
        maskAllInputs: true,
      },
    });
  }
}

export default posthog;
