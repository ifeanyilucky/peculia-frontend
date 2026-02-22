import { create } from "zustand";
import { Provider, Service } from "@/types/provider.types";
import { Booking } from "@/types/booking.types";

interface BookingFlowState {
  currentStep: number;
  selectedProvider: Provider | null;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedSlot: { startTime: string; endTime: string } | null;
  bookingNotes: string;
  lastCreatedBooking: Booking | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedProvider: (provider: Provider | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedSlot: (
    slot: { startTime: string; endTime: string } | null,
  ) => void;
  setBookingNotes: (notes: string) => void;
  setLastCreatedBooking: (booking: Booking | null) => void;
  resetBookingFlow: () => void;
}

export const useBookingStore = create<BookingFlowState>((set) => ({
  currentStep: 1,
  selectedProvider: null,
  selectedService: null,
  selectedDate: null,
  selectedSlot: null,
  bookingNotes: "",
  lastCreatedBooking: null,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setBookingNotes: (notes) => set({ bookingNotes: notes }),
  setLastCreatedBooking: (booking) => set({ lastCreatedBooking: booking }),

  resetBookingFlow: () =>
    set({
      currentStep: 1,
      selectedProvider: null,
      selectedService: null,
      selectedDate: null,
      selectedSlot: null,
      bookingNotes: "",
      lastCreatedBooking: null,
    }),
}));
