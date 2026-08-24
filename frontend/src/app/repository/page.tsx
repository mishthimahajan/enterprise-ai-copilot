import RepositoryHeader from "@/components/repository/RepositoryHeader";
import RepositoryOverview from "@/components/repository/RepositoryOverview";
import FileExplorer from "@/components/repository/FileExplorer";
import RepositoryInsights from "@/components/repository/RepositoryInsights";

export default function RepositoryPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-7xl space-y-8">

        <RepositoryHeader />

        <RepositoryOverview />

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <FileExplorer />
          </div>

          <RepositoryInsights />

        </div>

      </div>

    </div>
  );
}