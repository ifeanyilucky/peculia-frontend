import api from "@/lib/axios";
import { ApiSuccess, PaginatedData } from "@/types/api.types";
import {
  Provider,
  Service,
  Review,
  DiscoveryFilters,
} from "@/types/provider.types";

export const providerService = {
  discoverProviders: async (filters: DiscoveryFilters) => {
    const response = await api.get<ApiSuccess<PaginatedData<Provider>>>(
      "/provider-profiles",
      {
        params: filters,
      },
    );
    return response.data.data;
  },

  getProviderById: async (id: string) => {
    const response = await api.get<ApiSuccess<Provider>>(
      `/provider-profiles/${id}`,
    );
    return response.data.data;
  },

  getProviderPublicProfile: async (id: string) => {
    const response = await api.get<ApiSuccess<Provider>>(
      `/provider-profiles/${id}/public`,
    );
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
};
