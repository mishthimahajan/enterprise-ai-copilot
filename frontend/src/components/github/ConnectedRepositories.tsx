"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ExternalLink,
  Code2,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

import {
  GitHubRepository,
  getSelectedRepository,
} from "@/services/github";


interface ConnectedRepositoriesProps {
  repositories: GitHubRepository[];
  loading: boolean;

  onSelect: (
    repositoryId: string
  ) => void;

  onOpenChat: (
    repositoryId: string
  ) => void;

  onReindex: (
    repositoryId: string
  ) => void;

  reindexingId: string | null;
}


export default function ConnectedRepositories({
  repositories,
  loading,
  onSelect,
  onOpenChat,
  onReindex,
  reindexingId,
}: ConnectedRepositoriesProps) {

  const [
    selectedId,
    setSelectedId,
  ] = useState("");


  // =========================================================
  // LOAD SELECTED REPOSITORY
  // =========================================================

  useEffect(() => {

    const saved =
      getSelectedRepository();


    if (
      saved &&
      repositories.some(
        (repository) =>
          repository.repository_id ===
          saved
      )
    ) {

      setSelectedId(
        saved
      );

    } else {

      setSelectedId("");

    }

  }, [
    repositories,
  ]);


  // =========================================================
  // SELECT REPOSITORY
  // =========================================================

  function handleSelect(
    repositoryId: string
  ) {

    setSelectedId(
      repositoryId
    );


    onSelect(
      repositoryId
    );
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">
        Loading repositories...
      </div>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">


      {/* HEADER */}

      <div className="border-b border-slate-200 p-6">

        <h2 className="text-xl font-semibold text-slate-900">
          Connected Repositories
        </h2>


        <p className="mt-1 text-sm text-slate-500">
          Repositories indexed for the selected agent.
        </p>

      </div>


      {/* EMPTY STATE */}

      {repositories.length === 0 ? (

        <div className="p-10 text-center">

          <Code2
            size={40}
            className="mx-auto text-slate-300"
          />


          <p className="mt-4 font-medium text-slate-700">
            No repositories connected
          </p>


          <p className="mt-2 text-sm text-slate-500">
            Connect a GitHub repository using the form above.
          </p>

        </div>

      ) : (

        <div>

          {repositories.map(
            (repository) => {

              const isSelected =
                selectedId ===
                repository.repository_id;


              const isReindexing =
                reindexingId ===
                repository.repository_id;


              return (

                <div
                  key={
                    repository.repository_id
                  }
                  className={`border-b p-5 last:border-b-0 ${
                    isSelected
                      ? "bg-blue-50"
                      : "bg-white"
                  }`}
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                    {/* ========================================= */}
                    {/* REPOSITORY INFORMATION */}
                    {/* ========================================= */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <Code2
                          size={20}
                          className="text-slate-600"
                        />


                        <h3 className="truncate font-semibold text-slate-900">

                          {getRepositoryName(
                            repository.repo_url
                          )}

                        </h3>


                        <RepositoryBadge
                          status={
                            isReindexing
                              ? "Processing"
                              : repository.status
                          }
                        />


                        {isSelected && (

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            Selected
                          </span>

                        )}


                        {isReindexing && (

                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">

                            <RefreshCw
                              size={12}
                              className="animate-spin"
                            />

                            Re-indexing

                          </span>

                        )}

                      </div>


                      {/* REPOSITORY URL */}

                      <p className="mt-2 break-all text-sm text-slate-500">

                        {repository.repo_url}

                      </p>


                      {/* REPOSITORY STATS */}

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

                        <span>
                          Branch:{" "}

                          <strong>
                            {repository.branch}
                          </strong>
                        </span>


                        <span>
                          Files:{" "}

                          <strong>
                            {repository.files_indexed}
                          </strong>
                        </span>


                        <span>
                          Chunks:{" "}

                          <strong>
                            {repository.chunks}
                          </strong>
                        </span>

                      </div>

                    </div>


                    {/* ========================================= */}
                    {/* ACTION BUTTONS */}
                    {/* ========================================= */}

                    <div className="flex flex-wrap gap-2">


                      {/* OPEN GITHUB */}

                      <a
                        href={
                          repository.repo_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >

                        GitHub

                        <ExternalLink
                          size={15}
                        />

                      </a>


                      {/* SELECT REPOSITORY */}

                      <button
                        type="button"

                        onClick={() =>
                          handleSelect(
                            repository.repository_id
                          )
                        }

                        disabled={
                          repository.status !== "Indexed" ||
                          isReindexing
                        }

                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                          isSelected
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >

                        {isSelected
                          ? "Selected Repository"
                          : "Select Repository"}

                      </button>


                      {/* OPEN CHAT */}

                      <button
                        type="button"

                        onClick={() =>
                          onOpenChat(
                            repository.repository_id
                          )
                        }

                        disabled={
                          repository.status !== "Indexed" ||
                          isReindexing
                        }

                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <MessageSquare
                          size={16}
                        />

                        Chat

                      </button>


                      {/* RE-INDEX */}

                      <button
                        type="button"

                        onClick={() =>
                          onReindex(
                            repository.repository_id
                          )
                        }

                        disabled={
                          isReindexing
                        }

                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <RefreshCw
                          size={16}
                          className={
                            isReindexing
                              ? "animate-spin"
                              : ""
                          }
                        />


                        {isReindexing
                          ? "Re-indexing..."
                          : "Re-index"}

                      </button>

                    </div>

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
}


// =========================================================
// GET REPOSITORY NAME
// =========================================================

function getRepositoryName(
  repoUrl: string
) {

  try {

    const clean =
      repoUrl
        .replace(
          /\.git$/,
          ""
        )
        .replace(
          /\/$/,
          ""
        );


    return (
      clean.split("/").pop()
      || "Repository"
    );

  } catch {

    return "Repository";

  }
}


// =========================================================
// REPOSITORY STATUS BADGE
// =========================================================

function RepositoryBadge({
  status,
}: {
  status: string;
}) {

  if (
    status === "Indexed"
  ) {

    return (

      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        Indexed
      </span>

    );
  }


  if (
    status === "Failed"
  ) {

    return (

      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        Failed
      </span>

    );
  }


  return (

    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
      Processing
    </span>

  );
}