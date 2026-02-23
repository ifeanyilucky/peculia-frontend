"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { SPECIALTIES } from "@/constants/specialties";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function AppointmentCounter() {
  const [count, setCount] = useState(1532);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={count}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-block"
      >
        {count.toLocaleString()}
      </motion.span>
    </AnimatePresence>
  );
}

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
    <section className="relative w-full overflow-hidden bg-white px-6 pt-16 lg:px-8 xl:pt-24 pb-20 mx-auto max-w-7xl">
      {/* Background abstract elements */}
      <div className="absolute top-0 -left-20 h-[500px] w-[500px] rounded-full bg-rose-50 blur-3xl opacity-60" />
      <div className="absolute top-20 -right-20 h-[500px] w-[500px] rounded-full bg-slate-50/80 blur-3xl opacity-60" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Top Centered Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-4xl"
        >
          {/* <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 mb-8 cursor-pointer">
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-600 uppercase tracking-wider">
              New
            </span>
            Introducing the Peculia Mobile App
            <span className="text-slate-400">→</span>
          </span> */}
          <h1 className="font-peculiar text-4xl sm:text-6xl font-black text-slate-900 ">
            Book local <span className="text-rose-600">selfcare</span> services
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-slate-600 sm:text-xl">
            Discover top-rated salons, barbers, medspas, wellness studios and
            beauty experts trusted by millions worldwide.
          </p>

          {/* Search Bar Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 w-full lg:w-[850px]"
          >
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 rounded-[32px] border border-slate-100 bg-white p-3 shadow-xl shadow-rose-100/50 lg:flex-row lg:items-center lg:gap-0 lg:rounded-full"
            >
              <div className="flex flex-1 items-center px-4 py-2 lg:border-r lg:border-slate-100 lg:py-0">
                <Search className="mr-3 text-slate-400 shrink-0" size={20} />
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
                <MapPin className="mr-3 text-slate-400 shrink-0" size={20} />
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
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500"></div>
        </motion.div>

        {/* Bottom Large Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 w-full lg:max-w-[1000px] h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent z-10" />
          <Image
            src="/images/makeup-artist2.jpg"
            alt="Woman receiving premium salon service"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1000px"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
