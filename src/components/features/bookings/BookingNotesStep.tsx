"use client";

import { useBookingStore } from "@/store/booking.store";
import { MessageSquareText } from "lucide-react";

export default function BookingNotesStep() {
  const { bookingNotes, setBookingNotes, nextStep, prevStep } =
    useBookingStore();
  const MAX_CHARS = 500;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="font-outfit text-2xl font-bold text-slate-900">
          Additional Notes
        </h2>
        <p className="mt-2 text-slate-500">
          Is there anything else your professional should know?
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="relative group">
          <div className="absolute top-4 left-4 text-slate-400 transition-colors group-focus-within:text-rose-500">
            <MessageSquareText size={20} />
          </div>
          <textarea
            value={bookingNotes}
            onChange={(e) =>
              setBookingNotes(e.target.value.slice(0, MAX_CHARS))
            }
            placeholder="e.g. 'I have sensitive eyes', 'This is for my wedding', 'Please bring extra lash extensions'..."
            rows={6}
            className="w-full rounded-3xl border-2 border-slate-100 bg-white p-4 pl-12 text-slate-900 ring-rose-50 placeholder:text-slate-400 focus:border-rose-600 focus:outline-none focus:ring-4 transition-all"
          />
          <div className="absolute bottom-4 right-6 text-xs font-black tracking-widest text-slate-300">
            <span
              className={
                bookingNotes.length >= MAX_CHARS ? "text-rose-600" : ""
              }
            >
              {bookingNotes.length}
            </span>
            /{MAX_CHARS}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-xs font-semibold leading-relaxed text-slate-500">
            <span className="font-bold text-slate-800">Pro-tip:</span> Clear
            instructions help your professional prepare better and ensure you
            get the best possible experience.
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
        <button
          onClick={prevStep}
          className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back to Schedule
        </button>
        <button
          onClick={nextStep}
          className="rounded-full bg-slate-900 px-12 py-4 text-base font-bold text-white transition-all hover:bg-rose-600"
        >
          Review Booking
        </button>
      </div>
    </div>
  );
}
