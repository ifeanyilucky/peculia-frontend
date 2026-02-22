"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import ProfileSettingsForm from "@/components/features/settings/ProfileSettingsForm";
import BusinessDetailsForm from "@/components/features/settings/BusinessDetailsForm";
import {
  Loader2,
  Settings,
  Bell,
  Lock,
  Globe,
  Zap,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProviderSettingsPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["provider-profile", "me"],
    queryFn: () => providerService.getMyProfile(),
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-peculiar text-4xl font-black text-slate-900">
            Settings
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Manage your professional profile and account preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar (Local to Settings) */}
        <div className="w-full lg:w-72 shrink-0 space-y-2">
          {[
            {
              id: "profile",
              label: "Account Profile",
              icon: Settings,
              active: true,
            },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security & Privacy", icon: Lock },
            { id: "display", label: "Public Profile", icon: Globe },
            { id: "integrations", label: "Integrations", icon: Zap },
          ].map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                item.active
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                  : "bg-white border border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
              <ChevronRight
                size={14}
                className={cn(
                  "transition-transform group-hover:translate-x-1",
                  item.active ? "text-white/40" : "text-slate-200",
                )}
              />
            </button>
          ))}

          <div className="mt-8 p-6 rounded-3xl bg-rose-50 border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Growth Plan
              </span>
            </div>
            <p className="text-xs font-medium text-rose-900 leading-relaxed">
              You're using the Professional tier. Your profile is boosted in
              discovery by 15%.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-10">
          {isLoading ? (
            <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100">
              <Loader2 className="animate-spin text-rose-600" size={32} />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400 mt-4">
                Fetching preferences...
              </p>
            </div>
          ) : (
            <>
              <ProfileSettingsForm />
              <BusinessDetailsForm initialData={profile} />

              {/* Danger Zone */}
              <div className="p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100 space-y-6">
                <div>
                  <h3 className="font-peculiar text-xl font-bold text-rose-900">
                    Danger Zone
                  </h3>
                  <p className="text-xs font-medium text-rose-600/60 mt-1 uppercase tracking-widest">
                    Irreversible Actions
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white/50 border border-rose-100">
                  <div>
                    <h4 className="text-sm font-bold text-rose-900">
                      Deactivate Account
                    </h4>
                    <p className="text-xs text-rose-600/80 mt-1">
                      This will hide your profile and cancel all pending
                      bookings.
                    </p>
                  </div>
                  <button className="h-12 px-6 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
                    Deactivate
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
