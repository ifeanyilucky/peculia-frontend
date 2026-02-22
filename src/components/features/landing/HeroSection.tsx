"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { SPECIALTIES } from "@/constants/specialties";

export default function HeroSection() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (specialty) params.set("specialty", specialty);
    router.push(`${ROUTES.explore}?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 pt-20 pb-16 lg:px-24">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-rose-50 opacity-50 blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] h-[400px] w-[400px] rounded-full bg-pink-50 opacity-40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-1.5 text-sm font-semibold text-rose-600">
            <Sparkles size={16} />
            Verified Beauty Professionals
          </span>
          <h1 className="mt-8 font-outfit text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
            Book Trusted{" "}
            <span className="text-rose-600">Beauty Professionals</span> Near You
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            Discover the best stylists, barbers, and wellness experts. Enjoy
            verified reviews, secure deposits, and a seamless booking
            experience.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-12 w-full max-w-4xl rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-rose-100 md:rounded-full"
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 md:flex-row md:items-center"
          >
            <div className="flex flex-1 items-center px-4">
              <MapPin className="text-rose-500" size={20} />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Where are you? (e.g. Lagos)"
                className="w-full border-none bg-transparent px-3 py-4 text-slate-900 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="h-8 w-px bg-slate-100 hidden md:block" />

            <div className="flex flex-1 items-center px-4">
              <Search className="text-rose-500" size={20} />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full border-none bg-transparent px-3 py-4 text-slate-700 focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              >
                <option value="">All Services</option>
                {SPECIALTIES.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-8 py-4 font-bold text-white transition-all hover:bg-rose-700 md:rounded-full"
            >
              Find a Pro
            </button>
          </form>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
          <button
            onClick={() => router.push(ROUTES.explore)}
            className="transition-colors hover:text-rose-600"
          >
            Popular: Hair Styling
          </button>
          <span className="text-slate-200">•</span>
          <button
            onClick={() => router.push(ROUTES.explore)}
            className="transition-colors hover:text-rose-600"
          >
            Makeup
          </button>
          <span className="text-slate-200">•</span>
          <button
            onClick={() => router.push(ROUTES.explore)}
            className="transition-colors hover:text-rose-600"
          >
            Nail Techs
          </button>
        </div>
      </div>
    </section>
  );
}
