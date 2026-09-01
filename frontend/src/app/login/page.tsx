import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4 py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading...
              </p>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}