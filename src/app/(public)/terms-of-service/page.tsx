import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  AppWindow,
  CreditCard,
  ShieldAlert,
} from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <main className="flex-1 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 mb-8 transition-colors group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Home</span>
          </Link>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Terms of <span className="text-rose-600">Service</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Last updated: February 25, 2026. Please read these terms carefully
              before using the Glamyad platform.
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <AppWindow size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  1. Acceptance of Terms
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  By accessing or using Glamyad, you agree to be bound by these
                  Terms of Service and all applicable laws and regulations. If
                  you do not agree with any of these terms, you are prohibited
                  from using or accessing this site.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  2. Service Description
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  Glamyad provides a platform connecting beauty and wellness
                  professionals (&quot;Providers&quot;) with clients seeking
                  their services. Glamyad acts as an intermediary and is not
                  responsible for the actual performance of services by
                  Providers.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  3. Booking & Payments
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                <ul className="list-disc pl-5 space-y-3 text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Appointments:</strong> Bookings are subject to
                    Provider availability.
                  </li>
                  <li>
                    <strong>Payments:</strong> All payments are processed
                    securely. Providers may require a deposit or full payment
                    upfront.
                  </li>
                  <li>
                    <strong>Cancellation Policy:</strong> Free cancellation up
                    to 24 hours before the appointment. Less than 24h notice
                    incurs a 25% fee. No-shows incur a 50% fee.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <ShieldAlert size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  4. User Conduct
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  Users agree to provide accurate information, respect Provider
                  schedules, and maintain professional conduct. Glamyad reserves
                  the right to suspend accounts that violate these guidelines or
                  engage in fraudulent activity.
                </p>
              </div>
            </section>

            <footer className="pt-12 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 text-center">
                © 2026 Glamyad. All rights reserved. For legal inquiries, please
                contact{" "}
                <a
                  href="mailto:legal@glamyad.com"
                  className="text-rose-600 hover:underline"
                >
                  legal@glamyad.com
                </a>
                .
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
