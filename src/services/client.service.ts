import api from "@/lib/axios";
import { ApiSuccess } from "@/types/api.types";

export interface ClientProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

export const clientService = {
  getProfile: async () => {
    const response = await api.get<ApiSuccess<any>>("/clients/profile");
    return response.data.data;
  },

  updateProfile: async (data: ClientProfileUpdate) => {
    const response = await api.patch<ApiSuccess<any>>("/clients/profile", data);
    return response.data.data;
  },

  updatePassword: async (data: PasswordUpdate) => {
    const response = await api.post<ApiSuccess<any>>(
      "/auth/change-password",
      data,
    );
    return response.data;
  },

  deleteAccount: async (confirmation: string) => {
    if (confirmation !== "DELETE") throw new Error("Invalid confirmation");
    const response = await api.delete<ApiSuccess<any>>("/users/me");
    return response.data;
  },

  updateNotificationPreferences: async (preferences: {
    email?: boolean;
    sms?: boolean;
  }) => {
    const response = await api.patch<ApiSuccess<any>>(
      "/users/me/notifications",
      preferences,
    );
    return response.data.data;
  },

  getNotificationPreferences: async () => {
    const response = await api.get<ApiSuccess<any>>("/users/me");
    return response.data.data.user.notificationPreferences;
  },
};
