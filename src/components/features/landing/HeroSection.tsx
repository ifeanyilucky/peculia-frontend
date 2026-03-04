"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useSpecialties } from "@/hooks/useSpecialties";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function AppointmentCounter() {
  // Function to calculate deterministic count based on current time
  const calculateCount = () => {
    const now = new Date();
    const secondsSinceMidnight =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const intervalIndex = Math.floor(secondsSinceMidnight / 30);

    // Use a seed based on the date to make it consistent for the day
    const dateSeed =
      now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    let total = 0;
    // Sum up deterministic "random" increments (0-10) for each 30s interval
    for (let i = 0; i < intervalIndex; i++) {
      const x = Math.sin(dateSeed + i) * 10000;
      total += Math.floor((x - Math.floor(x)) * 11);
    }
    return total;
  };

  const [count, setCount] = useState(calculateCount());

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(calculateCount());
    }, 10000); // Check every 10s to stay roughly synced
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
  const { data: specialties = [], isLoading } = useSpecialties();

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
      <div className="absolute top-0 -left-20 h-[500px] w-[500px] rounded-full bg-glam-blush/50 blur-3xl opacity-60" />
      <div className="absolute top-20 -right-20 h-[500px] w-[500px] rounded-full bg-glam-blush/50 blur-3xl opacity-60" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Top Centered Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-4xl"
        >
          {/* <span className="inline-flex items-center gap-2 rounded-full border border-glam-blush bg-white px-4 py-1.5 text-sm font-bold text-slate-700 transition-colors hover:bg-glam-blush/50 mb-8 cursor-pointer">
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-glam-plum uppercase tracking-wider">
              New
            </span>
            Introducing the Glamyad Mobile App
            <span className="text-muted-foreground">→</span>
          </span> */}
          <h1 className="font-peculiar text-4xl sm:text-6xl font-black text-glam-plum ">
            Discover top-rated <span className="text-glam-plum">selfcare</span>{" "}
            near you
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-glam-charcoal sm:text-xl">
            The easiest way to find and book trusted stylists, barbers, and
            wellness experts. Secure your next appointment in seconds.
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
              className="flex flex-col gap-3 rounded-[32px] border border-glam-blush bg-white p-3 lg:flex-row lg:items-center lg:gap-0 lg:rounded-full"
            >
              <div className="flex flex-1 items-center px-4 py-2 lg:border-r lg:border-glam-blush lg:py-0">
                <Search
                  className="mr-3 text-muted-foreground shrink-0"
                  size={20}
                />
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-glam-plum focus:outline-none appearance-none truncate"
                  disabled={isLoading}
                >
                  <option value="">
                    {isLoading ? "Loading..." : "All treatments & venues"}
                  </option>
                  {specialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-1 items-center px-4 py-2 lg:border-r lg:border-glam-blush lg:py-0">
                <MapPin
                  className="mr-3 text-muted-foreground shrink-0"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Current location"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-glam-plum focus:outline-none truncate"
                />
              </div>

              <button
                type="submit"
                className="flex h-12 lg:h-14 items-center justify-center gap-2 rounded-full bg-glam-plum px-8 text-sm font-bold text-white transition-all hover:bg-glam-plum/90 shrink-0"
              >
                Find My Pro
              </button>
            </form>
          </motion.div>

          {/* Rolling Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-glam-blush/50 border border-glam-blush text-sm font-bold text-glam-charcoal"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="tabular-nums">
              <AppointmentCounter />
            </span>
            <span className="text-muted-foreground font-medium">
              people booked their look today
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom Large Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 w-full lg:max-w-[1000px] h-[400px] lg:h-[500px] rounded-2xl overflow-hidden relative border border-glam-blush"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-glam-plum/20 to-transparent z-10" />
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
