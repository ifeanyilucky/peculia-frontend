"use client";

import { useState } from "react";

import AuthGuard from "@/components/features/auth/AuthGuard";
import ClientSidebar from "@/components/layout/ClientSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MobileSidebar from "@/components/layout/MobileSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={["client"]}>
      <div className="flex min-h-screen bg-slate-50/50">
        <ClientSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

          <MobileSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1 p-6 lg:p-10 pb-32 lg:pb-10 overflow-y-auto">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
