"use client";

import { useState } from "react";
import { X, Search, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TreatmentDropdown, LocationDropdown, DateTimeDropdown } from "./ExploreFilterPopups";
import { format } from "date-fns";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTreatment?: string;
  initialLocation?: string;
  initialTime?: string;
  onApply: (data: { treatment: string; location: string; time: string }) => void;
}

export default function MobileSearchModal({
  isOpen,
  onClose,
  initialTreatment = "",
  initialLocation = "",
  initialTime = "Any time",
  onApply,
}: MobileSearchModalProps) {
  const [activeStep, setActiveStep] = useState<"treatment" | "location" | "time">("treatment");
  const [treatment, setTreatment] = useState(initialTreatment);
  const [location, setLocation] = useState(initialLocation);
  const [time, setTime] = useState(initialTime);

  const handleApply = () => {
    onApply({ treatment, location, time });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-glam-blush">
        <button onClick={onClose} className="p-2 -ml-2 hover:bg-glam-blush/50 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-glam-plum" />
        </button>
        <h2 className="text-lg font-black text-glam-plum">Search</h2>
      </div>

      {/* Steps Progress */}
      <div className="flex px-6 py-4 gap-2">
        {(["treatment", "location", "time"] as const).map((step) => {
           const isActive = activeStep === step;
           const isDone = (step === "treatment" && treatment) || (step === "location" && location) || (step === "time" && time !== "Any time");
           return (
             <button
               key={step}
               onClick={() => setActiveStep(step)}
               className={cn(
                 "flex-1 py-1 rounded-full transition-all",
                 isActive ? "bg-glam-plum h-1.5" : isDone ? "bg-glam-blush h-1.5" : "bg-glam-blush h-1"
               )}
             />
           );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {activeStep === "treatment" && (
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-glam-plum">What are you looking for?</h3>
              <p className="text-sm text-glam-blush/500 font-medium">Search for treatments, services or professionals</p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search treatments..."
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-glam-blush/50 rounded-2xl border-none font-bold text-glam-plum placeholder:text-muted-foreground focus:ring-2 focus:ring-glam-plum transition-all"
                autoFocus
              />
            </div>
            <TreatmentDropdown 
              searchQuery={treatment} 
              onSelect={(id) => {
                setTreatment(id);
                setActiveStep("location");
              }} 
            />
          </div>
        )}

        {activeStep === "location" && (
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-glam-plum">Where?</h3>
              <p className="text-sm text-glam-blush/500 font-medium">Find services near you</p>
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-glam-blush/50 rounded-2xl border-none font-bold text-glam-plum placeholder:text-muted-foreground focus:ring-2 focus:ring-glam-plum transition-all"
                autoFocus
              />
            </div>
            <LocationDropdown 
              searchQuery={location} 
              onSelect={(city) => {
                setLocation(city);
                setActiveStep("time");
              }} 
            />
          </div>
        )}

        {activeStep === "time" && (
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-glam-plum">When?</h3>
              <p className="text-sm text-glam-blush/500 font-medium">Select your preferred date and time</p>
            </div>
            <DateTimeDropdown
              onSelect={(date, t) => {
                setTime(`${format(date, "MMM d")}, ${t}`);
              }}
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-glam-blush flex items-center justify-between">
        <button 
          onClick={onClose}
          className="text-sm font-black text-glam-plum underline"
        >
          Skip
        </button>
        <button
          onClick={handleApply}
          className="px-10 py-4 bg-glam-plum text-white rounded-full font-black text-sm active:scale-95 transition-all shadow-lg shadow-glam-plum/10"
        >
          Show results
        </button>
      </div>
    </div>
  );
}
