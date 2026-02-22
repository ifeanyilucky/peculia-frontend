"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { sileo } from "sileo";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email address...");

  const verify = useCallback(async () => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    try {
      await authService.verifyEmail(token);
      setStatus("success");
      setMessage(
        "Your email has been successfully verified! You can now log in.",
      );
      sileo.success({
        title: "Email Verified",
        description: "You can now log in to your account.",
      });
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error?.response?.data?.message ||
          "Verification failed. The link may be invalid or expired.",
      );
    }
  }, [token]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      )}

      {status === "success" && (
        <>
          <div className="rounded-full bg-green-100 p-3 text-green-600">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="font-outfit text-2xl font-bold">
              Verification Successful!
            </h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <button
            onClick={() => router.push(ROUTES.auth.login)}
            className="w-full rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Go to Login
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <XCircle size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="font-outfit text-2xl font-bold font-red-600">
              Verification Failed
            </h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <button
            onClick={() => router.push(ROUTES.auth.forgotPassword)}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Resend Verification Link
          </button>
          <button
            onClick={() => router.push(ROUTES.auth.login)}
            className="text-sm font-medium text-rose-600 hover:underline"
          >
            Back to Login
          </button>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader2 className="animate-spin text-rose-600" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
