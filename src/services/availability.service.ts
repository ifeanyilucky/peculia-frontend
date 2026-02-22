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
};
