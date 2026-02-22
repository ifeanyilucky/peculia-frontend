"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Shield, Loader2, Save, Camera } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { sileo } from "sileo";

const profileSchema = z.zod.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettingsForm() {
  const { user, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      sileo.success({
        title: "Updated",
        description: "Your personal details have been saved.",
      });
    } catch {
      sileo.error({
        title: "Update Failed",
        description: "Could not save your changes.",
      });
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <div>
          <h3 className="font-outfit text-xl font-bold text-slate-900">
            Personal Information
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">
            Manage your account identity
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
          <User size={20} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="space-y-1.5 flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              First Name
            </label>
            <div className="relative">
              <input
                {...register("firstName")}
                className={cn(
                  "h-14 w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none",
                  errors.firstName && "border-rose-500 bg-rose-50",
                )}
              />
            </div>
            {errors.firstName && (
              <p className="text-[10px] font-bold text-rose-500 pl-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              Last Name
            </label>
            <div className="relative">
              <input
                {...register("lastName")}
                className={cn(
                  "h-14 w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none",
                  errors.lastName && "border-rose-500 bg-rose-50",
                )}
              />
            </div>
            {errors.lastName && (
              <p className="text-[10px] font-bold text-rose-500 pl-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors"
              size={18}
            />
            <input
              {...register("email")}
              disabled // Email change usually requires verification flow
              className="h-14 w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-slate-900 text-xs font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper for cn (will import from utils)
import { cn } from "@/lib/utils";
