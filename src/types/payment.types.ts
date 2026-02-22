export type PaymentStatus = "pending" | "success" | "failed" | "refunded";
export type PaymentType = "deposit" | "full_payment" | "refund";

export interface PaymentInitResponse {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
}

export interface Payment {
  id: string;
  paymentRef: string;
  bookingId: string;
  clientId: string;
  providerProfileId: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway: string;
  gatewayRef?: string;
  paidAt?: string;
  createdAt: string;
}
