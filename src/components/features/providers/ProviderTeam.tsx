import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { TeamMember } from "@/types/provider.types";

interface ProviderTeamProps {
  team: TeamMember[];
}

export default function ProviderTeam({ team }: ProviderTeamProps) {
  if (!team || team.length === 0) return null;

  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-peculiar text-3xl font-black text-glam-plum tracking-tight">
          Team
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
        {team.map((member) => (
          <div
            key={member._id}
            className="group flex flex-col items-center text-center space-y-4"
          >
            {/* Avatar Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white shadow-lg ring-1 ring-glam-blush transition-transform duration-500 group-hover:scale-105">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={`${member.firstName} ${member.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-glam-blush/30 flex items-center justify-center text-glam-plum/40 text-2xl font-black">
                    {member.firstName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Rating Badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-md border border-glam-blush ring-4 ring-white">
                <Star size={10} className="fill-glam-gold text-glam-gold" />
                <span className="text-[10px] sm:text-xs font-black text-glam-plum leading-none">
                  {member.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h4 className="font-bold text-glam-plum text-sm sm:text-base tracking-tight group-hover:text-glam-plum transition-colors">
                {member.firstName}
              </h4>
              {member.position && (
                <p className="text-[10px] sm:text-xs font-black text-glam-charcoal/40 uppercase tracking-widest leading-none">
                  {member.position}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
