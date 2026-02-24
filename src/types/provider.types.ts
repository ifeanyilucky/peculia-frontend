export interface Location {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface PortfolioImage {
  url: string;
  publicId: string;
  caption?: string;
}

export interface ProviderUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Provider {
  _id: string;
  userId: ProviderUser;
  businessName: string;
  slug: string;
  bio?: string;
  specialties: string[];
  location?: Location;
  portfolioImages: PortfolioImage[];
  yearsOfExperience?: number;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  subscriptionTier: "free" | "premium";
  startingPrice?: number; // in kobo
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  providerProfileId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  depositAmount: number;
  isActive: boolean;
  category?: string; // Legacy
  categoryId?:
    | {
        _id: string;
        name: string;
      }
    | string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  clientId: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  providerProfileId: string;
  bookingId: string;
  rating: number;
  comment: string;
  reply?: string;
  replyDate?: string;
  createdAt: string;
}

export interface DiscoveryFilters {
  specialty?: string;
  city?: string;
  minRating?: number;
  isVerified?: boolean;
  search?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface TeamMember {
  _id: string;
  providerProfileId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  specialties: string[];
  bio?: string;
  position?: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
