"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { useAuthStore } from "@/store/auth.store";
import ServicesList from "@/components/features/services/ServicesList";
import ServiceFormModal from "@/components/features/services/ServiceFormModal";
import { Plus, Search, Scissors, Loader2, Inbox, Sparkles } from "lucide-react";
import { Service } from "@/types/provider.types";

export default function ProviderServicesPage() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const {
    data: services,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["services", "provider", user?.id],
    queryFn: () => providerService.getProviderServices(user?.id || ""),
    enabled: !!user?.id,
  });

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="font-outfit text-4xl font-black text-slate-900 tracking-tight">
            My Services
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Manage your service menu, pricing, and durations.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all shadow-xl shadow-slate-200"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative flex-1 lg:max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Filter services..."
              className="w-full h-12 bg-white border border-slate-100 rounded-2xl pl-11 pr-4 text-sm font-bold focus:border-slate-900 focus:ring-4 focus:ring-slate-50 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-rose-50 rounded-2xl border border-rose-100">
            <Sparkles className="text-rose-600" size={16} />
            <span className="text-xs font-black uppercase tracking-widest text-rose-600">
              {services?.length || 0} Total Services
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-rose-600" size={32} />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">
              Loading your menu...
            </p>
          </div>
        ) : services?.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
              <Scissors size={40} />
            </div>
            <h3 className="font-outfit text-xl font-bold text-slate-900">
              No services yet
            </h3>
            <p className="text-slate-400 font-medium max-w-xs mt-2">
              Start by adding your first service to your menu so clients can
              book you.
            </p>
            <button
              onClick={handleAdd}
              className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 underline underline-offset-8"
            >
              Add your first service
            </button>
          </div>
        ) : (
          <ServicesList
            services={services || []}
            onEdit={handleEdit}
            onRefresh={refetch}
          />
        )}
      </div>

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        onSuccess={refetch}
      />
    </div>
  );
}
