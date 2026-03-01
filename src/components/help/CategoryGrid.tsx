"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { HelpCategory } from "@/types/help.types";

interface CategoryCardProps {
  category: HelpCategory;
  href: string;
}

export const CategoryCard = ({ category, href }: CategoryCardProps) => {
  const Icon = (Icons as any)[category.icon] || Icons.HelpCircle;

  return (
    <Link
      href={href}
      className="flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 font-bold text-foreground">{category.title}</h3>
      <p className="text-sm text-muted-foreground">{category.description}</p>
    </Link>
  );
};

export const CategoryGrid = ({
  categories,
  audience,
}: {
  categories: HelpCategory[];
  audience: string;
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          href={`/help/${audience}/${cat.slug}`}
        />
      ))}
    </div>
  );
};
