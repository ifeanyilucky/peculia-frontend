"use client";

import AuthGuard from "@/components/features/auth/AuthGuard";
import ClientSidebar from "@/components/layout/ClientSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["client"]}>
      <div className="flex min-h-screen bg-slate-50/50">
        <ClientSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />

          <main className="flex-1 p-6 lg:p-10 pb-32 lg:pb-10 overflow-y-auto">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>

        <MobileBottomNav />
      </div>
    </AuthGuard>
  );
}
