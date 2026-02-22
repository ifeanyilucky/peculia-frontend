import { Service } from "@/types/provider.types";
import { Clock, Tag } from "lucide-react";

interface ProviderServicesProps {
  services: Service[];
}

export default function ProviderServices({ services }: ProviderServicesProps) {
  if (services.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200">
        <p className="text-slate-500">No services listed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-outfit text-2xl font-bold text-slate-900">
          Services
        </h3>
        <span className="text-sm font-bold text-rose-600">
          {services.length} Total Services
        </span>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="group flex flex-col justify-between gap-4 rounded-3xl border border-slate-100 p-6 bg-white transition-all hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <h4 className="font-outfit text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                {service.name}
              </h4>
              <p className="text-sm text-slate-500 max-w-md line-clamp-2">
                {service.description || "No description provided."}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Clock size={14} className="text-slate-400" />
                  <span>{service.duration} mins</span>
                </div>
                {service.depositAmount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                    <Tag size={14} />
                    <span>
                      ₦{(service.depositAmount / 100).toLocaleString()} Deposit
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:gap-2">
              <div className="text-right">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                  Starting Price
                </span>
                <p className="text-2xl font-black text-slate-900">
                  ₦{(service.price / 100).toLocaleString()}
                </p>
              </div>
              <button className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose-600">
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
