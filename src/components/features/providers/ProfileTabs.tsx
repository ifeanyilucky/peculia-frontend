"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  sections: { id: string; label: string }[];
}

export default function ProfileTabs({ sections }: ProfileTabsProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);
  const isManualScroll = useRef(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isManualScroll.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    isManualScroll.current = true;
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -160; // Adjusted for sticky header + tabs
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    // Resume auto-detection after animation
    setTimeout(() => {
      isManualScroll.current = false;
    }, 1000);
  };

  return (
    <div className="sticky top-[56px] z-30 w-full bg-white/80 backdrop-blur-md border-b border-glam-blush md:top-[108px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex gap-8 overflow-x-auto no-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "relative py-4 text-sm font-black transition-all whitespace-nowrap",
                activeSection === section.id
                  ? "text-glam-plum"
                  : "text-glam-charcoal/40 hover:text-glam-plum/70"
              )}
            >
              {section.label}
              {activeSection === section.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-glam-plum" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
