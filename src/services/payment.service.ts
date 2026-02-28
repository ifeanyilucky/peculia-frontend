import api from "@/lib/axios";
import { ApiSuccess } from "@/types/api.types";
import {
  PaymentInitResponse,
  Payment,
  PaymentHistoryResponse,
} from "@/types/payment.types";

export const paymentService = {
  initializePayment: async (bookingId: string) => {
    const response = await api.post<ApiSuccess<PaymentInitResponse>>(
      `/payments/initialize/${bookingId}`,
    );
    return response.data.data;
  },

  verifyPayment: async (reference: string, bookingId?: string) => {
    const response = await api.get<ApiSuccess<Payment>>(
      `/payments/verify/${reference}`,
      { params: { bookingId } },
    );
    return response.data.data;
  },

  getPaymentHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaymentHistoryResponse> => {
    // Filter out empty strings to avoid backend validation errors
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== "" && v !== undefined),
        )
      : undefined;

    const response = await api.get<
      ApiSuccess<{ data: PaymentHistoryResponse }>
    >("/payments/history", {
      params: filteredParams,
    });
    return response.data.data.data;
  },

  getProviderEarnings: async () => {
    const response = await api.get<ApiSuccess<any>>("/payments/earnings");
    return response.data.data;
  },
};
