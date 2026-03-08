import { Suspense } from "react";
import RegisterClientForm from "@/components/features/auth/RegisterClientForm";

function RegisterClientFormFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-200" />
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export default function RegisterClientPage() {
  return (
    <Suspense fallback={<RegisterClientFormFallback />}>
      <RegisterClientForm />
    </Suspense>
  );
}
