"use client";

import { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { SPECIALTIES } from "@/constants/specialties";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (specialty) params.set("specialty", specialty);
    router.push(`${ROUTES.public.explore}?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-white px-6 py-20 lg:px-24">
      {/* Background abstract elements */}
      <div className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-rose-50 blur-3xl opacity-60" />
      <div className="absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-slate-50 blur-3xl opacity-60" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-rose-50 px-4 py-1.5 text-sm font-bold tracking-wide text-rose-600 uppercase">
            Beauty Reinvented
          </span>
          <h1 className="mt-8 font-peculiar text-6xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl">
            Book Trusted <br />
            <span className="text-rose-600">Professionals</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-medium text-slate-600 sm:text-xl">
            Peculia connects you with the finest beauty and wellness experts in
            your city. Experience premium service with direct booking and secure
            payments.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mt-12 w-full max-w-6xl"
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 rounded-[32px] border border-slate-100 bg-white p-3 shadow-2xl shadow-slate-200 lg:flex-row lg:items-center lg:gap-0 lg:rounded-full"
          >
            <div className="flex flex-1 items-center px-6 py-2 lg:py-0">
              <Search className="mr-3 text-slate-400" size={20} />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none appearance-none"
              >
                <option value="">What service are you looking for?</option>
                {SPECIALTIES.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden h-8 w-[1px] bg-slate-100 lg:block" />

            <div className="flex flex-1 items-center px-6 py-2 lg:py-0">
              <MapPin className="mr-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Where? (e.g. Lagos)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex h-14 items-center justify-center gap-2 rounded-[24px] bg-slate-900 px-10 text-sm font-bold text-white transition-all hover:bg-rose-600 lg:rounded-full"
            >
              Search Professionals
              <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>

        {/* Popular Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
          <button
            onClick={() => router.push(ROUTES.public.explore)}
            className="transition-colors hover:text-rose-600"
          >
            Popular: Hair Styling
          </button>
          <span>•</span>
          <button
            onClick={() => router.push(ROUTES.public.explore)}
            className="transition-colors hover:text-rose-600"
          >
            Nails
          </button>
          <span>•</span>
          <button
            onClick={() => router.push(ROUTES.public.explore)}
            className="transition-colors hover:text-rose-600"
          >
            Massage
          </button>
        </div>
      </div>
    </section>
  );
}
