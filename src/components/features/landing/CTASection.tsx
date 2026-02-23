import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-slate-900">
        <div className="grid lg:grid-cols-2">
          {/* Client Panel */}
          <div className="relative p-12 lg:p-16">
            <div className="relative z-10">
              <span className="text-sm font-bold uppercase tracking-widest text-rose-500">
                For Clients
              </span>
              <h2 className="mt-4 font-peculiar text-4xl font-bold text-white">
                Find your next favorite stylist today.
              </h2>
              <ul className="mt-8 space-y-4">
                {[
                  "Browse thousands of verified pros",
                  "Secure appointment bookings",
                  "Deposit protection guaranteed",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <CheckCircle2 size={20} className="text-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={ROUTES.public.explore}
                className="mt-10 inline-flex items-center rounded-full bg-rose-600 px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-slate-900"
              >
                Find a Professional <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-[100px]" />
          </div>

          {/* Provider Panel */}
          <div className="relative bg-slate-800 p-12 lg:p-16">
            <div className="relative z-10">
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-500">
                For Professionals
              </span>
              <h2 className="mt-4 font-peculiar text-4xl font-bold text-white">
                Grow your beauty business with ease.
              </h2>
              <ul className="mt-8 space-y-4">
                {[
                  "Automated booking management",
                  "Zero no-show policies",
                  "Verified professional badge",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={ROUTES.public.forBusiness}
                className="mt-10 inline-flex items-center rounded-full bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:bg-emerald-500 hover:text-white"
              >
                Join as a Professional <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
