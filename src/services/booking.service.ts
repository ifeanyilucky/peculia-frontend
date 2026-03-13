import api from "@/lib/axios";
import { ApiSuccess } from "@/types/api.types";
import { Booking } from "@/types/booking.types";

export const bookingService = {
  createBooking: async (data: {
    providerProfileId: string;
    serviceIds: string[];
    teamMemberId?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
    policyAccepted?: boolean;
    policyVersion?: string;
    captchaToken?: string;
  }) => {
    const response = await api.post<ApiSuccess<Booking>>("/bookings", data);
    return response.data.data;
  },

  createPublicBooking: async (data: {
    providerProfileId: string;
    serviceIds: string[];
    teamMemberId?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    notes?: string;
    policyAccepted?: boolean;
    policyVersion?: string;
    captchaToken?: string;
  }) => {
    const response = await api.post<ApiSuccess<Booking>>("/bookings/public", data);
    return response.data.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get<ApiSuccess<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },

  getMyBookings: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get<ApiSuccess<any>>("/bookings/my", { params });
    return response.data.data;
  },

  cancelBooking: async (id: string, reason: string) => {
    const response = await api.patch<ApiSuccess<Booking>>(
      `/bookings/${id}/cancel`,
      { reason },
    );
    return response.data.data;
  },

  rescheduleBooking: async (id: string, data: {
    scheduledDate: string;
    startTime: string;
    endTime: string;
    teamMemberId?: string;
  }) => {
    const response = await api.patch<ApiSuccess<Booking>>(
      `/bookings/${id}/reschedule`,
      data,
    );
    return response.data.data;
  },

  updateBookingStatus: async (id: string, status: string) => {
    const response = await api.patch<ApiSuccess<Booking>>(
      `/bookings/${id}/status`,
      { status },
    );
    return response.data.data;
  },
};
