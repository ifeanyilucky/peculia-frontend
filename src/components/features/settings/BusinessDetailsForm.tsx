"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Building2,
  MapPin,
  Briefcase,
  FileText,
  Loader2,
  Save,
  Tag,
} from "lucide-react";
import { Provider } from "@/types/provider.types";
import { providerService } from "@/services/provider.service";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";

const businessSchema = z.object({
  businessName: z.string().min(3, "Business name is too short"),
  bio: z.string().max(500, "Bio must be under 500 characters"),
  specialties: z.string().transform((val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ),
  yearsOfExperience: z.coerce.number().min(0),
  location: z.object({
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
  }),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export default function BusinessDetailsForm({
  initialData,
}: {
  initialData?: Provider;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: initialData?.businessName || "",
      bio: initialData?.bio || "",
      specialties: initialData?.specialties?.join(", ") || "",
      yearsOfExperience: initialData?.yearsOfExperience || 0,
      location: {
        address: initialData?.location?.address || "",
        city: initialData?.location?.city || "",
      },
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await providerService.updateProviderProfile(data);
      sileo.success({
        title: "Updated",
        description: "Business details have been saved.",
      });
    } catch {
      sileo.error({
        title: "Update Failed",
        description: "Could not save business details.",
      });
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <div>
          <h3 className="font-outfit text-xl font-bold text-slate-900">
            Business Profile
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">
            Public details for clients
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
          <Building2 size={20} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              Business Name
            </label>
            <div className="relative group">
              <Building2
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors"
                size={18}
              />
              <input
                {...register("businessName")}
                className={cn(
                  "h-14 w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none",
                  errors.businessName && "border-rose-500 bg-rose-50",
                )}
              />
            </div>
            {errors.businessName && (
              <p className="text-[10px] font-bold text-rose-500 pl-1">
                {errors.businessName.message as any}
              </p>
            )}
          </div>

          {/* Years of Experience */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              Years of Experience
            </label>
            <div className="relative group">
              <Briefcase
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors"
                size={18}
              />
              <input
                type="number"
                {...register("yearsOfExperience")}
                className="h-14 w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
            Business Bio
          </label>
          <div className="relative group">
            <FileText
              className="absolute left-6 top-6 text-slate-300 group-focus-within:text-slate-900 transition-colors"
              size={18}
            />
            <textarea
              {...register("bio")}
              rows={4}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-5 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none resize-none"
              placeholder="Tell clients what makes your service unique..."
            />
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
            Specialties (Comma separated)
          </label>
          <div className="relative group">
            <Tag
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors"
              size={18}
            />
            <input
              {...register("specialties")}
              className="h-14 w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
              placeholder="e.g. Barbering, Braiding, Skincare"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              Office Address
            </label>
            <div className="relative group">
              <MapPin
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors"
                size={18}
              />
              <input
                {...register("location.address")}
                className="h-14 w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              City
            </label>
            <input
              {...register("location.city")}
              className="h-14 w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
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
            Save Business Details
          </button>
        </div>
      </form>
    </div>
  );
}
