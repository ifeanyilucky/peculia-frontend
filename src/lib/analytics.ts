import posthog from "./posthog";

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(event, properties);
  }
};

export const identifyUser = (
  userId: string,
  properties?: Record<string, any>,
) => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.identify(userId, properties);
  }
};

export const resetUser = () => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.reset();
  }
};
