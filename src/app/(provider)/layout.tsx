"use client";

import AuthGuard from "@/components/features/auth/AuthGuard";
import ProviderSidebar from "@/components/layout/ProviderSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["provider"]}>
      <div className="flex min-h-screen bg-slate-50/50">
        <ProviderSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-10 pb-28 lg:pb-10 overflow-x-hidden">
            {children}
          </main>
        </div>
        <MobileBottomNav />
      </div>
    </AuthGuard>
  );
}
