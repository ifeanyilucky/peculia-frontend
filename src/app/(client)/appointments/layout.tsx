"use client";

import AuthGuard from "@/components/features/auth/AuthGuard";

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["client"]}>
      <div className="min-h-screen bg-slate-50">
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
