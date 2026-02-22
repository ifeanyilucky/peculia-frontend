"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { SPECIALTIES } from "@/constants/specialties";
import { sileo } from "sileo";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { cn } from "@/lib/utils";

const step1Schema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    role: z.literal("provider"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const step2Schema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  yearsOfExperience: z.string().min(1, "Required"),
  bio: z.string().max(500, "Bio is too long").optional(),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type ProviderFormValues = Step1Values & Step2Values;

export default function RegisterProviderForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<ProviderFormValues>>({});

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    watch: watch1,
    formState: { errors: errors1 },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      ...formData,
      role: "provider",
    } as Partial<Step1Values>,
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue: setValue2,
    watch: watch2,
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData as any,
  });

  const password = watch1("password");
  const selectedSpecialties = watch2("specialties") || [];

  const onNext = (data: Step1Values) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onBack = () => {
    setStep(1);
  };

  const onSubmit = async (data: Step2Values) => {
    setIsLoading(true);
    const finalData = { ...formData, ...data };
    try {
      await authService.registerProvider(finalData);
      setIsSuccess(true);
      sileo.success({
        title: "Application sent!",
        description:
          "Please check your email to verify your professional account.",
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
        <h2 className="font-peculiar text-2xl font-bold">
          Registration Successful
        </h2>
        <p className="text-muted-foreground">
          Your professional application has been received. Please verify your
          email to get started.
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
        <h2 className="font-peculiar text-3xl font-bold text-rose-600">
          Become a Professional
        </h2>
        <div className="flex justify-center gap-2 py-4">
          <div
            className={cn(
              "h-1.5 w-12 rounded-full",
              step >= 1 ? "bg-rose-600" : "bg-slate-200",
            )}
          />
          <div
            className={cn(
              "h-1.5 w-12 rounded-full",
              step >= 2 ? "bg-rose-600" : "bg-slate-200",
            )}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {step === 1
            ? "Step 1: Personal Information"
            : "Step 2: Business Profile"}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit1(onNext)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <input
                {...register1("firstName")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {errors1.firstName && (
                <p className="text-xs text-rose-500">
                  {errors1.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <input
                {...register1("lastName")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {errors1.lastName && (
                <p className="text-xs text-rose-500">
                  {errors1.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              {...register1("email")}
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors1.email && (
              <p className="text-xs text-rose-500">{errors1.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input
              {...register1("phone")}
              type="tel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors1.phone && (
              <p className="text-xs text-rose-500">{errors1.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              {...register1("password")}
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <PasswordStrengthMeter password={password} />
            {errors1.password && (
              <p className="text-xs text-rose-500">
                {errors1.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              {...register1("confirmPassword")}
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors1.confirmPassword && (
              <p className="text-xs text-rose-500">
                {errors1.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
          >
            Next Step <ChevronRight size={18} className="ml-2" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit2(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name</label>
            <input
              {...register2("businessName")}
              placeholder="Peculia Studios"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors2.businessName && (
              <p className="text-xs text-rose-500">
                {errors2.businessName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Specialties</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => {
                    const current = selectedSpecialties;
                    const next = current.includes(spec.id)
                      ? current.filter((id) => id !== spec.id)
                      : [...current, spec.id];
                    setValue2("specialties", next);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                    selectedSpecialties.includes(spec.id)
                      ? "border-rose-600 bg-rose-600 text-white"
                      : "border-input bg-background hover:border-rose-400",
                  )}
                >
                  {spec.label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register2("specialties")} />
            {errors2.specialties && (
              <p className="text-xs text-rose-500">
                {errors2.specialties.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Years of Experience</label>
            <select
              {...register2("yearsOfExperience")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select experience</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </select>
            {errors2.yearsOfExperience && (
              <p className="text-xs text-rose-500">
                {errors2.yearsOfExperience.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              {...register2("bio")}
              rows={4}
              placeholder="Tell us about yourself and your work..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors2.bio && (
              <p className="text-xs text-rose-500">{errors2.bio.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <ChevronLeft size={18} className="mr-2" /> Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Submitting..." : "Complete Signup"}
            </button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
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
