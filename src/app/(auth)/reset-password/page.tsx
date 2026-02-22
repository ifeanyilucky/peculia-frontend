"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { sileo } from "sileo";
import { PasswordStrengthMeter } from "@/components/features/auth/PasswordStrengthMeter";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: ResetFormValues) => {
    if (!token) {
      sileo.error({
        title: "Invalid Request",
        description: "Reset token is missing.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ token, password: data.password });
      sileo.success({
        title: "Success",
        description: "Your password has been reset. You can now login.",
      });
      router.push(ROUTES.auth.login);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h2 className="font-outfit text-2xl font-bold text-rose-600">
          Invalid Link
        </h2>
        <p className="text-muted-foreground">
          The password reset link is invalid or has expired.
        </p>
        <button
          onClick={() => router.push(ROUTES.auth.forgotPassword)}
          className="text-sm font-medium text-rose-600 hover:underline"
        >
          Request a new link
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="font-outfit text-3xl font-bold tracking-tight">
          Reset Password
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <input
            {...register("password")}
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <PasswordStrengthMeter password={password} />
          {errors.password && (
            <p className="text-xs font-medium text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-rose-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-rose-600" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
