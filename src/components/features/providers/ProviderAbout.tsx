import { Provider } from "@/types/provider.types";
import { Briefcase, GraduationCap, Award } from "lucide-react";

interface ProviderAboutProps {
  provider: Provider;
}

export default function ProviderAbout({ provider }: ProviderAboutProps) {
  return (
    <div className="space-y-10">
      <section>
        <h3 className="font-outfit text-2xl font-bold text-slate-900">
          About the Professional
        </h3>
        <p className="mt-4 leading-relaxed text-slate-600 whitespace-pre-wrap">
          {provider.bio ||
            "No bio provided yet. Contact the professional for more details about their services and expertise."}
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-3xl border border-slate-100 p-6 bg-slate-50/50">
          <div className="rounded-2xl bg-white p-3 shadow-sm text-rose-500">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Experience
            </p>
            <p className="text-lg font-bold text-slate-900">
              {provider.yearsOfExperience || "0-2"} Years in Industry
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-3xl border border-slate-100 p-6 bg-slate-50/50">
          <div className="rounded-2xl bg-white p-3 shadow-sm text-rose-500">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Satisfaction
            </p>
            <p className="text-lg font-bold text-slate-900">
              {provider.rating.toFixed(1)} Avg. Rating
            </p>
          </div>
        </div>
      </section>

      <section>
        <h4 className="font-outfit text-lg font-bold text-slate-900 mb-4">
          Core Specialties
        </h4>
        <div className="flex flex-wrap gap-2">
          {provider.specialties.map((spec) => (
            <div
              key={spec}
              className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
              <GraduationCap size={16} className="text-rose-500" />
              {spec.replace("_", " ")}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
