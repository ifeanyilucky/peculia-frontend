import api from "@/lib/axios";
import { ApiSuccess } from "@/types/api.types";

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "client" | "provider" | "admin";
    avatar?: string;
    phone?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  login: async (data: any) => {
    const response = await api.post<ApiSuccess<AuthResponse>>(
      "/auth/login",
      data,
    );
    return response.data.data;
  },

  registerClient: async (data: any) => {
    const response = await api.post<ApiSuccess<any>>(
      "/auth/register/client",
      data,
    );
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post<ApiSuccess<any>>("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await api.post<ApiSuccess<any>>(
      "/auth/reset-password",
      data,
    );
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post<ApiSuccess<any>>("/auth/verify-email", {
      token,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiSuccess<any>>("/auth/logout");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.patch<ApiSuccess<AuthResponse["user"]>>(
      "/users/me",
      data,
    );
    return response.data.data;
  },

  updatePassword: async (data: any) => {
    const response = await api.patch<ApiSuccess<any>>(
      "/auth/update-password",
      data,
    );
    return response.data;
  },

  googleLogin: async (data: { idToken: string; role?: string }) => {
    const response = await api.post<ApiSuccess<AuthResponse>>(
      "/auth/google",
      data,
    );
    return response.data.data;
  },
};
