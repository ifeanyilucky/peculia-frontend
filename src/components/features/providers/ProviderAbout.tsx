import { Provider } from "@/types/provider.types";
import { Briefcase, GraduationCap, Award } from "lucide-react";

interface ProviderAboutProps {
  provider: Provider;
}

export default function ProviderAbout({ provider }: ProviderAboutProps) {
  return (
    <div className="space-y-10">
      <section>
        <h3 className="font-peculiar text-2xl font-bold text-glam-plum">
          About the Professional
        </h3>
        <p className="mt-4 leading-relaxed text-glam-charcoal whitespace-pre-wrap">
          {provider.bio ||
            "No bio provided yet. Contact the professional for more details about their services and expertise."}
        </p>
      </section>

      {/* <section className="grid gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-glam-blush p-6 bg-slate-50/50">
          <div className="rounded-xl bg-white p-3 text-glam-plum border border-glam-blush">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Experience
            </p>
            <p className="text-lg font-bold text-glam-plum">
              {provider.yearsOfExperience || "0-2"} Years in Industry
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-glam-blush p-6 bg-slate-50/50">
          <div className="rounded-xl bg-white p-3 text-glam-plum border border-glam-blush">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Satisfaction
            </p>
            <p className="text-lg font-bold text-glam-plum">
              {provider.rating.toFixed(1)} Avg. Rating
            </p>
          </div>
        </div>
      </section> */}

      <section>
        <h4 className="font-peculiar text-lg font-bold text-glam-plum mb-4">
          Core Specialties
        </h4>
        <div className="flex flex-wrap gap-2">
          {provider.specialties.map((spec) => (
            <div
              key={spec}
              className="flex capitalize items-center gap-2 rounded-full bg-white border border-glam-blush px-4 py-2 text-sm font-medium text-glam-charcoal"
            >
              <GraduationCap size={16} className="text-glam-plum" />
              {spec.replace("_", " ")}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
