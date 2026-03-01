"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Audience } from "@/types/help.types";
import Image from "next/image";

interface AudienceCardProps {
  audience: Audience;
  title: string;
  description: string;
  image: string;
  href: string;
}

export const AudienceCard = ({
  audience,
  title,
  description,
  image,
  href,
}: AudienceCardProps) => {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-8">
        <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
        <p className="mb-8 text-muted-foreground">{description}</p>

        <div className="mt-auto flex items-center font-semibold text-primary">
          <span>Get Support</span>
          <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
