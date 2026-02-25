"use client";

import { useState } from "react";
import { clientService } from "@/services/client.service";
import { Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sileo } from "sileo";

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

export function SecurityTab() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

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
      reset();
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
    <section className="bg-white rounded-4xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
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
          onSubmit={handleSubmit(onChangePassword)}
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
                {...register("currentPassword")}
                type="password"
                className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 _0_0_4px_rgba(225,29,72,0.05)] transition-all outline-none text-slate-900"
              />
            </div>
            {errors.currentPassword && (
              <p className="text-[10px] font-bold text-rose-500 ml-1">
                {errors.currentPassword.message}
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
                {...register("newPassword")}
                type="password"
                className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 _0_0_4px_rgba(225,29,72,0.05)] transition-all outline-none text-slate-900"
              />
            </div>
            {errors.newPassword && (
              <p className="text-[10px] font-bold text-rose-500 ml-1">
                {errors.newPassword.message}
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
                {...register("confirmPassword")}
                type="password"
                className="h-14 w-full pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-200 _0_0_4px_rgba(225,29,72,0.05)] transition-all outline-none text-slate-900"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] font-bold text-rose-500 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 pt-6 flex border-t border-slate-50">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="rounded-xl border border-slate-200 px-8 h-12 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all disabled:opacity-50 active:scale-95"
            >
              {isChangingPassword ? "Updating Security..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
