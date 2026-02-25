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

  verifyPayment: async (reference: string) => {
    const response = await api.get<ApiSuccess<Payment>>(
      `/payments/verify/${reference}`,
    );
    return response.data.data;
  },

  getPaymentHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaymentHistoryResponse> => {
    const response = await api.get<ApiSuccess<PaymentHistoryResponse>>(
      "/payments/history",
      {
        params,
      },
    );
    return response.data.data.data;
  },

  getProviderEarnings: async () => {
    const response = await api.get<ApiSuccess<any>>("/payments/earnings");
    return response.data.data;
  },
};
