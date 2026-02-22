"use client";

import { Bell, Search, User } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";

export default function DashboardHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30">
      <div className="relative hidden md:block w-96">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search for services or professionals..."
          className="w-full h-11 bg-slate-50 rounded-2xl pl-11 pr-4 text-sm font-medium border-transparent focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-600 border-2 border-slate-50" />
        </button>

        <div className="h-10 w-px bg-slate-100 mx-2" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
              {user?.role === "provider"
                ? "Professional Account"
                : "Client Account"}
            </p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-slate-900 overflow-hidden relative border-2 border-white shadow-lg">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white font-bold">
                {user?.firstName?.[0]}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
