import { create } from "zustand";
import { Provider, Service, TeamMember } from "@/types/provider.types";
import { Booking } from "@/types/booking.types";

export interface BookingFlowState {
  currentStep: number;
  selectedProvider: Provider | null;
  selectedServices: Service[];
  selectedTeamMember: TeamMember | null;
  selectedDate: Date | null;
  selectedSlot: { startTime: string; endTime: string } | null;
  bookingNotes: string;
  lastCreatedBooking: Booking | null;

  // Derived State
  totalPrice: number;
  totalDuration: number;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedProvider: (provider: Provider | null) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setSelectedTeamMember: (member: TeamMember | null) => void;
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
  selectedServices: [],
  selectedTeamMember: null,
  selectedDate: null,
  selectedSlot: null,
  bookingNotes: "",
  lastCreatedBooking: null,
  totalPrice: 0,
  totalDuration: 0,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  setSelectedProvider: (provider) => set({ selectedProvider: provider }),

  addService: (service) =>
    set((state) => {
      // Prevent duplicates
      if (state.selectedServices.find((s) => s.id === service.id)) return state;

      const newServices = [...state.selectedServices, service];
      return {
        selectedServices: newServices,
        totalPrice: newServices.reduce((sum, s) => sum + s.price, 0),
        totalDuration: newServices.reduce((sum, s) => sum + s.duration, 0),
      };
    }),

  removeService: (serviceId) =>
    set((state) => {
      const newServices = state.selectedServices.filter(
        (s) => s.id !== serviceId,
      );
      return {
        selectedServices: newServices,
        totalPrice: newServices.reduce((sum, s) => sum + s.price, 0),
        totalDuration: newServices.reduce((sum, s) => sum + s.duration, 0),
      };
    }),

  setSelectedTeamMember: (member) => set({ selectedTeamMember: member }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setBookingNotes: (notes) => set({ bookingNotes: notes }),
  setLastCreatedBooking: (booking) => set({ lastCreatedBooking: booking }),

  resetBookingFlow: () =>
    set({
      currentStep: 1,
      selectedProvider: null,
      selectedServices: [],
      selectedTeamMember: null,
      selectedDate: null,
      selectedSlot: null,
      bookingNotes: "",
      lastCreatedBooking: null,
      totalPrice: 0,
      totalDuration: 0,
    }),
}));
