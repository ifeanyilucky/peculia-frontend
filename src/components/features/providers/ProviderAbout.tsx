import { Provider } from "@/types/provider.types";
import { Briefcase, GraduationCap, Award } from "lucide-react";

interface ProviderAboutProps {
  provider: Provider;
}

export default function ProviderAbout({ provider }: ProviderAboutProps) {
  return (
    <div className="space-y-10 pt-4">
      <section>
        <h3 className="font-peculiar text-3xl font-black text-glam-plum">
          About the Professional
        </h3>
        <p className="mt-4 leading-relaxed text-glam-charcoal/80 whitespace-pre-wrap font-medium">
          {provider.bio ||
            "No bio provided yet. Contact the professional for more details about their services and expertise."}
        </p>
      </section>

      {/* <section className="grid gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-secondary p-6 bg-secondary/50/50">
          <div className="rounded-xl bg-white p-3 text-primary border border-secondary">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-foreground/70 uppercase tracking-wider">
              Experience
            </p>
            <p className="text-lg font-bold text-primary">
              {provider.yearsOfExperience || "0-2"} Years in Industry
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-secondary p-6 bg-secondary/50/50">
          <div className="rounded-xl bg-white p-3 text-primary border border-secondary">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-foreground/70 uppercase tracking-wider">
              Satisfaction
            </p>
            <p className="text-lg font-bold text-primary">
              {provider.rating.toFixed(1)} Avg. Rating
            </p>
          </div>
        </div>
      </section> */}

      <section>
        <h4 className="font-peculiar text-xl font-black text-glam-plum mb-6 uppercase tracking-widest">
          Core Specialties
        </h4>
        <div className="flex flex-wrap gap-3">
          {provider.specialties.map((spec) => (
            <div
              key={spec}
              className="flex capitalize items-center gap-2 rounded-full bg-white border border-glam-blush px-6 py-2.5 text-sm font-black text-glam-plum shadow-sm"
            >
              <GraduationCap size={16} className="text-glam-gold" />
              {spec.replace("_", " ")}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
