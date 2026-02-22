import { create } from "zustand";

interface BookingFlowState {
  selectedProvider: any | null;
  selectedService: any | null;
  selectedDate: Date | null;
  selectedSlot: string | null;
  bookingNotes: string;

  setSelectedProvider: (provider: any) => void;
  setSelectedService: (service: any) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedSlot: (slot: string | null) => void;
  setBookingNotes: (notes: string) => void;
  resetBookingFlow: () => void;
}

export const useBookingStore = create<BookingFlowState>((set) => ({
  selectedProvider: null,
  selectedService: null,
  selectedDate: null,
  selectedSlot: null,
  bookingNotes: "",

  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setBookingNotes: (notes) => set({ bookingNotes: notes }),
  resetBookingFlow: () =>
    set({
      selectedProvider: null,
      selectedService: null,
      selectedDate: null,
      selectedSlot: null,
      bookingNotes: "",
    }),
}));
