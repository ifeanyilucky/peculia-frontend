"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationsTab() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
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
          <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100">
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
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={cn("w-12 h-6 rounded-full transition-colors relative shrink-0",
                emailNotifs ? "bg-emerald-500" : "bg-slate-200",
              )}
            >
              <span
                className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                  emailNotifs ? "translate-x-6" : "translate-x-0",
                )}
              />
            </button>
          </div>

          {/* SMS Toggle */}
          <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100">
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
              onClick={() => setSmsNotifs(!smsNotifs)}
              className={cn("w-12 h-6 rounded-full transition-colors relative shrink-0",
                smsNotifs ? "bg-emerald-500" : "bg-slate-200",
              )}
            >
              <span
                className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
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
