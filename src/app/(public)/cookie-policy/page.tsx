import React from "react";
import Link from "next/link";
import { ChevronLeft, Shield, Info, Lock } from "lucide-react";

export default function CookiePolicyPage() {
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
              Cookie <span className="text-rose-600">Policy</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Last updated: February 23, 2026. This policy explains how Peculia
              uses cookies and similar technologies to recognize you when you
              visit our website.
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <Info size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  What are cookies?
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  Cookies are small data files that are placed on your computer
                  or mobile device when you visit a website. Cookies are widely
                  used by website owners in order to make their websites work,
                  or to work more efficiently, as well as to provide reporting
                  information.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <Shield size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  How we use them
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                  We use first-party and third-party cookies for several
                  reasons. Some cookies are required for technical reasons in
                  order for our Website to operate, and we refer to these as
                  &quot;essential&quot; or &quot;strictly necessary&quot;
                  cookies.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Essential:</strong> Core site functionality, logging
                    in, and security.
                  </li>
                  <li>
                    <strong>Analytics:</strong> Understanding how visitors
                    interact with our site.
                  </li>
                  <li>
                    <strong>Marketing:</strong> Personalizing your experience
                    and showing relevant ads.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center text-rose-600">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Managing your preferences
                </h2>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                <p>
                  You can change your cookie preferences at any time by clicking
                  the &quot;Preferences&quot; button in our cookie banner.
                  Alternatively, most web browsers allow some control of most
                  cookies through the browser settings.
                </p>
              </div>
            </section>

            <footer className="pt-12 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 text-center">
                © 2026 Peculia. All rights reserved. For more information,
                please contact us at{" "}
                <a
                  href="mailto:privacy@peculia.com"
                  className="text-rose-600 hover:underline"
                >
                  privacy@peculia.com
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
