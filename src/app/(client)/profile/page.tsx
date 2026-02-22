"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { clientService } from "@/services/client.service";
import {
  User,
  Mail,
  Phone,
  Lock,
  Trash2,
  Camera,
  ShieldCheck,
  Save,
  Loader2,
} from "lucide-react";
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

export default function ClientProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

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

  const onDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      sileo.error({
        title: "Invalid Input",
        description: 'Please type "DELETE" to confirm.',
      });
      return;
    }
    setIsDeleting(true);
    try {
      await clientService.deleteAccount("DELETE");
      // Handle logout/redirect
    } catch {
      sileo.error({
        title: "Action Failed",
        description: "Could not delete your account at this time.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 px-2">
        <h1 className="font-peculiar text-4xl font-black text-slate-900">
          Account Settings
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          Manage your personal details and security preferences.
        </p>
      </div>

      <div className="grid gap-10">
        {/* Personal Information */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-8 lg:p-10 space-y-10">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="relative group shrink-0">
                <div className="h-32 w-32 rounded-[2.5rem] bg-slate-900 overflow-hidden border-4 border-white shadow-2xl relative">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white text-4xl font-black">
                      {user?.firstName?.[0]}
                    </div>
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-rose-600 transition-all">
                  <Camera size={18} />
                </button>
              </div>

              <form
                onSubmit={handleProfileSubmit(onUpdateProfile)}
                className="flex-1 w-full space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                      <input
                        {...regProfile("firstName")}
                        className="h-14 w-full pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                      />
                    </div>
                    {profileErrors.firstName && (
                      <p className="text-[10px] font-bold text-rose-500 ml-1">
                        {profileErrors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                      <input
                        {...regProfile("lastName")}
                        className="h-14 w-full pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                      />
                    </div>
                    {profileErrors.lastName && (
                      <p className="text-[10px] font-bold text-rose-500 ml-1">
                        {profileErrors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2 opacity-60">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Email Address (Locked)
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                      <input
                        value={user?.email || ""}
                        disabled
                        className="h-14 w-full pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold transition-all outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                      <input
                        {...regProfile("phone")}
                        placeholder="+234..."
                        className="h-14 w-full pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex items-center gap-2 rounded-2xl bg-slate-900 px-10 py-4 text-sm font-black text-white hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Security / Password Change */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-8 lg:p-10 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Security & Credentials
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </div>

            <form
              onSubmit={handlePasswordSubmit(onChangePassword)}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    {...regPassword("currentPassword")}
                    type="password"
                    className="h-14 w-full pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                  />
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-[10px] font-bold text-rose-500 ml-1">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    {...regPassword("newPassword")}
                    type="password"
                    className="h-14 w-full pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                  />
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-[10px] font-bold text-rose-500 ml-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    {...regPassword("confirmPassword")}
                    type="password"
                    className="h-14 w-full pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 transition-all outline-none"
                  />
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-[10px] font-bold text-rose-500 ml-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="rounded-2xl border-2 border-slate-900 px-8 py-3 text-sm font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
                >
                  {isChangingPassword
                    ? "Updating SECURITY..."
                    : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-rose-50/50 rounded-[2.5rem] border border-rose-100 overflow-hidden shadow-sm">
          <div className="p-8 lg:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-600">
                  Danger Zone
                </h3>
                <p className="text-xs font-medium text-rose-800/60">
                  Permanently delete your account and all associated data.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-rose-100 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm font-bold text-slate-900">
                  Type &quot;DELETE&quot; to confirm
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  This action is irreversible and will cancel all active
                  bookings.
                </p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <input
                  value={deleteConfirmation}
                  onChange={(e) =>
                    setDeleteConfirmation(e.target.value.toUpperCase())
                  }
                  placeholder="Confirmation..."
                  className="h-12 w-full md:w-48 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-black tracking-widest focus:bg-white focus:border-rose-200 outline-none transition-all"
                />
                <button
                  onClick={onDeleteAccount}
                  disabled={isDeleting || deleteConfirmation !== "DELETE"}
                  className="h-12 px-6 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all shrink-0 shadow-lg shadow-rose-200"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
