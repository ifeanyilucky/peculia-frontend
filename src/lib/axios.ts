import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { sileo } from "sileo";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleAuthFailure = () => {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  const isBookingRoute = pathname.startsWith("/book");
  const isPaymentRoute = pathname.startsWith("/bookings/payment");

  const protectedPrefixes = [
    "/dashboard",
    "/bookings",
    "/payments",
    "/saved",
    "/notifications",
    "/profile",
    "/users",
    "/reviews",
  ];

  const isProtectedRoute =
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) &&
    !isPaymentRoute;

  if (isBookingRoute) {
    useUIStore.getState().openModal("booking-auth");
  } else if (isProtectedRoute) {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `/login?redirect=${redirectUrl}`;
  }
};

api.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "glamyad_csrf") {
      return value;
    }
  }
  return null;
}

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

export const fetchCsrfToken = async (): Promise<string> => {
  try {
    const response = await api.get("/auth/csrf-token");
    return response.data.data.csrfToken;
  } catch {
    return "";
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const { accessToken, refreshToken } = response.data.data;

        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setAuth(currentUser, accessToken, refreshToken);
        }

        processQueue(null, accessToken);
        
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
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

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

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
