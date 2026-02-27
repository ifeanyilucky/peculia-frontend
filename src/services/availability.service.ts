import api from "@/lib/axios";
import { ApiSuccess } from "@/types/api.types";
import { TimeSlot, BlockedDate } from "@/types/booking.types";

export const availabilityService = {
  getAvailableSlots: async (
    providerProfileId: string,
    serviceIds: string[],
    date: string,
    teamMemberId?: string,
  ) => {
    const response = await api.get<ApiSuccess<TimeSlot[]>>(
      `/providers/${providerProfileId}/availability/slots`,
      {
        params: { serviceIds, date, teamMemberId },
        paramsSerializer: {
          indexes: null,
        },
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
      `/providers/${providerProfileId}/availability/blocked`,
      {
        params: { month, year },
      },
    );
    return response.data.data;
  },

  getWeeklySchedule: async (providerProfileId: string) => {
    const response = await api.get<ApiSuccess<any>>(
      `/providers/${providerProfileId}/availability`,
    );
    return response.data.data;
  },

  saveWeeklySchedule: async (data: any) => {
    const response = await api.post<ApiSuccess<any>>(
      "/providers/me/availability",
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
      "/providers/me/availability/block",
      data,
    );
    return response.data.data;
  },

  unblockDate: async (id: string) => {
    const response = await api.delete<ApiSuccess<void>>(
      `/providers/me/availability/block/${id}`,
    );
    return response.data.data;
  },
};
