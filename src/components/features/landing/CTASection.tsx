import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-24 bg-glam-ivory">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-glam-plum">
        <div className="grid lg:grid-cols-2">
          {/* Client Panel */}
          <div className="relative p-12 lg:p-16">
            <div className="relative z-10">
              <span className="text-sm font-bold uppercase tracking-widest text-glam-gold">
                For Clients
              </span>
              <h2 className="mt-4 font-peculiar text-4xl font-bold text-white">
                Find your perfect look today.
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
                className="mt-10 inline-flex items-center rounded-full bg-glam-gold px-8 py-4 font-bold text-glam-plum transition-all hover:bg-white hover:text-glam-plum"
              >
                Find a Professional <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-glam-gold/10 blur-[100px]" />
          </div>

          {/* Provider Panel */}
          <div className="relative bg-glam-charcoal/50 p-12 lg:p-16">
            <div className="relative z-10">
              <span className="text-sm font-bold uppercase tracking-widest text-glam-blush">
                For Professionals
              </span>
              <h2 className="mt-4 font-peculiar text-4xl font-bold text-white">
                Take your beauty business to the next level.
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
                className="mt-10 inline-flex items-center rounded-full bg-glam-blush px-8 py-4 font-bold text-glam-plum transition-all hover:bg-white hover:text-glam-plum"
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
