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
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      handleAuthFailure();
    }

    const errorMessage =
      (error.response?.data as any)?.message ||
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
