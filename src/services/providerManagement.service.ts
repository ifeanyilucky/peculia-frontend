import api from "@/lib/axios";
import { ApiSuccess } from "@/types/api.types";
import {
  Provider,
  Service,
  PortfolioImage,
  TeamMember,
} from "@/types/provider.types";

export const providerManagementService = {
  getMyProfile: async () => {
    const response = await api.get<ApiSuccess<Provider>>("/providers/me");
    return response.data.data;
  },

  updateProviderProfile: async (data: any) => {
    const response = await api.patch<ApiSuccess<Provider>>(
      "/providers/me",
      data,
    );
    return response.data.data;
  },

  uploadPortfolioImage: async (formData: FormData) => {
    const response = await api.post<ApiSuccess<PortfolioImage>>(
      "/providers/me/portfolio",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  },

  deletePortfolioImage: async (publicId: string) => {
    const response = await api.delete<ApiSuccess<void>>(
      `/providers/me/portfolio/${publicId}`,
    );
    return response.data.data;
  },

  createService: async (data: Partial<Service>) => {
    const response = await api.post<ApiSuccess<Service>>("/services", data);
    return response.data.data;
  },

  updateService: async (id: string, data: Partial<Service>) => {
    const response = await api.patch<ApiSuccess<Service>>(
      `/services/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteService: async (id: string) => {
    const response = await api.delete<ApiSuccess<void>>(`/services/${id}`);
    return response.data.data;
  },

  saveProvider: async (providerProfileId: string) => {
    const response = await api.post<ApiSuccess<{ saved: boolean; message: string }>>(
      `/users/me/saved/${providerProfileId}`,
    );
    return response.data.data;
  },

  unsaveProvider: async (providerProfileId: string) => {
    const response = await api.delete<ApiSuccess<{ saved: boolean; message: string }>>(
      `/users/me/saved/${providerProfileId}`,
    );
    return response.data.data;
  },

  getSavedProviders: async () => {
    const response = await api.get<ApiSuccess<Provider[]>>(
      "/users/me/saved",
    );
    return response.data.data;
  },
};
