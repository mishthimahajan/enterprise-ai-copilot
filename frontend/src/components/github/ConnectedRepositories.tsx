// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   ExternalLink,
//   Code2,
//   MessageSquare,
//   RefreshCw,
//   Trash2,
// } from "lucide-react";

// import {
//   GitHubRepository,
//   getSelectedRepository,
// } from "@/services/github";


// interface ConnectedRepositoriesProps {
//   repositories: GitHubRepository[];
//   loading: boolean;

//   onSelect: (
//     repositoryId: string
//   ) => void;

//   onOpenChat: (
//     repositoryId: string
//   ) => void;

//   onReindex: (
//     repositoryId: string
//   ) => void;

//   reindexingId: string | null;

//   onDelete: (
//     repositoryId: string
//   ) => void;

//   deletingId: string | null;
// }


// export default function ConnectedRepositories({
//   repositories,
//   loading,
//   onSelect,
//   onOpenChat,
//   onReindex,
//   reindexingId,
//   onDelete,
//   deletingId,
// }: ConnectedRepositoriesProps) {

//   const [
//     selectedId,
//     setSelectedId,
//   ] = useState("");


//   // =========================================================
//   // LOAD SELECTED REPOSITORY
//   // =========================================================

//   useEffect(() => {

//     const saved =
//       getSelectedRepository();

//     if (
//       saved &&
//       repositories.some(
//         (repository) =>
//           repository.repository_id === saved
//       )
//     ) {

//       setSelectedId(saved);

//     } else {

//       setSelectedId("");

//     }

//   }, [
//     repositories,
//   ]);


//   // =========================================================
//   // SELECT REPOSITORY
//   // =========================================================

//   function handleSelect(
//     repositoryId: string
//   ) {

//     setSelectedId(
//       repositoryId
//     );

//     onSelect(
//       repositoryId
//     );
//   }


//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (loading) {

//     return (
//       <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">
//         Loading repositories...
//       </div>
//     );
//   }


//   // =========================================================
//   // PAGE
//   // =========================================================

//   return (

//     <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">


//       {/* HEADER */}

//       <div className="border-b border-slate-200 p-6">

//         <h2 className="text-xl font-semibold text-slate-900">
//           Connected Repositories
//         </h2>

//         <p className="mt-1 text-sm text-slate-500">
//           Repositories indexed for the selected agent.
//         </p>

//       </div>


//       {/* EMPTY STATE */}

//       {repositories.length === 0 ? (

//         <div className="p-10 text-center">

//           <Code2
//             size={40}
//             className="mx-auto text-slate-300"
//           />

//           <p className="mt-4 font-medium text-slate-700">
//             No repositories connected
//           </p>

//           <p className="mt-2 text-sm text-slate-500">
//             Connect a GitHub repository using the form above.
//           </p>

//         </div>

//       ) : (

//         <div>

//           {repositories.map(
//             (repository) => {

//               const isSelected =
//                 selectedId ===
//                 repository.repository_id;

//               const isReindexing =
//                 reindexingId ===
//                 repository.repository_id;

//               const isDeleting =
//                 deletingId ===
//                 repository.repository_id;


//               return (

//                 <div
//                   key={
//                     repository.repository_id
//                   }
//                   className={`border-b p-5 last:border-b-0 ${
//                     isSelected
//                       ? "bg-blue-50"
//                       : "bg-white"
//                   }`}
//                 >

//                   <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


//                     {/* ========================================= */}
//                     {/* REPOSITORY INFORMATION */}
//                     {/* ========================================= */}

//                     <div className="min-w-0">

//                       <div className="flex flex-wrap items-center gap-3">

//                         <Code2
//                           size={20}
//                           className="text-slate-600"
//                         />

//                         <h3 className="truncate font-semibold text-slate-900">

//                           {getRepositoryName(
//                             repository.repo_url
//                           )}

//                         </h3>


//                         <RepositoryBadge
//                           status={
//                             isReindexing
//                               ? "Processing"
//                               : repository.status
//                           }
//                         />


//                         {isSelected && (

//                           <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
//                             Selected
//                           </span>

//                         )}


//                         {isReindexing && (

//                           <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">

//                             <RefreshCw
//                               size={12}
//                               className="animate-spin"
//                             />

//                             Re-indexing

//                           </span>

//                         )}


//                         {isDeleting && (

//                           <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">

//                             <Trash2
//                               size={12}
//                             />

//                             Deleting

//                           </span>

//                         )}

//                       </div>


//                       {/* REPOSITORY URL */}

//                       <p className="mt-2 break-all text-sm text-slate-500">

//                         {repository.repo_url}

//                       </p>


//                       {/* REPOSITORY STATS */}

//                       <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

//                         <span>
//                           Branch:{" "}

//                           <strong>
//                             {repository.branch}
//                           </strong>
//                         </span>


//                         <span>
//                           Files:{" "}

//                           <strong>
//                             {repository.files_indexed}
//                           </strong>
//                         </span>


//                         <span>
//                           Chunks:{" "}

//                           <strong>
//                             {repository.chunks}
//                           </strong>
//                         </span>

//                       </div>


//                       {/* LAST SYNCED */}

//                       <div className="mt-3 text-sm text-slate-500">

//                         Last synced:{" "}

//                         <span className="font-medium text-slate-700">

//                           {formatDate(
//                             repository.updated_at
//                           )}

//                         </span>

//                       </div>

//                     </div>


//                     {/* ========================================= */}
//                     {/* ACTION BUTTONS */}
//                     {/* ========================================= */}

//                     <div className="flex flex-wrap gap-2">


//                       {/* OPEN GITHUB */}

//                       <a
//                         href={
//                           repository.repo_url
//                         }
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                       >

//                         GitHub

//                         <ExternalLink
//                           size={15}
//                         />

//                       </a>


//                       {/* SELECT REPOSITORY */}

//                       <button
//                         type="button"

//                         onClick={() =>
//                           handleSelect(
//                             repository.repository_id
//                           )
//                         }

//                         disabled={
//                           repository.status !== "Indexed" ||
//                           isReindexing ||
//                           isDeleting
//                         }

//                         className={`rounded-lg px-4 py-2 text-sm font-medium ${
//                           isSelected
//                             ? "bg-blue-100 text-blue-700"
//                             : "bg-slate-900 text-white hover:bg-slate-800"
//                         } disabled:cursor-not-allowed disabled:opacity-50`}
//                       >

//                         {isSelected
//                           ? "Selected Repository"
//                           : "Select Repository"}

//                       </button>


//                       {/* OPEN CHAT */}

//                       <button
//                         type="button"

//                         onClick={() =>
//                           onOpenChat(
//                             repository.repository_id
//                           )
//                         }

//                         disabled={
//                           repository.status !== "Indexed" ||
//                           isReindexing ||
//                           isDeleting
//                         }

//                         className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//                       >

//                         <MessageSquare
//                           size={16}
//                         />

//                         Chat

//                       </button>


//                       {/* RE-INDEX */}

//                       <button
//                         type="button"

//                         onClick={() =>
//                           onReindex(
//                             repository.repository_id
//                           )
//                         }

//                         disabled={
//                           isReindexing ||
//                           isDeleting
//                         }

//                         className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//                       >

//                         <RefreshCw
//                           size={16}
//                           className={
//                             isReindexing
//                               ? "animate-spin"
//                               : ""
//                           }
//                         />

//                         {isReindexing
//                           ? "Re-indexing..."
//                           : "Re-index"}

//                       </button>


//                       {/* DELETE */}

//                       <button
//                         type="button"

//                         onClick={() =>
//                           onDelete(
//                             repository.repository_id
//                           )
//                         }

//                         disabled={
//                           isDeleting ||
//                           isReindexing
//                         }

//                         className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
//                       >

//                         <Trash2
//                           size={16}
//                         />

//                         {isDeleting
//                           ? "Deleting..."
//                           : "Delete"}

//                       </button>

//                     </div>

//                   </div>

//                 </div>

//               );
//             }
//           )}

//         </div>

//       )}

//     </div>
//   );
// }


// // =========================================================
// // GET REPOSITORY NAME
// // =========================================================

// function getRepositoryName(
//   repoUrl: string
// ) {

//   try {

//     const clean =
//       repoUrl
//         .replace(
//           /\.git$/,
//           ""
//         )
//         .replace(
//           /\/$/,
//           ""
//         );

//     return (
//       clean.split("/").pop() ||
//       "Repository"
//     );

//   } catch {

//     return "Repository";

//   }
// }


// // =========================================================
// // REPOSITORY STATUS BADGE
// // =========================================================

// function RepositoryBadge({
//   status,
// }: {
//   status: string;
// }) {

//   if (
//     status === "Indexed"
//   ) {

//     return (

//       <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
//         Indexed
//       </span>

//     );
//   }


//   if (
//     status === "Failed"
//   ) {

//     return (

//       <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
//         Failed
//       </span>

//     );
//   }


//   return (

//     <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
//       Processing
//     </span>

//   );
// }


// // =========================================================
// // FORMAT LAST SYNCED DATE
// // =========================================================

// function formatDate(
//   dateValue?: string | null
// ) {

//   if (!dateValue) {
//     return "Not available";
//   }

//   const date =
//     new Date(
//       dateValue
//     );

//   if (
//     Number.isNaN(
//       date.getTime()
//     )
//   ) {
//     return "Not available";
//   }

//   return date.toLocaleString();
// }

"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  FileCode2,
  GitBranch,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Trash2,
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

  onDelete: (
    repositoryId: string
  ) => void;

  deletingId: string | null;
}

export default function ConnectedRepositories({
  repositories,
  loading,
  onSelect,
  onOpenChat,
  onReindex,
  reindexingId,
  onDelete,
  deletingId,
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
      <div className="overflow-hidden rounded-3xl border border-white bg-white/90 p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>

          <p className="mt-5 text-sm font-bold text-slate-800">
            Loading repositories
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Fetching repository knowledge for this workspace...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-linear-to-r from-white via-blue-50/30 to-violet-50/30 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 via-violet-100 to-cyan-100">
            <Code2 className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-950">
              Connected Repositories
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Repositories indexed for the selected enterprise agent.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 shadow-sm">
          <GitBranch className="h-3.5 w-3.5 text-blue-600" />

          {repositories.length}{" "}
          {repositories.length === 1
            ? "repository"
            : "repositories"}
        </div>
      </div>

      {/* EMPTY STATE */}
      {repositories.length === 0 ? (
        <div className="relative px-6 py-16 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-160px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-blue-300/10 blur-[100px]" />
          </div>

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 via-violet-100 to-cyan-100">
              <Code2 className="h-7 w-7 text-blue-600" />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-900">
              No repositories connected
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Connect your first GitHub repository above and convert the
              source code into searchable AI knowledge.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-5 md:p-6">
          {repositories.map(
            (
              repository
            ) => {
              const isSelected =
                selectedId ===
                repository.repository_id;

              const isReindexing =
                reindexingId ===
                repository.repository_id;

              const isDeleting =
                deletingId ===
                repository.repository_id;

              return (
                <div
                  key={
                    repository.repository_id
                  }
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 md:p-6 ${
                    isSelected
                      ? "border-blue-300 bg-linear-to-r from-blue-50/90 via-violet-50/50 to-cyan-50/60 shadow-[0_14px_35px_rgba(37,99,235,0.10)]"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_15px_40px_rgba(15,23,42,0.07)]"
                  }`}
                >
                  {/* SELECTED ACCENT */}
                  {isSelected && (
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-linear-to-b from-blue-600 via-violet-600 to-cyan-500" />
                  )}

                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    {/* REPOSITORY INFORMATION */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                            isSelected
                              ? "bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20"
                              : "bg-slate-100 group-hover:bg-blue-50"
                          }`}
                        >
                          <Code2
                            className={`h-5 w-5 ${
                              isSelected
                                ? "text-white"
                                : "text-slate-600 group-hover:text-blue-600"
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* TITLE */}
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="max-w-full truncate text-base font-black tracking-tight text-slate-950">
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
                              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100/70 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                                <CheckCircle2 className="h-3 w-3" />

                                Active
                              </span>
                            )}

                            {isReindexing && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                                <RefreshCw className="h-3 w-3 animate-spin" />

                                Re-indexing
                              </span>
                            )}

                            {isDeleting && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">
                                <Trash2 className="h-3 w-3" />

                                Deleting
                              </span>
                            )}
                          </div>

                          {/* URL */}
                          <a
                            href={
                              repository.repo_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex max-w-full items-center gap-1.5 text-xs text-slate-400 transition hover:text-blue-600"
                          >
                            <span className="truncate">
                              {
                                repository.repo_url
                              }
                            </span>

                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        </div>
                      </div>

                      {/* REPOSITORY META */}
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <RepositoryMeta
                          icon={GitBranch}
                          label="Branch"
                          value={
                            repository.branch
                          }
                        />

                        <RepositoryMeta
                          icon={FileCode2}
                          label="Indexed Files"
                          value={String(
                            repository.files_indexed
                          )}
                        />

                        <RepositoryMeta
                          icon={Sparkles}
                          label="Knowledge Chunks"
                          value={String(
                            repository.chunks
                          )}
                        />
                      </div>

                      {/* LAST SYNCED */}
                      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />

                        <span>
                          Last synced
                        </span>

                        <span className="font-semibold text-slate-600">
                          {formatDate(
                            repository.updated_at
                          )}
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex shrink-0 flex-wrap gap-2 xl:max-w-[390px] xl:justify-end">
                      {/* GITHUB */}
                      <a
                        href={
                          repository.repo_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />

                        GitHub
                      </a>

                      {/* SELECT */}
                      <button
                        type="button"
                        onClick={() =>
                          handleSelect(
                            repository.repository_id
                          )
                        }
                        disabled={
                          repository.status !==
                            "Indexed" ||
                          isReindexing ||
                          isDeleting
                        }
                        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          isSelected
                            ? "border border-blue-200 bg-blue-50 text-blue-700"
                            : "bg-slate-950 text-white shadow-sm hover:bg-slate-800"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />

                        {isSelected
                          ? "Selected"
                          : "Select"}
                      </button>

                      {/* CHAT */}
                      <button
                        type="button"
                        onClick={() =>
                          onOpenChat(
                            repository.repository_id
                          )
                        }
                        disabled={
                          repository.status !==
                            "Indexed" ||
                          isReindexing ||
                          isDeleting
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />

                        Ask AI
                      </button>

                      {/* REINDEX */}
                      <button
                        type="button"
                        onClick={() =>
                          onReindex(
                            repository.repository_id
                          )
                        }
                        disabled={
                          isReindexing ||
                          isDeleting
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${
                            isReindexing
                              ? "animate-spin"
                              : ""
                          }`}
                        />

                        {isReindexing
                          ? "Indexing..."
                          : "Re-index"}
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(
                            repository.repository_id
                          )
                        }
                        disabled={
                          isDeleting ||
                          isReindexing
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />

                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
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

/* =========================================================
   REPOSITORY META
========================================================= */

function RepositoryMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        <Icon className="h-3.5 w-3.5 text-blue-600" />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-bold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   GET REPOSITORY NAME
========================================================= */

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
      clean
        .split("/")
        .pop() ||
      "Repository"
    );
  } catch {
    return "Repository";
  }
}

/* =========================================================
   REPOSITORY STATUS BADGE
========================================================= */

function RepositoryBadge({
  status,
}: {
  status: string;
}) {
  if (
    status ===
    "Indexed"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

        Indexed
      </span>
    );
  }

  if (
    status ===
    "Failed"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
      <RefreshCw className="h-3 w-3 animate-spin" />

      Processing
    </span>
  );
}

/* =========================================================
   FORMAT LAST SYNCED DATE
========================================================= */

function formatDate(
  dateValue?: string | null
) {
  if (!dateValue) {
    return "Not available";
  }

  const date =
    new Date(
      dateValue
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
  }

  return date.toLocaleString();
}