import api from "@/lib/axios";
import { ApiSuccess } from "@/types/api.types";
import { Review } from "@/types/provider.types";

export interface SubmitReviewData {
  bookingId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  /**
   * Submit a new review for a completed booking.
   * Requires the user to be logged in as a client.
   */
  submitReview: async (data: SubmitReviewData): Promise<Review> => {
    const response = await api.post<ApiSuccess<Review>>("/reviews", data);
    return response.data.data;
  },

  /**
   * Fetch an existing review by booking ID (public route).
   * Returns null if no review exists for the booking.
   */
  getReviewByBooking: async (bookingId: string): Promise<Review | null> => {
    try {
      const response = await api.get<ApiSuccess<Review>>(
        `/reviews/booking/${bookingId}`,
      );
      return response.data.data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      // 404 simply means the booking hasn't been reviewed yet
      if (axiosErr?.response?.status === 404) return null;
      throw err;
    }
  },

  /**
   * Fetch the current client's own reviews (paginated).
   */
  getMyReviews: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<ApiSuccess<Review[]>>("/reviews/mine", {
      params,
    });
    return response.data.data;
  },
};
