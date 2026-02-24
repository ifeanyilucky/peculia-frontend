"use client";

/**
 * AddPhoneModal
 *
 * Shown when an authenticated user does NOT have a phone number
 * on their profile. Captures the number, calls PATCH /users/me,
 * updates the Zustand auth store, then fires `onSuccess` to proceed
 * with booking confirmation.
 *
 * Matches the "Add Phone" UI in the product screenshot.
 */

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

interface AddPhoneModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const COUNTRY_CODES = [
  { code: "+234", flag: "🇳🇬", label: "NG" },
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "GB" },
  { code: "+27", flag: "🇿🇦", label: "ZA" },
  { code: "+233", flag: "🇬🇭", label: "GH" },
  { code: "+254", flag: "🇰🇪", label: "KE" },
];

export default function AddPhoneModal({
  onSuccess,
  onClose,
}: AddPhoneModalProps) {
  const { updateUser } = useAuthStore();
  const [countryCode, setCountryCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setError(null);
    setIsLoading(true);

    const fullPhone = `${countryCode}${phoneNumber.replace(/^0/, "")}`;

    try {
      await authService.updateProfile({ phone: fullPhone });
      // Sync the phone into the local auth store so we don't prompt again
      updateUser({ phone: fullPhone });
      onSuccess();
    } catch {
      setError("Could not save your phone number. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* ── Backdrop ──────────────────────────────── */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal panel ──────────────────────────── */}
      <div className="relative w-full max-w-md bg-white rounded-4xl shadow-2xl shadow-slate-900/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="px-8 pt-8 pb-8">
          <h2 className="font-peculiar text-3xl font-black text-slate-900 tracking-tight">
            Add Phone
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Enter your phone number to confirm your appointment
          </p>

          {error && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 border border-rose-100">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-black text-slate-900 mb-2">
                Mobile number
              </label>
              <div className="flex gap-2">
                {/* Country code picker */}
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors appearance-none pr-8 cursor-pointer"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "calc(100% - 10px) center",
                  }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                {/* Phone number input */}
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0907 149 9826"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !phoneNumber.trim()}
              className="w-full rounded-full bg-slate-900 py-4 text-sm font-black text-white hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving…
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
