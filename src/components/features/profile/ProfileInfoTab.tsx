"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { clientService } from "@/services/client.service";
import { User, Mail, Phone, Camera, Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sileo } from "sileo";
import Image from "next/image";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileInfoTab() {
  const { user, updateUser } = useAuthStore();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },
  });

  const onUpdateProfile = async (data: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    try {
      const updated = await clientService.updateProfile(data);
      updateUser(updated);
      sileo.success({
        title: "Profile Updated",
        description: "Your personal information has been saved.",
      });
    } catch {
      sileo.error({
        title: "Update Failed",
        description: "Could not save profile changes.",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <section className="bg-white rounded-4xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 lg:p-10 space-y-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Avatar Upload */}
          <div className="relative group shrink-0">
            <div className="h-32 w-32 rounded-3xl bg-slate-900 overflow-hidden border-4 border-white relative">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white text-4xl font-peculiar font-black uppercase">
                  {user?.firstName?.[0]}
                </div>
              )}
            </div>
            <button className="absolute -bottom-3 -right-3 h-12 w-12 rounded-[1.25rem] bg-glam-plum text-white flex items-center justify-center border-4 border-white hover:bg-rose-700 transition-all hover:scale-105 active:scale-95">
              <Camera size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Profile Form */}
          <form
            onSubmit={handleSubmit(onUpdateProfile)}
            className="flex-1 w-full space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  First Name
                </label>
                <div className="relative group/input">
                  <User
                    size={18}
                    strokeWidth={2}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-slate-900 transition-colors"
                  />
                  <input
                    {...register("firstName")}
                    className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 _0_0_4px_rgba(225,29,72,0.05)] transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-[10px] font-bold text-glam-plum ml-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Last Name
                </label>
                <div className="relative group/input">
                  <User
                    size={18}
                    strokeWidth={2}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-slate-900 transition-colors"
                  />
                  <input
                    {...register("lastName")}
                    className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 _0_0_4px_rgba(225,29,72,0.05)] transition-all outline-none text-slate-900"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-[10px] font-bold text-glam-plum ml-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Email (Read-only)
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    strokeWidth={2}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    value={user?.email || ""}
                    disabled
                    className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold transition-all outline-none cursor-not-allowed text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Phone Number
                </label>
                <div className="relative group/input">
                  <Phone
                    size={18}
                    strokeWidth={2}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-slate-900 transition-colors"
                  />
                  <input
                    {...register("phone")}
                    placeholder="+234..."
                    className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 _0_0_4px_rgba(225,29,72,0.05)] transition-all outline-none text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end border-t border-slate-50">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 h-14 text-[10px] font-black uppercase tracking-[0.15em] text-white hover:bg-glam-plum transition-all /5 disabled:opacity-50 active:scale-95"
              >
                {isUpdatingProfile ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} strokeWidth={2.5} />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
