export type PaymentStatus = "pending" | "success" | "failed" | "refunded";
export type PaymentType = "deposit" | "full_payment" | "refund";

export interface PaymentInitResponse {
  authorizationUrl: string;
  reference: string;
  access_code: string;
  alreadyPaid?: boolean;
}

export interface PaymentBookingService {
  serviceId: string;
  name: string;
  price: number;
  duration: number;
  depositAmount: number;
  _id: string;
  id: string;
}

export interface PaymentBooking {
  _id: string;
  bookingRef: string;
  services: PaymentBookingService[];
  id: string;
}

export interface Payment {
  id: string;
  _id?: string;
  paymentRef: string;
  bookingId: string | PaymentBooking;
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
  updatedAt?: string;
}

export interface PaymentPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface PaymentHistoryResponse {
  results: Payment[];
  pagination: PaymentPagination;
}
