import GitHubConnectionCard from "@/components/github/GitHubConnectionCard";
import ConnectedRepositories from "@/components/github/ConnectedRepositories";
import RepositoryStatus from "@/components/github/RepositoryStatus";
import RepositoryStats from "@/components/github/RepositoryStats";

export default function GitHubPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-7xl space-y-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            GitHub Agent
          </h1>

          <p className="mt-2 text-slate-500">
            Connect your GitHub repository so the AI can understand your codebase.
          </p>

        </div>

        <GitHubConnectionCard />

        <RepositoryStatus />

        <RepositoryStats />

        <ConnectedRepositories />

      </div>

    </div>
  );
}