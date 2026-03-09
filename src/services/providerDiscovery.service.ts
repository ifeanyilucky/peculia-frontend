import api from "@/lib/axios";
import { ApiSuccess, PaginatedData } from "@/types/api.types";
import {
  Provider,
  DiscoveryFilters,
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

export const providerDiscoveryService = {
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
};
