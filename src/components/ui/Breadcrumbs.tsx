import Link from "next/link";
import React from "react";
import truncate from "lodash/truncate";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  /** Max length for truncation on mobile screens */
  mobileTruncateLength?: number;
}

export default function Breadcrumbs({
  items,
  className,
  separator = <span className="text-secondary">/</span>,
  mobileTruncateLength = 18,
}: BreadcrumbsProps) {
  return (
    <nav className={cn("overflow-x-auto no-scrollbar", className)}>
      <ol className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap min-w-max py-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const displayLabelMobile = truncate(item.label, {
            length: mobileTruncateLength,
          });
          const isHome = item.label.toLowerCase() === "home";

          return (
            <React.Fragment key={index}>
              <li
                className={cn(
                  "transition-colors",
                  isLast ? "text-primary font-bold" : "hover:text-primary",
                  !isHome && "capitalize",
                )}
                title={item.label}
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  >
                    <span className="sm:hidden">{displayLabelMobile}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                ) : (
                  <span className="cursor-default">
                    <span className="sm:hidden">{displayLabelMobile}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                )}
              </li>
              {!isLast && separator}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
