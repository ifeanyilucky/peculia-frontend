"use client";

import { useState, useEffect } from "react";
import {
  X,
  Search,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TreatmentDropdown,
  LocationDropdown,
  DateTimeDropdown,
} from "./ExploreFilterPopups";
import { format } from "date-fns";

type Step = "treatment" | "location" | "time";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTreatment?: string;
  initialLocation?: string;
  initialTime?: string;
  onApply: (data: {
    treatment: string;
    location: string;
    time: string;
  }) => void;
}

const STEPS: Step[] = ["treatment", "location", "time"];

const STEP_META: Record<
  Step,
  { title: string; subtitle: string; icon: React.ElementType }
> = {
  treatment: {
    title: "What are you looking for?",
    subtitle: "Search treatments, services or professionals",
    icon: Search,
  },
  location: {
    title: "Where?",
    subtitle: "Find services near you",
    icon: MapPin,
  },
  time: {
    title: "When?",
    subtitle: "Pick your preferred date and time",
    icon: Calendar,
  },
};

/**
 * Full-screen mobile search modal.
 * Slides up from the bottom and walks the user through three filter steps.
 */
export default function MobileSearchModal({
  isOpen,
  onClose,
  initialTreatment = "",
  initialLocation = "",
  initialTime = "Any time",
  onApply,
}: MobileSearchModalProps) {
  const [activeStep, setActiveStep] = useState<Step>("treatment");
  const [treatment, setTreatment] = useState(initialTreatment);
  const [location, setLocation] = useState(initialLocation);
  const [time, setTime] = useState(initialTime);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep("treatment");
      setTreatment(initialTreatment);
      setLocation(initialLocation);
      setTime(initialTime);
    }
  }, [isOpen, initialTreatment, initialLocation, initialTime]);

  const handleApply = () => {
    onApply({ treatment, location, time });
    onClose();
  };

  const stepIndex = STEPS.indexOf(activeStep);

  const isDone = (step: Step) => {
    if (step === "treatment") return Boolean(treatment);
    if (step === "location") return Boolean(location);
    return time !== "Any time";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-modal"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="fixed inset-0 z-100 bg-white flex flex-col"
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-secondary">
            <button
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={20} className="text-primary" />
            </button>
            <h2 className="text-base font-black text-primary flex-1">Search</h2>
            <button
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* ── Step tabs ──────────────────────────────────────────────────── */}
          <div className="flex gap-1.5 px-5 pt-4 pb-2">
            {STEPS.map((step, i) => {
              const isActive = activeStep === step;
              const done = isDone(step);
              const Meta = STEP_META[step];
              return (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={cn(
                    "relative flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-2xl transition-all text-left border",
                    isActive
                      ? "bg-primary text-white border-primary"
                      : done
                        ? "bg-secondary/60 border-secondary text-primary"
                        : "border-secondary text-muted-foreground",
                  )}
                >
                  {done && !isActive ? (
                    <CheckCircle2 size={13} className="text-primary shrink-0" />
                  ) : (
                    <Meta.icon size={13} className="shrink-0" />
                  )}
                  <span className="text-[11px] font-black capitalize hidden sm:block">
                    {step === "treatment"
                      ? "Treatment"
                      : step === "location"
                        ? "Location"
                        : "Time"}
                  </span>
                  {/* Active indicator dot for very small screens */}
                  {isActive && (
                    <span className="sm:hidden text-[9px] font-black capitalize">
                      {step}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Content area ───────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-5 pb-28">
            <AnimatePresence mode="wait">
              {activeStep === "treatment" && (
                <motion.div
                  key="step-treatment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="py-5 space-y-4"
                >
                  <div>
                    <h3 className="text-2xl font-black text-primary">
                      {STEP_META.treatment.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {STEP_META.treatment.subtitle}
                    </p>
                  </div>
                  {/* Search input */}
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search treatments..."
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-secondary/40 rounded-2xl border-none font-bold text-primary placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      autoFocus
                    />
                    {treatment && (
                      <button
                        onClick={() => setTreatment("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-muted hover:bg-secondary transition-colors"
                      >
                        <X size={12} className="text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <TreatmentDropdown
                    searchQuery={treatment}
                    onSelect={(id) => {
                      setTreatment(id);
                      setActiveStep("location");
                    }}
                  />
                </motion.div>
              )}

              {activeStep === "location" && (
                <motion.div
                  key="step-location"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="py-5 space-y-4"
                >
                  <div>
                    <h3 className="text-2xl font-black text-primary">
                      {STEP_META.location.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {STEP_META.location.subtitle}
                    </p>
                  </div>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search location..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-secondary/40 rounded-2xl border-none font-bold text-primary placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      autoFocus
                    />
                    {location && (
                      <button
                        onClick={() => setLocation("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-muted hover:bg-secondary transition-colors"
                      >
                        <X size={12} className="text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <LocationDropdown
                    searchQuery={location}
                    onSelect={(city) => {
                      setLocation(city);
                      setActiveStep("time");
                    }}
                  />
                </motion.div>
              )}

              {activeStep === "time" && (
                <motion.div
                  key="step-time"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="py-5 space-y-4"
                >
                  <div>
                    <h3 className="text-2xl font-black text-primary">
                      {STEP_META.time.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {STEP_META.time.subtitle}
                    </p>
                  </div>
                  <DateTimeDropdown
                    onSelect={(date, t) => {
                      setTime(`${format(date, "MMM d")}, ${t}`);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer actions ─────────────────────────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-secondary flex items-center justify-between gap-4 safe-area-inset-bottom">
            {/* Step summary chips */}
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              {treatment && (
                <span className="text-xs font-bold text-primary bg-secondary/60 px-2.5 py-1 rounded-full truncate max-w-[100px]">
                  {treatment}
                </span>
              )}
              {location && (
                <span className="text-xs font-bold text-primary bg-secondary/60 px-2.5 py-1 rounded-full truncate max-w-[80px]">
                  {location}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Clear */}
              {(treatment || location || time !== "Any time") && (
                <button
                  onClick={() => {
                    setTreatment("");
                    setLocation("");
                    setTime("Any time");
                  }}
                  className="text-sm font-black text-muted-foreground underline underline-offset-2"
                >
                  Clear
                </button>
              )}
              {/* Show results */}
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-black text-sm active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <Search size={15} />
                Show results
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
