"use client";

import { useRouter } from "next/navigation";
import { useSpecialties } from "@/hooks/useSpecialties";
import { Loader2 } from "lucide-react";

export default function SpecialtiesSection() {
  const router = useRouter();
  const { data: specialties = [], isLoading } = useSpecialties();

  const handleSpecialtyClick = (specialtyId: string) => {
    router.push(`/explore?specialty=${specialtyId}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="text-center">
          <Loader2 size={24} className="animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading specialties...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16  lg:px-8 mx-auto max-w-7xl">
      <div className="text-center mb-12 px-6">
        <h2 className="font-peculiar text-3xl font-bold text-primary mb-4">
          Find Professionals by Specialty
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our wide range of beauty and wellness services to find the perfect professional for your needs.
        </p>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {specialties.map((specialty) => (
          <button
            key={specialty.id}
            onClick={() => handleSpecialtyClick(specialty.id)}
            className="group flex flex-col items-center p-6 rounded-2xl border border-secondary bg-white hover:bg-secondary/50 transition-colors text-center flex-shrink-0 w-40"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <span className="text-2xl">✨</span> {/* Placeholder icon */}
            </div>
            <p className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">
              {specialty.label}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
