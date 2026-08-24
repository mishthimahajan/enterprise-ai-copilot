import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-slate-200 p-10">
      {children}
    </div>
  );
}