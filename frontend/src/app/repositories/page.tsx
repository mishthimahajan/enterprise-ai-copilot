"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ChatPreview from "@/components/chat/ChatPreview";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login?redirect=/repositories");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="space-y-8 p-8">
          <QuickActions />

          <div className="grid gap-8 lg:grid-cols-2">
            <RecentActivity />

            <ChatPreview />
          </div>
        </main>
      </div>
    </div>
  );
}