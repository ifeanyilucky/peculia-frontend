"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { SPECIALTIES } from "@/constants/specialties";
import { motion } from "framer-motion";
import Image from "next/image";

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
    <section className="relative w-full overflow-hidden bg-white px-6 py-12 lg:px-8 xl:py-20 lg:max-w-7xl mx-auto">
      {/* Background abstract elements */}
      <div className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-rose-50 blur-3xl opacity-60" />

      <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        {/* Left Column Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <h1 className="font-peculiar text-6xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl lg:leading-[1.1]">
            Book local <br className="hidden lg:block" />
            <span className="text-rose-600">selfcare</span> services
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium text-slate-600 sm:text-xl">
            Discover top-rated salons, barbers, medspas, wellness studios and
            beauty experts trusted by millions worldwide.
          </p>

          {/* Search Bar Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 w-full"
          >
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 rounded-[32px] border border-slate-100 bg-white p-3 shadow-xl shadow-rose-100/50 lg:flex-row lg:items-center lg:gap-0 lg:rounded-full"
            >
              <div className="flex flex-1 items-center px-4 py-2 lg:border-r lg:border-slate-100 lg:py-0">
                <Search
                  className="mr-3 text-slate-400 flex-shrink-0"
                  size={20}
                />
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none appearance-none truncate"
                >
                  <option value="">All treatments & venues</option>
                  {SPECIALTIES.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-1 items-center px-4 py-2 lg:border-r lg:border-slate-100 lg:py-0">
                <MapPin
                  className="mr-3 text-slate-400 flex-shrink-0"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Current location"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none truncate"
                />
              </div>

              <button
                type="submit"
                className="flex h-12 lg:h-14 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 text-sm font-bold text-white transition-all hover:bg-rose-600 shrink-0"
              >
                Search
              </button>
            </form>
          </motion.div>

          {/* Popular Tags */}
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-medium text-slate-500">
            <button
              onClick={() => router.push(ROUTES.public.explore)}
              className="transition-colors hover:text-rose-600"
            >
              Hair Styling
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
        </motion.div>

        {/* Right Column Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative h-[400px] w-full lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2874&auto=format&fit=crop"
            alt="Woman receiving premium salon service"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
