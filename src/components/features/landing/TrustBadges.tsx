import { ShieldCheck, Zap, Lock, Star } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    { icon: <ShieldCheck size={20} />, label: "Verified Professionals" },
    { icon: <Zap size={20} />, label: "No-Show Protection" },
    { icon: <Lock size={20} />, label: "Secure Payments" },
    { icon: <Star size={20} />, label: "Real Reviews" },
  ];

  return (
    <div className="border-y border-glam-blush bg-glam-ivory py-12 px-6 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-glam-charcoal/70 transition-colors hover:text-glam-plum"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-glam-blush/30 text-glam-plum">
                {badge.icon}
              </div>
              <span className="font-peculiar font-semibold">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
