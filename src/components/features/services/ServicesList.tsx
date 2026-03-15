"use client";

import { Service } from "@/types/provider.types";
import {
  Scissors,
  Clock,
  Banknote,
  MoreVertical,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { providerService } from "@/services/provider.service";
import { sileo } from "sileo";

interface ServicesListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onRefresh: () => void;
}

export default function ServicesList({
  services,
  onEdit,
  onRefresh,
}: ServicesListProps) {
  const handleToggleActive = async (service: Service) => {
    try {
      await providerService.updateService(service.id, {
        isActive: !service.isActive,
      });
      sileo.success({
        title: "Status Updated",
        description: `Service is now ${!service.isActive ? "active" : "inactive"}.`,
      });
      onRefresh();
    } catch {
      sileo.error({
        title: "Error",
        description: "Failed to update service status.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await providerService.deleteService(id);
      sileo.success({
        title: "Service Deleted",
        description: "The service has been removed.",
      });
      onRefresh();
    } catch {
      sileo.error({ title: "Error", description: "Failed to delete service." });
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {services.map((service) => (
        <div
          key={service.id}
          className={cn(
            "group bg-white rounded-[2rem] border border-slate-100 p-8 hover:border-slate-900 transition-all duration-300 relative overflow-hidden",
            !service.isActive && "opacity-75",
          )}
        >
          {!service.isActive && (
            <div className="absolute top-4 right-4 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1 rounded-full">
              Inactive
            </div>
          )}

          <div className="flex flex-col h-full space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-glam-plum animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {(service.categoryId &&
                    typeof service.categoryId === "object"
                      ? service.categoryId.name
                      : service.category) || "General"}
                  </span>
                </div>
                <h4 className="font-peculiar text-2xl font-black text-slate-900">
                  {service.name}
                </h4>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(service)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-glam-plum hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed">
              {service.description ||
                "No description provided for this service."}
            </p>

            <div className="grid grid-cols-3 gap-2 py-4">
              <div className="p-3 rounded-2xl bg-slate-50 space-y-1">
                <Clock size={14} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {service.duration}m
                </p>
              </div>
              <div className="col-span-2 p-3 rounded-2xl bg-slate-900 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none">
                  Price
                </p>
                <p className="text-sm font-bold text-white leading-none">
                  ₦{(service.price / 100).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Banknote size={14} />
                <span>
                  ₦{(service.depositAmount / 100).toLocaleString()} Deposit
                </span>
              </div>

              <button
                onClick={() => handleToggleActive(service)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  service.isActive
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white",
                )}
              >
                {service.isActive ? (
                  <ToggleRight size={18} />
                ) : (
                  <ToggleLeft size={18} />
                )}
                {service.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
