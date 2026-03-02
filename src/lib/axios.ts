import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { sileo } from "sileo";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleAuthFailure = () => {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  const isBookingRoute = pathname.startsWith("/book");

  if (isBookingRoute) {
    // Show the login modal instead of redirecting
    useUIStore.getState().openModal("booking-auth");
  } else {
    // Hard redirect to login with redirect param
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `/login?redirect=${redirectUrl}`;
  }
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        handleAuthFailure();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Preserve the existing user object instead of overwriting with undefined
        // since the refresh endpoint only returns tokens, not the user profile.
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore
            .getState()
            .setAuth(currentUser, accessToken, newRefreshToken);
        }

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("[Axios] Refresh token expired or invalid. Logging out.");
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        handleAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Global Error Toast Handling
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Avoid showing toast for 401 as it's handled by refresh logic or redirect
    if (error.response?.status !== 401 && typeof window !== "undefined") {
      sileo.error({
        title: "Error",
        description: errorMessage,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
