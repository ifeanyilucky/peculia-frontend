"use client";

import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/provider.service";
import { TeamMember } from "@/types/provider.types";
import { useBookingStore } from "@/store/booking.store";
import { Check, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BookingProfessionalSelectionProps {
  providerId: string;
}

export default function BookingProfessionalSelection({
  providerId,
}: BookingProfessionalSelectionProps) {
  const { selectedTeamMember, setSelectedTeamMember } = useBookingStore();

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team", providerId],
    queryFn: () => providerService.getProviderTeam(providerId),
  });

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-12 w-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Loading professionals...
        </p>
      </div>
    );
  }

  // If no team members, we might want to skip this step or show only the provider
  // For now, if no team, we show "Any Professional" (which effectively means the provider)
  const hasTeam = teamMembers && teamMembers.length > 0;

  return (
    <div className="w-full flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="font-peculiar text-4xl font-black text-slate-900 mb-2 tracking-tight">
        Select Professional
      </h1>
      <p className="text-slate-500 font-medium mb-10">
        Choose a specific professional or select "Any professional" for the best
        availability.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Any Professional Option */}
        <div
          onClick={() => setSelectedTeamMember(null)}
          className={cn(
            "group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300",
            selectedTeamMember === null
              ? "border-rose-600 bg-rose-50/10"
              : "border-slate-100 bg-white hover:border-slate-200",
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center transition-colors border border-slate-200",
                selectedTeamMember === null
                  ? "bg-rose-100 text-rose-600"
                  : "bg-slate-50 text-slate-400 group-hover:bg-slate-100",
              )}
            >
              <Users size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-lg">
                Any professional
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Best availability for your selection
              </p>
            </div>
            {selectedTeamMember === null && (
              <div className="h-8 w-8 rounded-full bg-rose-600 text-white flex items-center justify-center animate-in zoom-in duration-300 border border-slate-200">
                <Check size={18} strokeWidth={3} />
              </div>
            )}
          </div>
        </div>

        {/* Specific Team Members */}
        {teamMembers?.map((member) => (
          <div
            key={member._id}
            onClick={() => setSelectedTeamMember(member)}
            className={cn(
              "group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300",
              selectedTeamMember?._id === member._id
                ? "border-rose-600 bg-rose-50/10"
                : "border-slate-100 bg-white hover:border-slate-200",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.firstName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {member.position || "Staff"}
                </p>
                {member.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
                      {member.rating.toFixed(1)} ★
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      ({member.totalReviews})
                    </span>
                  </div>
                )}
              </div>
              {selectedTeamMember?._id === member._id && (
                <div className="h-8 w-8 rounded-full bg-rose-600 text-white flex items-center justify-center animate-in zoom-in duration-300 border border-slate-200">
                  <Check size={18} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
