"use client";

import { useState, useEffect } from "react";
import { clientService } from "@/services/client.service";
import { Bell, Mail, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationsTab() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        console.log("Fetching notification preferences...");
        const prefs = await clientService.getNotificationPreferences();
        console.log("Preferences fetched:", prefs);
        setEmailNotifs(prefs.email ?? true);
        setSmsNotifs(prefs.sms ?? true);
      } catch (error) {
        console.error("Failed to fetch notification preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleToggle = async (type: "email" | "sms", value: boolean) => {
    console.log("handleToggle called:", type, value);
    const previousEmail = emailNotifs;
    const previousSms = smsNotifs;

    if (type === "email") {
      setEmailNotifs(value);
    } else {
      setSmsNotifs(value);
    }

    setIsSaving(true);
    try {
      console.log("Calling API with:", {
        email: type === "email" ? value : emailNotifs,
        sms: type === "sms" ? value : smsNotifs,
      });
      await clientService.updateNotificationPreferences({
        email: type === "email" ? value : emailNotifs,
        sms: type === "sms" ? value : smsNotifs,
      });
      console.log("API call successful");
    } catch (error) {
      console.error("Failed to update notification preferences:", error);
      if (type === "email") {
        setEmailNotifs(previousEmail);
      } else {
        setSmsNotifs(previousSms);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-4xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 lg:p-10 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell size={24} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Notification Preferences
              </h3>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Control how and when you want to be notified.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-4xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Bell size={24} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Notification Preferences
            </h3>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Control how and when you want to be notified.
            </p>
          </div>
        </div>

        <div className="space-y-5 max-w-2xl">
          {/* Email Toggle */}
          <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shrink-0">
                <Mail size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Email Notifications
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Booking confirmations, reminders, and receipts.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("email", !emailNotifs)}
              disabled={isSaving}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative shrink-0",
                emailNotifs ? "bg-emerald-500" : "bg-slate-200",
                isSaving && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                  emailNotifs ? "translate-x-6" : "translate-x-0",
                )}
              />
            </button>
          </div>

          {/* SMS Toggle */}
          <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shrink-0">
                <Smartphone size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  SMS Text Messages
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Get updates and reminders via text message.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("sms", !smsNotifs)}
              disabled={isSaving}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative shrink-0",
                smsNotifs ? "bg-emerald-500" : "bg-slate-200",
                isSaving && "opacity-50 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                  smsNotifs ? "translate-x-6" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
