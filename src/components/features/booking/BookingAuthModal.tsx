"use client";

/**
 * BookingAuthModal
 *
 * Shown when an unauthenticated customer tries to confirm a booking.
 * Two tabs: Sign In (existing users) and Create Account (new users).
 * After successful auth the `onSuccess` callback fires, which
 * re-triggers the booking submission from the parent.
 *
 * No page redirect ever happens — the customer stays in the booking flow.
 */

import { useState } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

type Tab = "signin" | "register";

interface BookingAuthModalProps {
  /** Called after successful login / registration */
  onSuccess: () => void;
  onClose: () => void;
}

export default function BookingAuthModal({
  onSuccess,
  onClose,
}: BookingAuthModalProps) {
  const [tab, setTab] = useState<Tab>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();

  /* ── Sign-in form state ───────────────────────── */
  const [signInData, setSignInData] = useState({ email: "", password: "" });

  /* ── Register form state ──────────────────────── */
  const [regData, setRegData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  /* ── Handlers ─────────────────────────────────── */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authService.login({
        email: signInData.email,
        password: signInData.password,
      });
      setAuth(result.user, result.accessToken, result.refreshToken);
      onSuccess();
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authService.registerClient({
        firstName: regData.firstName,
        lastName: regData.lastName,
        email: regData.email,
        password: regData.password,
        phone: regData.phone || undefined,
      });
      // Auto-login after registration
      const result = await authService.login({
        email: regData.email,
        password: regData.password,
      });
      setAuth(result.user, result.accessToken, result.refreshToken);
      onSuccess();
    } catch {
      setError("Could not create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* ── Backdrop ──────────────────────────────── */
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal panel ──────────────────────────── */}
      <div className="relative w-full max-w-md bg-white rounded-4xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 border border-slate-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors z-10"
        >
          <X size={22} />
        </button>

        {/* Heading */}
        <div className="px-8 pt-8 pb-0">
          <h2 className="font-peculiar text-3xl font-black text-slate-900 tracking-tight">
            {tab === "signin" ? "Sign in to confirm" : "Create your account"}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            {tab === "signin"
              ? "Your booking details are saved — just sign in to continue."
              : "Create an account to track your bookings and get reminders."}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6 pb-0 flex gap-2">
          {(["signin", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError(null);
              }}
              className={cn(
                "flex-1 py-2.5 rounded-full text-sm font-black transition-all",
                tab === t
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              )}
            >
              {t === "signin" ? "Sign in" : "New here?"}
            </button>
          ))}
        </div>

        {/* Form area */}
        <div className="px-8 py-6">
          {error && (
            <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 border border-rose-100">
              {error}
            </p>
          )}

          {/* ── Sign-in form ── */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 bottom-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-full bg-slate-900 py-4 text-sm font-black text-white hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in & Confirm"
                )}
              </button>
            </form>
          )}

          {/* ── Register form ── */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.firstName}
                    onChange={(e) =>
                      setRegData((p) => ({ ...p, firstName: e.target.value }))
                    }
                    placeholder="Jane"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    required
                    value={regData.lastName}
                    onChange={(e) =>
                      setRegData((p) => ({ ...p, lastName: e.target.value }))
                    }
                    placeholder="Doe"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) =>
                    setRegData((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Phone{" "}
                  <span className="text-slate-400 font-medium normal-case">
                    (for appointment reminders)
                  </span>
                </label>
                <input
                  type="tel"
                  value={regData.phone}
                  onChange={(e) =>
                    setRegData((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+234 800 000 0000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={regData.password}
                  onChange={(e) =>
                    setRegData((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Min 8 characters"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 bottom-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-full bg-slate-900 py-4 text-sm font-black text-white hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create account & Confirm"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
