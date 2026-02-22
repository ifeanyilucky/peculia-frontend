"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { sileo } from "sileo";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
      sileo.success({
        title: "Link sent",
        description: "Password reset link has been sent to your email.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <Mail size={24} />
        </div>
        <div className="space-y-2">
          <h2 className="font-peculiar text-2xl font-bold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent password reset instructions to your email address.
          </p>
        </div>
        <Link
          href={ROUTES.auth.login}
          className="inline-flex items-center text-sm font-medium text-rose-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-peculiar text-3xl font-bold">
          Forgot Password
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="name@example.com"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.email && (
            <p className="text-xs font-medium text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Sending link..." : "Send Reset Link"}
        </button>
      </form>

      <div className="text-center">
        <Link
          href={ROUTES.auth.login}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-rose-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
      </div>
    </div>
  );
}
