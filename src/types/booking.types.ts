import { ProviderUser, Provider } from "./provider.types";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled_by_client"
  | "cancelled_by_provider"
  | "no_show";

export interface Booking {
  id: string;
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
  depositAmount: number; // Total deposit
  teamMemberId?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
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
