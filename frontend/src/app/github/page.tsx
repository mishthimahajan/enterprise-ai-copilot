"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";
import { reindexRepository } from "@/services/github";

import GitHubConnectionCard from "@/components/github/GitHubConnectionCard";
import ConnectedRepositories from "@/components/github/ConnectedRepositories";
import RepositoryStatus from "@/components/github/RepositoryStatus";
import RepositoryStats from "@/components/github/RepositoryStats";

import {
  GitHubRepository,
  GitHubRepositoriesResponse,
  getRepositories,
  setSelectedRepository,
} from "@/services/github";


export default function GitHubPage() {
  const router =
    useRouter();


  const [
    agentId,
    setAgentId,
  ] = useState("");


  const [
    repositories,
    setRepositories,
  ] = useState<GitHubRepository[]>([]);


  const [
    stats,
    setStats,
  ] = useState({
    total: 0,
    indexed: 0,
    total_files: 0,
    total_chunks: 0,
  });


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");
  const [reindexingId, setReindexingId] =
  useState<string | null>(null);


  useEffect(() => {
    initializePage();
  }, []);


  // =========================================================
  // INITIALIZE
  // =========================================================

  async function initializePage() {
    try {
      setLoading(true);
      setError("");


      const token =
        localStorage.getItem(
          "access_token"
        );


      if (!token) {
        router.replace(
          "/login"
        );

        return;
      }


      const selectedAgentId =
        localStorage.getItem(
          "selected_agent_id"
        );


      if (!selectedAgentId) {
        setError(
          "Please select an agent before connecting a GitHub repository."
        );

        return;
      }


      setAgentId(
        selectedAgentId
      );


      await loadRepositories(
        selectedAgentId
      );


    } catch (err: any) {

      console.error(
        "GITHUB PAGE ERROR:",
        err
      );


      setError(
        err.message ||
          "Failed to initialize GitHub Agent."
      );


    } finally {

      setLoading(false);

    }
  }


  // =========================================================
  // LOAD REPOSITORIES
  // =========================================================

  async function loadRepositories(
    selectedAgentId: string
  ) {
    try {

      const data:
        GitHubRepositoriesResponse =
        await getRepositories(
          selectedAgentId
        );


      setRepositories(
        Array.isArray(
          data.repositories
        )
          ? data.repositories
          : []
      );


      setStats({

        total:
          data.total || 0,

        indexed:
          data.indexed || 0,

        total_files:
          data.total_files || 0,

        total_chunks:
          data.total_chunks || 0,

      });


    } catch (err: any) {

      console.error(
        "LOAD REPOSITORIES ERROR:",
        err
      );


      setError(
        err.message ||
          "Failed to load repositories."
      );

    }
  }


  // =========================================================
  // REPOSITORY CONNECTED
  // =========================================================

  async function handleRepositoryConnected() {
    if (!agentId) {
      return;
    }


    setSuccess(
      "Repository connected and indexed successfully."
    );


    await loadRepositories(
      agentId
    );


    setTimeout(() => {
      setSuccess("");
    }, 3000);
  }
  async function handleReindex(
  repositoryId: string
) {
  try {
    setReindexingId(repositoryId);

    await reindexRepository(repositoryId);

    // Reload repository list after successful indexing
    await loadRepositories(agentId);

  } catch (error: any) {
    console.error(
      "REINDEX ERROR:",
      error
    );

    alert(
      error.message ||
        "Failed to re-index repository."
    );

  } finally {
    setReindexingId(null);
  }
}


  // =========================================================
  // SELECT REPOSITORY
  // =========================================================

  function handleSelectRepository(
    repositoryId: string
  ) {

    setSelectedRepository(
      repositoryId
    );


    setSuccess(
      "Repository selected successfully."
    );


    setTimeout(() => {
      setSuccess("");
    }, 2500);
  }


  // =========================================================
  // OPEN REPOSITORY CHAT
  // =========================================================

  function handleOpenChat(
  repositoryId: string
) {
  // Save selected GitHub repository
  localStorage.setItem(
    "selected_repository_id",
    repositoryId
  );

  // Important:
  // repository chat should not accidentally
  // use an old selected document.
  localStorage.removeItem(
    "selected_document_id"
  );

  router.push(
    `/chat?repository_id=${repositoryId}`
  );
}


  // =========================================================
  // NO AGENT
  // =========================================================

  if (
    !loading &&
    !agentId
  ) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

            <h1 className="text-2xl font-bold text-slate-900">
              No Agent Selected
            </h1>


            <p className="mt-3 text-slate-500">
              Select a shared agent first, then connect
              a GitHub repository to that workspace.
            </p>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-7xl space-y-8">


        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              GitHub Agent
            </h1>


            <p className="mt-2 text-slate-500">
              Connect repositories and let the AI understand
              your shared codebase.
            </p>


            {agentId && (
              <p className="mt-2 text-xs text-slate-400">
                Active Agent: {agentId}
              </p>
            )}

          </div>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}


        {/* CONNECT */}

        <GitHubConnectionCard
          agentId={agentId}
          onConnected={
            handleRepositoryConnected
          }
        />


        {/* CURRENT STATUS */}

        <RepositoryStatus
          repositories={
            repositories
          }
          loading={
            loading
          }
        />


        {/* STATS */}

        <RepositoryStats
          total={
            stats.total
          }
          indexed={
            stats.indexed
          }
          files={
            stats.total_files
          }
          chunks={
            stats.total_chunks
          }
        />


        {/* LIST */}

        <ConnectedRepositories
  repositories={
    repositories
  }
  loading={
    loading
  }
  onSelect={
    handleSelectRepository
  }
  onOpenChat={
    handleOpenChat
  }
  onReindex={
    handleReindex
  }
  reindexingId={
    reindexingId
  }
/>

      </div>

    </div>
  );
}