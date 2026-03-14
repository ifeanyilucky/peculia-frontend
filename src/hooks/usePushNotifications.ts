import { useState, useEffect, useCallback } from "react";
import api from "../lib/axios";

interface DeviceTokenHook {
  registerToken: (token: string, type: "ios" | "android" | "web", deviceId?: string) => Promise<boolean>;
  deregisterToken: (token: string) => Promise<boolean>;
  deregisterAllTokens: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useDeviceToken = (): DeviceTokenHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerToken = useCallback(async (
    token: string,
    type: "ios" | "android" | "web",
    deviceId?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post("/device-tokens", { token, type, deviceId });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to register token";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deregisterToken = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.delete("/device-tokens", { data: { token } });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to deregister token";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deregisterAllTokens = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.delete("/device-tokens/all");
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to deregister tokens";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { registerToken, deregisterToken, deregisterAllTokens, isLoading, error };
};

export const usePushNotifications = () => {
  const [pushPermission, setPushPermission] = useState<NotificationPermission | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const deviceToken = useDeviceToken();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      return permission === "granted";
    } catch {
      return false;
    }
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }

    if (Notification.permission !== "granted") {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker?.ready;
      if (!registration) return null;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY || ""),
      });

      const token = btoa(String.fromCharCode(...new Uint8Array(subscription.endpoint)));
      setPushToken(token);
      return token;
    } catch {
      return null;
    }
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return false;

    const token = await getToken();
    if (!token) return false;

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    let deviceType: "ios" | "android" | "web" = "web";
    if (/iPad|iPhone|iPod/.test(userAgent)) deviceType = "ios";
    else if (/Android/.test(userAgent)) deviceType = "android";

    return await deviceToken.registerToken(token, deviceType);
  }, [requestPermission, getToken, deviceToken]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!pushToken) return true;
    return await deviceToken.deregisterToken(pushToken);
  }, [pushToken, deviceToken]);

  return {
    pushPermission,
    pushToken,
    requestPermission,
    getToken,
    subscribe,
    unsubscribe,
    isLoading: deviceToken.isLoading,
    error: deviceToken.error,
  };
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
