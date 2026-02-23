"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Loader2,
  Scissors,
  Clock,
  Banknote,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Service } from "@/types/provider.types";
import { providerService } from "@/services/provider.service";
import { useAuthStore } from "@/store/auth.store";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";

const serviceSchema = z
  .object({
    name: z.string().min(3, "Service name must be at least 3 characters"),
    category: z.string().min(1, "Please select a category"),
    description: z.string().optional(),
    duration: z.number().min(5, "Minimum duration is 5 minutes"),
    price: z.number().min(100, "Minimum price is ₦100"),
    depositAmount: z.number().min(0, "Deposit cannot be negative"),
  })
  .refine((data) => data.depositAmount <= data.price, {
    message: "Deposit cannot exceed total price",
    path: ["depositAmount"],
  });

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Hair Styling",
  "Nail Art",
  "Makeup",
  "Skin Care",
  "Massage",
  "Barbering",
  "Photography",
  "Personal Training",
  "Other",
];

export default function ServiceFormModal({
  isOpen,
  onClose,
  service,
  onSuccess,
}: ServiceFormModalProps) {
  const { user } = useAuthStore();
  const isEditing = !!service;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          category:
            (service.categoryId && typeof service.categoryId === "object"
              ? service.categoryId.name
              : service.category) || "",
          description: service.description,
          duration: service.duration,
          price: service.price / 100, // Convert to major units
          depositAmount: service.depositAmount / 100,
        }
      : {
          duration: 30,
          price: 5000,
          depositAmount: 1000,
        },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const payload = {
        ...data,
        price: data.price * 100, // Convert to kobo
        depositAmount: data.depositAmount * 100,
        providerProfileId: user?.id, // Should probably be profile ID not user ID, but assuming same for now
      };

      if (isEditing && service) {
        await providerService.updateService(service.id, payload);
        sileo.success({
          title: "Service Updated",
          description: "Changes saved successfully.",
        });
      } else {
        await providerService.createService(payload);
        sileo.success({
          title: "Service Created",
          description: "New service added to your list.",
        });
      }

      onSuccess();
      onClose();
      reset();
    } catch {
      sileo.error({
        title: "Error",
        description: "Failed to save service. Please check your inputs.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-peculiar text-2xl font-black text-slate-900">
              {isEditing ? "Edit Service" : "Add New Service"}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">
              Service Details & Pricing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white transition-all text-slate-400 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar"
        >
          {/* Service Name */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Scissors size={16} className="text-rose-600" />
              <span>Basic Information</span>
            </div>
            <div className="grid gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                  Service Name
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g. Premium Haircut & Wash"
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
                />
                {errors.name && (
                  <p className="text-[10px] font-bold text-rose-500 pl-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none appearance-none"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-[10px] font-bold text-rose-500 pl-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Clock size={16} className="text-rose-600" />
              <span>Pricing & Time</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                  Price (₦)
                </label>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  placeholder="0.00"
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
                />
                {errors.price && (
                  <p className="text-[10px] font-bold text-rose-500 pl-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                  Duration (Mins)
                </label>
                <input
                  {...register("duration", { valueAsNumber: true })}
                  type="number"
                  placeholder="30"
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
                />
                {errors.duration && (
                  <p className="text-[10px] font-bold text-rose-500 pl-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                Deposit Required (₦)
              </label>
              <input
                {...register("depositAmount", { valueAsNumber: true })}
                type="number"
                placeholder="0.00"
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
              />
              <p className="text-[10px] font-medium text-slate-400 pl-1">
                Clients must pay this amount to secure booking.
              </p>
              {errors.depositAmount && (
                <p className="text-[10px] font-bold text-rose-500 pl-1">
                  {errors.depositAmount.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FileText size={16} className="text-rose-600" />
              <span>Description</span>
            </div>
            <div className="space-y-1.5">
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Describe what's included in this service..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl border border-slate-100 bg-white text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 h-14 rounded-2xl bg-slate-900 text-sm font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Service"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
