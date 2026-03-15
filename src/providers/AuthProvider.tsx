"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import FullPageLoader from "@/components/common/FullPageLoader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { identifyUser, resetUser, trackEvent } from "@/lib/analytics";
import { useAuthStore as useAuthStoreOriginal } from "@/store/auth.store";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        const user = response.data.data;
        useAuthStore.getState().setAuth(user);

        identifyUser(user.id, {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        });
      } catch {
        useAuthStore.getState().clearAuth();
        resetUser();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const unsub = useAuthStoreOriginal.subscribe(
      (state) => state.isAuthenticated,
      (isAuthenticated) => {
        if (!isAuthenticated) {
          trackEvent("user_logged_out");
          resetUser();
        }
      },
    );
    return () => unsub();
  }, []);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      {children}
    </GoogleOAuthProvider>
  );
}
