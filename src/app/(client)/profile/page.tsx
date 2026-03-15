"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { clientService } from "@/services/client.service";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  ShieldCheck,
  Save,
  Loader2,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sileo } from "sileo";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NotificationsTab } from "@/components/features/profile/NotificationsTab";
import { DangerZoneTab } from "@/components/features/profile/DangerZoneTab";

/* --- Schemas --- */
const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val.replace(/[\s-]/g, "")),
      "Invalid phone number format",
    ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

/* --- Tab Config --- */
type TabId = "profile" | "security" | "notifications" | "danger";

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "profile", label: "Personal Info", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function ClientProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  /* --- Forms --- */
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  /* --- Handlers --- */
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

  const onChangePassword = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      await clientService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      sileo.success({
        title: "Password Changed",
        description: "Your security credentials have been updated.",
      });
      resetPassword();
    } catch (err: any) {
      sileo.error({
        title: "Security Error",
        description:
          err.response?.data?.message || "Could not change password.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="space-y-3 px-2">
        <h1 className="font-peculiar text-2xl font-black text-slate-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 font-medium max-w-lg">
          Manage your personal details, security preferences, and select how you
          want to be notified about updates.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0 flex overflow-x-auto lg:flex-col gap-2 pb-4 lg:pb-0 scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDanger = tab.id === "danger";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3.5 rounded-[1.25rem] transition-all whitespace-nowrap lg:whitespace-normal font-black uppercase tracking-widest text-[10px]",
                  isActive
                    ? isDanger
                      ? "bg-rose-50 text-glam-plum"
                      : "bg-slate-900 text-white"
                    : isDanger
                      ? "text-glam-plum hover:bg-rose-50/50"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <tab.icon size={16} strokeWidth={isActive ? 3 : 2} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* ---- PROFILE TAB ---- */}
          {activeTab === "profile" && (
            <section className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
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
                    onSubmit={handleProfileSubmit(onUpdateProfile)}
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
                            {...regProfile("firstName")}
                            className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        {profileErrors.firstName && (
                          <p className="text-[10px] font-bold text-glam-plum ml-1">
                            {profileErrors.firstName.message}
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
                            {...regProfile("lastName")}
                            className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 transition-all outline-none text-slate-900"
                          />
                        </div>
                        {profileErrors.lastName && (
                          <p className="text-[10px] font-bold text-glam-plum ml-1">
                            {profileErrors.lastName.message}
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
                            {...regProfile("phone")}
                            placeholder="+234..."
                            className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 transition-all outline-none text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end border-t border-slate-50">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 h-14 text-[10px] font-black uppercase tracking-[0.15em] text-white hover:bg-glam-plum transition-all disabled:opacity-50 active:scale-95 border border-slate-200"
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
          )}

          {/* ---- SECURITY TAB ---- */}
          {activeTab === "security" && (
            <section className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="p-8 lg:p-10 space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Security & Credentials
                    </h3>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handlePasswordSubmit(onChangePassword)}
                  className="grid md:grid-cols-2 gap-8 lg:pr-24"
                >
                  <div className="md:col-span-2 space-y-2 max-w-md">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Current Password
                    </label>
                    <div className="relative group/input">
                      <Lock
                        size={18}
                        strokeWidth={2}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-slate-900 transition-colors"
                      />
                      <input
                        {...regPassword("currentPassword")}
                        type="password"
                        className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 transition-all outline-none text-slate-900"
                      />
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-[10px] font-bold text-glam-plum ml-1">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      New Password
                    </label>
                    <div className="relative group/input">
                      <Lock
                        size={18}
                        strokeWidth={2}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-slate-900 transition-colors"
                      />
                      <input
                        {...regPassword("newPassword")}
                        type="password"
                        className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 transition-all outline-none text-slate-900"
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-[10px] font-bold text-glam-plum ml-1">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Confirm Password
                    </label>
                    <div className="relative group/input">
                      <Lock
                        size={18}
                        strokeWidth={2}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-slate-900 transition-colors"
                      />
                      <input
                        {...regPassword("confirmPassword")}
                        type="password"
                        className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 transition-all outline-none text-slate-900"
                      />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-[10px] font-bold text-glam-plum ml-1">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 pt-6 flex border-t border-slate-50">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="rounded-xl border border-slate-200 px-8 h-12 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all disabled:opacity-50 active:scale-95"
                    >
                      {isChangingPassword
                        ? "Updating Security..."
                        : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* ---- NOTIFICATIONS TAB ---- */}
          {activeTab === "notifications" && <NotificationsTab />}

          {/* ---- DANGER ZONE TAB ---- */}
          {activeTab === "danger" && <DangerZoneTab />}
        </div>
      </div>
    </div>
  );
}
