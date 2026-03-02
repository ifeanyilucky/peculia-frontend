import { ProviderUser, Provider } from "./provider.types";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled_by_client"
  | "cancelled_by_provider"
  | "expired"
  | "no_show";

export interface Booking {
  id: string;
  _id?: string;
  bookingRef: string;
  clientId: string | ProviderUser;
  providerProfileId: string | Provider;
  services: {
    serviceId: string;
    name: string;
    price: number;
    duration: number;
    depositAmount: number;
  }[];
  totalDuration: number;
  servicePrice: number; // Total price
  depositPercentage: number;
  depositAmount: number; // Total deposit
  commissionPercentage: number;
  commissionAmount?: number;
  proPayoutAmount?: number;
  remainingBalance: number;
  teamMemberId?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: "pending" | "deposit_paid" | "completed" | "refunded";
  payoutStatus: "pending" | "paid_out";
  depositPaid: boolean;
  depositPaidAt?: string;
  fullAmountPaid: boolean;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: "client" | "provider";
  cancelledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function getProviderFromBooking(booking: Booking): Provider | null {
  if (typeof booking.providerProfileId === "object" && booking.providerProfileId !== null) {
    return booking.providerProfileId as Provider;
  }
  return null;
}

export function getProviderName(booking: Booking): string {
  const provider = getProviderFromBooking(booking);
  return provider?.businessName || "Professional";
}

export function getProviderLogo(booking: Booking): string | null {
  const provider = getProviderFromBooking(booking);
  return provider?.portfolioImages?.[0]?.url || provider?.userId?.avatar || null;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface BlockedDate {
  id: string;
  providerId: string;
  date: string;
  isFullDay: boolean;
  blockedSlots?: string[];
  reason?: string;
}
