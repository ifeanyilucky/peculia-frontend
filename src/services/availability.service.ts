import api from "@/lib/axios";
import { ApiSuccess } from "@/types/api.types";
import { TimeSlot, BlockedDate } from "@/types/booking.types";

export const availabilityService = {
  getAvailableSlots: async (
    providerProfileId: string,
    serviceId: string,
    date: string,
  ) => {
    const response = await api.get<ApiSuccess<TimeSlot[]>>(
      `/availability/slots/${providerProfileId}`,
      {
        params: { serviceId, date },
      },
    );
    return response.data.data;
  },

  getBlockedDates: async (
    providerProfileId: string,
    month: number,
    year: number,
  ) => {
    const response = await api.get<ApiSuccess<BlockedDate[]>>(
      `/availability/blocked/${providerProfileId}`,
      {
        params: { month, year },
      },
    );
    return response.data.data;
  },

  getWeeklySchedule: async (providerProfileId: string) => {
    const response = await api.get<ApiSuccess<any>>(
      `/availability/schedule/${providerProfileId}`,
    );
    return response.data.data;
  },

  saveWeeklySchedule: async (data: any) => {
    const response = await api.post<ApiSuccess<any>>(
      "/availability/schedule",
      data,
    );
    return response.data.data;
  },

  blockDate: async (data: {
    date: string;
    reason?: string;
    isFullDay: boolean;
  }) => {
    const response = await api.post<ApiSuccess<BlockedDate>>(
      "/availability/block",
      data,
    );
    return response.data.data;
  },

  unblockDate: async (id: string) => {
    const response = await api.delete<ApiSuccess<void>>(
      `/availability/block/${id}`,
    );
    return response.data.data;
  },
};
