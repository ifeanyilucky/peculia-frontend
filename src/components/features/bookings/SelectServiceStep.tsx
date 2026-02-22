"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { queryKeys } from "@/constants/queryKeys";
import { useBookingStore } from "@/store/booking.store";
import { Check, Clock, Loader2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectServiceStep() {
  const { selectedProvider, selectedService, setSelectedService, nextStep } =
    useBookingStore();

  const { data: services, isLoading } = useQuery({
    queryKey: queryKeys.providers.services(selectedProvider?._id || ""),
    queryFn: () =>
      providerService.getProviderServices(selectedProvider?._id || ""),
    enabled: !!selectedProvider?._id,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-rose-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="font-peculiar text-2xl font-bold text-slate-900">
          Choose a Service
        </h2>
        <p className="mt-2 text-slate-500">
          Select the professional service you want to book.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {services?.map((service) => {
          const isSelected = selectedService?.id === service.id;

          return (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={cn(
                "group relative flex flex-col justify-between rounded-3xl border-2 p-6 text-left transition-all",
                isSelected
                  ? "border-rose-600 bg-rose-50/50 ring-4 ring-rose-50"
                  : "border-slate-100 bg-white hover:border-rose-200",
              )}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 rounded-full bg-rose-600 p-1 text-white">
                  <Check size={16} strokeWidth={3} />
                </div>
              )}

              <div className="space-y-1">
                <h3
                  className={cn(
                    "font-peculiar text-lg font-bold transition-colors",
                    isSelected
                      ? "text-rose-600"
                      : "text-slate-900 group-hover:text-rose-600",
                  )}
                >
                  {service.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Clock size={14} />
                    <span>{service.duration} mins</span>
                  </div>
                  {service.depositAmount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                      <Tag size={14} />
                      <span>
                        ₦{(service.depositAmount / 100).toLocaleString()}{" "}
                        Deposit
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xl font-black text-slate-900">
                  ₦{(service.price / 100).toLocaleString()}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={nextStep}
          disabled={!selectedService}
          className="rounded-full bg-slate-900 px-12 py-4 text-base font-bold text-white transition-all hover:bg-rose-600 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Continue to Schedule
        </button>
      </div>
    </div>
  );
}
