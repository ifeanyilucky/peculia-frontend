"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { sileo } from "sileo";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions",
      ),
    role: z.literal("client"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterClientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "client",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await authService.registerClient(data);
      setIsSuccess(true);

      sileo.success({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });

      setTimeout(() => {
        router.push(ROUTES.auth.login);
      }, 3000);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-green-100 p-3 text-green-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="font-peculiar text-2xl font-bold">Check your email</h2>
        <p className="text-muted-foreground">
          We&apos;ve sent a verification link to your email address. You will be
          redirected to login shortly.
        </p>
        <button
          onClick={() => router.push(ROUTES.auth.login)}
          className="text-sm font-medium text-rose-600 hover:underline"
        >
          Go to Login now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="font-peculiar text-3xl font-bold text-slate-900">
          Create an Account
        </h2>
        <p className="text-sm text-slate-500">
          Sign up as a client to start booking beauty professionals
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-700 leading-none"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              {...register("firstName")}
              id="firstName"
              placeholder="e.g. John"
              className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-50/50 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.firstName && (
              <p className="text-xs font-medium text-rose-500">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-700 leading-none"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              {...register("lastName")}
              id="lastName"
              placeholder="e.g. Doe"
              className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-50/50 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.lastName && (
              <p className="text-xs font-medium text-rose-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-slate-700 leading-none"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="e.g. john@example.com"
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-50/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-xs font-medium text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-slate-700 leading-none"
            htmlFor="password"
          >
            Password
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-50/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <PasswordStrengthMeter password={password} />
          {errors.password && (
            <p className="text-xs font-medium text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-slate-700 leading-none"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            id="confirmPassword"
            type="password"
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-50/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-rose-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            {...register("terms")}
            className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600"
          />
          <label htmlFor="terms" className="text-xs text-muted-foreground">
            I agree to the{" "}
            <Link href="/terms" className="text-rose-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-rose-600 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs font-medium text-rose-500">
            {errors.terms.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.auth.login}
          className="font-medium text-rose-600 hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
