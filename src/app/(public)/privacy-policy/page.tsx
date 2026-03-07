import React from "react";
import Link from "next/link";
import { ChevronLeft, Eye, Database, Share2, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Privacy <span className="text-rose-600">Policy</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Last updated: February 25, 2026. We value your privacy and are
              committed to protecting your personal data.
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <Database size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  1. Information We Collect
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  We collect information you provide directly to us, such as
                  when you create an account, book a service, or communicate
                  with a Provider. This includes:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Name, email address, and phone number.</li>
                  <li>Booking history and service preferences.</li>
                  <li>
                    Payment information (processed securely via third-party
                    providers).
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <Eye size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  2. How We Use Your Data
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  Your data is used to provide and improve our services,
                  including:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Facilitating bookings with Providers.</li>
                  <li>Sending appointment reminders and updates.</li>
                  <li>Personalizing your experience on the platform.</li>
                  <li>Ensuring security and preventing fraud.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <Share2 size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  3. Sharing with Providers
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                <p>
                  When you book a service, we share necessary information (like
                  your name and contact details) with the chosen Provider so
                  they can fulfill your appointment. We do not sell your
                  personal data to third parties.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <ShieldCheck size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  4. Data Security
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  We implement industry-standard security measures to protect
                  your information. However, no method of transmission over the
                  internet is 100% secure, and we cannot guarantee absolute
                  security.
                </p>
              </div>
            </section>

            <footer className="pt-12 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 text-center">
                © 2026 Glamyad. All rights reserved. For privacy concerns,
                please contact{" "}
                <a
                  href="mailto:privacy@glamyad.com"
                  className="text-rose-600 hover:underline"
                >
                  privacy@glamyad.com
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
