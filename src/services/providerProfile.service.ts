import api from "@/lib/axios";
import { ApiSuccess, PaginatedData } from "@/types/api.types";
import {
  Provider,
  Service,
  Review,
  TeamMember,
} from "@/types/provider.types";

export const providerProfileService = {
  getProviderById: async (id: string) => {
    const response = await api.get<ApiSuccess<Provider>>(`/providers/${id}`);
    return response.data.data;
  },

  getProviderPublicProfile: async (id: string) => {
    const response = await api.get<ApiSuccess<Provider>>(`/providers/${id}`);
    return response.data.data;
  },

  getProviderServices: async (providerProfileId: string) => {
    const response = await api.get<ApiSuccess<Service[]>>(
      `/services/provider/${providerProfileId}`,
    );
    return response.data.data;
  },

  getProviderReviews: async (
    providerProfileId: string,
    params?: { page?: number; limit?: number },
  ) => {
    const response = await api.get<ApiSuccess<PaginatedData<Review>>>(
      `/reviews/provider/${providerProfileId}`,
      {
        params,
      },
    );
    return response.data.data;
  },

  getProviderTeam: async (providerProfileId: string) => {
    const response = await api.get<ApiSuccess<TeamMember[]>>(
      `/team-members/provider/${providerProfileId}`,
    );
    return response.data.data;
  },

  checkProviderSaved: async (providerProfileId: string) => {
    const response = await api.get<ApiSuccess<{ isSaved: boolean }>>(
      `/users/me/saved/${providerProfileId}`,
    );
    return response.data.data;
  },
};
