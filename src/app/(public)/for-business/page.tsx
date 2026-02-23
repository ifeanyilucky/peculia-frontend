"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ForBusinessPage() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 lg:px-8 overflow-hidden">
        {/* Abstract backgrounds */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-rose-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-60" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-sm font-bold mb-6">
                <Sparkles size={16} />
                The New Standard for Beauty Professionals
              </span>
              <h1 className="font-peculiar text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                Grow your <span className="text-rose-600">business</span> with
                Peculia
              </h1>
              <p className="text-xl text-slate-600 font-medium max-w-2xl mb-10 leading-relaxed">
                The all-in-one platform to manage your bookings, clients, and
                payments. Focus on your craft while we handle the rest.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href={ROUTES.partnersPortal}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-2 group"
                >
                  Join as a Partner
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  href="#features"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center"
                >
                  See how it works
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative"
          >
            <div className="relative w-full aspect-[4/5] max-w-[500px] mx-auto rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/Lash_Technician_5k.webp"
                alt="Productive beauty professional"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />

              {/* Floating badges */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Growth
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      +45% increase in bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges / Numbers */}
      <section className="bg-slate-50 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Providers Joined", value: "2,500+" },
            { label: "Monthly Sessions", value: "50k+" },
            { label: "Success Rate", value: "99.9%" },
            { label: "Reviews", value: "4.9/5" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-black text-slate-900 mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Heading */}
      <section id="features" className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-peculiar">
              Everything you need to{" "}
              <span className="text-rose-600">thrive</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              We built Peculia with one goal: to empower professionals like you.
              Our toolbox is designed to eliminate the noise and boost your
              productivity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Calendar className="text-rose-600" />,
                title: "Smart Calendar",
                desc: "Intuitive scheduling with automated reminders and conflict detection.",
              },
              {
                icon: <Users className="text-rose-600" />,
                title: "Client Management",
                desc: "Full histories, preferences, and automated re-booking tools at your fingertips.",
              },
              {
                icon: <CreditCard className="text-rose-600" />,
                title: "Secure Payments",
                desc: "Get paid instantly. Integrated deposits and automated invoicing included.",
              },
              {
                icon: <Smartphone className="text-rose-600" />,
                title: "Pro Portal",
                desc: "A dedicated dashboard to manage your entire operation from any device.",
              },
              {
                icon: <TrendingUp className="text-rose-600" />,
                title: "Insights & Analytics",
                desc: "Track your growth, top services, and busy hours with beautiful charts.",
              },
              {
                icon: <ShieldCheck className="text-rose-600" />,
                title: "Trust & Safety",
                desc: "No-show protection and verified client profiles keep you safe.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white border border-slate-100 p-8 rounded-[2rem] hover:shadow-xl hover:border-rose-100 transition-all group"
              >
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Visual Showcase / Images Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent opacity-10" />

        <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black font-peculiar mb-6">
                Designed for the <span className="text-rose-500">Artists</span>{" "}
                of the industry
              </h2>
              <p className="text-lg text-slate-400 font-medium">
                Whether you're a barber, nail tech, or medspa professional,
                Peculia echoes your attention to detail and premium service.
              </p>
            </div>
            <Link
              href={ROUTES.partnersPortal}
              className="px-8 py-4 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all flex items-center gap-2 group whitespace-nowrap"
            >
              Get Started{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Diagonal Image Gallery */}
        <div className="relative h-[600px] w-full flex items-center">
          <div className="animate-scroll-x hover:pause">
            {[
              "/images/barber.jpg",
              "/images/salon-1.webp",
              "/images/nail-tech.jpg",
              "/images/makeup-artist.png",
              "/images/lashtech2.png",
              // Duplicate for seamless loop
              "/images/barber.jpg",
              "/images/salon-1.webp",
              "/images/nail-tech.jpg",
              "/images/makeup-artist.png",
              "/images/lashtech2.png",
            ].map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[400px] h-[500px] rounded-3xl overflow-hidden shadow-2xl relative group mx-3"
              >
                <Image
                  src={img}
                  alt={`Service Showcase ${i}`}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-rose-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-rose-200">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 font-peculiar leading-tight">
              Ready to take your business to the{" "}
              <span className="text-slate-900">next level?</span>
            </h2>
            <p className="text-xl text-white/90 font-medium mb-12 max-w-2xl mx-auto">
              No hidden fees. No commitments. Join the fastest growing platform
              dedicated to beauty and wellness experts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href={ROUTES.partnersPortal}
                className="w-full sm:w-auto px-10 py-5 bg-white text-rose-600 rounded-full text-xl font-black hover:bg-slate-50 transition-all shadow-xl"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
