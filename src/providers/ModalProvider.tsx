"use client";

import { useUIStore } from "@/store/ui.store";
import BookingAuthModal from "@/components/features/booking/BookingAuthModal";

export const ModalProvider = () => {
  const { activeModal, closeModal, modalData } = useUIStore();

  if (!activeModal) return null;

  return (
    <>
      {activeModal === "booking-auth" && (
        <BookingAuthModal
          onSuccess={() => {
            if (modalData?.onSuccess) {
              modalData.onSuccess();
            }
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
    </>
  );
};
