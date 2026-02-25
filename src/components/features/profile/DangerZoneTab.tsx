"use client";

import { useState } from "react";
import { clientService } from "@/services/client.service";
import { Trash2 } from "lucide-react";
import { sileo } from "sileo";

export function DangerZoneTab() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const onDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      sileo.error({
        title: "Invalid Input",
        description: 'Please type "DELETE" to confirm.',
      });
      return;
    }
    setIsDeleting(true);
    try {
      await clientService.deleteAccount("DELETE");
      // Handle logout/redirect is typically done via store clear and router.push
    } catch {
      sileo.error({
        title: "Action Failed",
        description: "Could not delete your account at this time.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="bg-rose-50/40 rounded-[2rem] border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-4 border-b border-rose-100 pb-8">
          <div className="h-12 w-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <Trash2 size={24} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-xl font-black text-rose-600">Danger Zone</h3>
            <p className="text-sm font-medium text-rose-800/60 mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-8 lg:p-10 border border-rose-100 flex flex-col items-start gap-8 max-w-2xl">
          <div className="space-y-2">
            <p className="text-base font-black text-slate-900">
              Delete Account
            </p>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              This action is non-reversible. All your current bookings will be
              cancelled immediately, and your history will be permanently erased
              from our systems.
            </p>
          </div>

          <div className="w-full space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Type &quot;DELETE&quot; to confirm
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <input
                value={deleteConfirmation}
                onChange={(e) =>
                  setDeleteConfirmation(e.target.value.toUpperCase())
                }
                placeholder="DELETE"
                className="h-14 w-full sm:w-64 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black tracking-[0.2em] focus:bg-white focus:border-rose-300 _0_0_4px_rgba(225,29,72,0.05)] outline-none transition-all text-slate-900"
              />
              <button
                onClick={onDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== "DELETE"}
                className="h-14 px-8 w-full sm:w-auto rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95 /20"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
