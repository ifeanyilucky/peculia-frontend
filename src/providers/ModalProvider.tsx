"use client";

import { useUIStore } from "@/store/ui.store";
import BookingAuthModal from "@/components/features/booking/BookingAuthModal";

export const ModalProvider = () => {
  const { activeModal, closeModal } = useUIStore();

  if (!activeModal) return null;

  return (
    <>
      {activeModal === "booking-auth" && (
        <BookingAuthModal
          onSuccess={() => {
            closeModal();
            // Optional: window.location.reload() or similar if we want to re-trigger current page data
          }}
          onClose={closeModal}
        />
      )}
    </>
  );
};
