import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import RepositoryCard from "@/components/dashboard/RepositoryCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ChatPreview from "@/components/chat/ChatPreview";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-8 space-y-8">

          {/* <RepositoryCard /> */}

          <QuickActions />

          <div className="grid lg:grid-cols-2 gap-8">

            <RecentActivity />

            <ChatPreview />

          </div>

        </main>

      </div>

    </div>
  );
}