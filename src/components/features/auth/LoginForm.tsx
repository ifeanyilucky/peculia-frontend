"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { sileo } from "sileo";
import { GoogleLogin } from "@react-oauth/google";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleAuthSuccess = (
    user: any,
    accessToken: string,
    refreshToken: string,
  ) => {
    setAuth(user, accessToken, refreshToken);

    sileo.success({
      title: "Welcome back!",
      description: `Logged in as ${user.firstName}`,
    });

    if (redirect) {
      window.location.href = decodeURIComponent(redirect);
      return;
    }

    if (user.role === "provider") {
      window.location.href = ROUTES.partnersPortal;
      return;
    }

    const redirectMap = {
      client: ROUTES.client.dashboard,
      admin: ROUTES.admin.dashboard,
    };

    router.push(redirectMap[user.role as keyof typeof redirectMap]);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { user, accessToken, refreshToken } = await authService.login(data);
      handleAuthSuccess(user, accessToken, refreshToken);
    } catch (error: unknown) {
      console.error(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSuccess = async (response: any) => {
    setIsLoading(true);
    try {
      const { user, accessToken, refreshToken } = await authService.googleLogin(
        {
          idToken: response.credential,
        },
      );
      handleAuthSuccess(user, accessToken, refreshToken);
    } catch (error: unknown) {
      console.error(error as Error);
      sileo.error({
        title: "Login Failed",
        description: "An error occurred during Google login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-peculiar text-3xl font-bold text-primary">
          Login
        </h2>
        <p className="text-sm text-slate-500">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={() => {
            sileo.error({
              title: "Login Failed",
              description: "Google login was unsuccessful.",
            });
          }}
          useOneTap
          theme="outline"
          shape="circle"
          size="large"
          text="continue_with"
        />
        <div className="relative w-full py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">
              Or continue with email
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            placeholder="e.g. name@example.com"
            className="flex h-12 w-full rounded-xl border border-secondary bg-white px-4 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-rose-50/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-xs font-medium text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              className="text-sm font-semibold text-slate-700 leading-none"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              href={ROUTES.auth.forgotPassword}
              className="text-xs font-bold text-primary hover:text-rose-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              className="flex h-12 w-full rounded-xl border border-secondary bg-white px-4 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-rose-50/50 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex justify-center pt-2">
        <div className="text-sm text-center">
          <span className="text-muted-foreground">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href={ROUTES.auth.registerClient}
            className="text-primary font-medium hover:underline"
          >
            Please sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
