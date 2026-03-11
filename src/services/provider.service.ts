import api from "@/lib/axios";
import { ApiSuccess, PaginatedData } from "@/types/api.types";
import {
  Provider,
  Service,
  Review,
  DiscoveryFilters,
  PortfolioImage,
  TeamMember,
} from "@/types/provider.types";

export interface SearchProvidersParams {
  q?: string;
  lat?: number;
  lng?: number;
  category?: string;
  minRating?: number;
  maxPrice?: number;
  verified?: boolean;
  city?: string;
  page?: number;
  perPage?: number;
}

export interface SearchResult {
  providers: Array<{
    id: string;
    name: string;
    businessName: string;
    slug: string;
    categories: string[];
    services: string[];
    rating: number;
    totalReviews: number;
    priceMin: number;
    priceMax: number;
    city: string;
    state: string;
    isVerified: boolean;
    isDiscoverable: boolean;
  }>;
  total: number;
  page: number;
  perPage: number;
}

export interface AutocompleteSuggestion {
  id: string;
  name: string;
  businessName: string;
  slug: string;
  rating: number;
}

export const providerService = {
  discoverProviders: async (filters: DiscoveryFilters) => {
    const response = await api.get<ApiSuccess<PaginatedData<Provider>>>(
      "/providers",
      {
        params: filters,
      },
    );
    return response.data.data;
  },

  searchProviders: async (params: SearchProvidersParams) => {
    const response = await api.get<ApiSuccess<SearchResult>>(
      "/search/providers",
      { params },
    );
    return response.data.data;
  },

  getAutocompleteSuggestions: async (query: string) => {
    const response = await api.get<ApiSuccess<{ suggestions: AutocompleteSuggestion[] }>>(
      "/search/providers/autocomplete",
      { params: { q: query } },
    );
    return response.data.data.suggestions;
  },

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

  getMyProfile: async () => {
    const response = await api.get<ApiSuccess<Provider>>("/providers/me");
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

  updateProviderProfile: async (data: any) => {
    const response = await api.patch<ApiSuccess<Provider>>(
      "/providers/me",
      data,
    );
    return response.data.data;
  },

  getProviderTeam: async (providerProfileId: string) => {
    const response = await api.get<ApiSuccess<TeamMember[]>>(
      `/team-members/provider/${providerProfileId}`,
    );
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

  checkProviderSaved: async (providerProfileId: string) => {
    const response = await api.get<ApiSuccess<{ isSaved: boolean }>>(
      `/users/me/saved/${providerProfileId}`,
    );
    return response.data.data;
  },
};
