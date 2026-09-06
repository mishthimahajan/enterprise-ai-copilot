// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useRouter,
// } from "next/navigation";
// import {
//   reindexRepository,
//   deleteRepository,
// } from "@/services/github";

// import GitHubConnectionCard from "@/components/github/GitHubConnectionCard";
// import ConnectedRepositories from "@/components/github/ConnectedRepositories";
// import RepositoryStatus from "@/components/github/RepositoryStatus";
// import RepositoryStats from "@/components/github/RepositoryStats";

// import {
//   GitHubRepository,
//   GitHubRepositoriesResponse,
//   getRepositories,
//   setSelectedRepository,
// } from "@/services/github";


// export default function GitHubPage() {
//   const router =
//     useRouter();


//   const [
//     agentId,
//     setAgentId,
//   ] = useState("");


//   const [
//     repositories,
//     setRepositories,
//   ] = useState<GitHubRepository[]>([]);


//   const [
//     stats,
//     setStats,
//   ] = useState({
//     total: 0,
//     indexed: 0,
//     total_files: 0,
//     total_chunks: 0,
//   });


//   const [
//     loading,
//     setLoading,
//   ] = useState(true);


//   const [
//     error,
//     setError,
//   ] = useState("");


//   const [
//     success,
//     setSuccess,
//   ] = useState("");
//   const [reindexingId, setReindexingId] =
//   useState<string | null>(null);

//   const [
//   deletingId,
//   setDeletingId,
// ] = useState<string | null>(null);


//   useEffect(() => {
//   const token = localStorage.getItem("access_token");

//   if (!token) {
//     router.replace("/login?redirect=/github");
//     setLoading(false);
//     return;
//   }

//   initializePage();
// }, [router]);



//   async function initializePage() {
//     try {
//       setLoading(true);
//       setError("");


//       const token =
//         localStorage.getItem(
//           "access_token"
//         );


//       if (!token) {
//         router.replace(
//           "/login"
//         );

//         return;
//       }


//       const selectedAgentId =
//         localStorage.getItem(
//           "selected_agent_id"
//         );


//       if (!selectedAgentId) {
//         setError(
//           "Please select an agent before connecting a GitHub repository."
//         );

//         return;
//       }


//       setAgentId(
//         selectedAgentId
//       );


//       await loadRepositories(
//         selectedAgentId
//       );


//     } catch (err: any) {

//       console.error(
//         "GITHUB PAGE ERROR:",
//         err
//       );


//       setError(
//         err.message ||
//           "Failed to initialize GitHub Agent."
//       );


//     } finally {

//       setLoading(false);

//     }
//   }


//   // =========================================================
//   // LOAD REPOSITORIES
//   // =========================================================

//   async function loadRepositories(
//     selectedAgentId: string
//   ) {
//     try {

//       const data:
//         GitHubRepositoriesResponse =
//         await getRepositories(
//           selectedAgentId
//         );


//       setRepositories(
//         Array.isArray(
//           data.repositories
//         )
//           ? data.repositories
//           : []
//       );


//       setStats({

//         total:
//           data.total || 0,

//         indexed:
//           data.indexed || 0,

//         total_files:
//           data.total_files || 0,

//         total_chunks:
//           data.total_chunks || 0,

//       });


//     } catch (err: any) {

//       console.error(
//         "LOAD REPOSITORIES ERROR:",
//         err
//       );


//       setError(
//         err.message ||
//           "Failed to load repositories."
//       );

//     }
//   }


//   // =========================================================
//   // REPOSITORY CONNECTED
//   // =========================================================

//   async function handleRepositoryConnected() {
//     if (!agentId) {
//       return;
//     }


//     setSuccess(
//       "Repository connected and indexed successfully."
//     );


//     await loadRepositories(
//       agentId
//     );


//     setTimeout(() => {
//       setSuccess("");
//     }, 3000);
//   }
//   async function handleReindex(
//   repositoryId: string
// ) {
//   try {
//     setReindexingId(repositoryId);

//     await reindexRepository(repositoryId);

//     // Reload repository list after successful indexing
//     await loadRepositories(agentId);

//   } catch (error: any) {
//     console.error(
//       "REINDEX ERROR:",
//       error
//     );

//     alert(
//       error.message ||
//         "Failed to re-index repository."
//     );

//   } finally {
//     setReindexingId(null);
//   }
// }
// async function handleDeleteRepository(
//   repositoryId: string
// ) {
//   const confirmed = window.confirm(
//     "Are you sure you want to delete this repository? This will remove its indexed data as well."
//   );

//   if (!confirmed) {
//     return;
//   }

//   try {
//     setDeletingId(repositoryId);

//     setError("");
//     setSuccess("");

//     await deleteRepository(
//       repositoryId
//     );

//     const selectedRepositoryId =
//       localStorage.getItem(
//         "selected_repository_id"
//       );

//     if (
//       selectedRepositoryId ===
//       repositoryId
//     ) {
//       localStorage.removeItem(
//         "selected_repository_id"
//       );
//     }

//     await loadRepositories(
//       agentId
//     );

//     setSuccess(
//       "Repository deleted successfully."
//     );

//     setTimeout(() => {
//       setSuccess("");
//     }, 3000);

//   } catch (error: any) {

//     console.error(
//       "DELETE REPOSITORY ERROR:",
//       error
//     );

//     setError(
//       error.message ||
//         "Failed to delete repository."
//     );

//   } finally {

//     setDeletingId(null);
//   }
// }

//   // =========================================================
//   // SELECT REPOSITORY
//   // =========================================================

//   function handleSelectRepository(
//     repositoryId: string
//   ) {

//     setSelectedRepository(
//       repositoryId
//     );


//     setSuccess(
//       "Repository selected successfully."
//     );


//     setTimeout(() => {
//       setSuccess("");
//     }, 2500);
//   }


//   // =========================================================
//   // OPEN REPOSITORY CHAT
//   // =========================================================

//   function handleOpenChat(
//   repositoryId: string
// ) {
//   // Save selected GitHub repository
//   localStorage.setItem(
//     "selected_repository_id",
//     repositoryId
//   );

//   // Important:
//   // repository chat should not accidentally
//   // use an old selected document.
//   localStorage.removeItem(
//     "selected_document_id"
//   );

//   router.push(
//     `/chat?repository_id=${repositoryId}`
//   );
// }


//   // =========================================================
//   // NO AGENT
//   // =========================================================

//   if (
//     !loading &&
//     !agentId
//   ) {
//     return (
//       <div className="min-h-screen bg-slate-100 p-8">

//         <div className="mx-auto max-w-4xl">

//           <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

//             <h1 className="text-2xl font-bold text-slate-900">
//               No Agent Selected
//             </h1>


//             <p className="mt-3 text-slate-500">
//               Select a shared agent first, then connect
//               a GitHub repository to that workspace.
//             </p>


//             <button
//               type="button"
//               onClick={() =>
//                 router.push(
//                   "/dashboard"
//                 )
//               }
//               className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
//             >
//               Go to Dashboard
//             </button>

//           </div>

//         </div>

//       </div>
//     );
//   }


//   // =========================================================
//   // PAGE
//   // =========================================================

//   return (
//     <div className="min-h-screen bg-slate-100 p-8">

//       <div className="mx-auto max-w-7xl space-y-8">


//         {/* HEADER */}

//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

//           <div>

//             <h1 className="text-3xl font-bold text-slate-900">
//               GitHub Agent
//             </h1>


//             <p className="mt-2 text-slate-500">
//               Connect repositories and let the AI understand
//               your shared codebase.
//             </p>


//             {agentId && (
//               <p className="mt-2 text-xs text-slate-400">
//                 Active Agent: {agentId}
//               </p>
//             )}

//           </div>


//           <button
//             type="button"
//             onClick={() =>
//               router.push(
//                 "/dashboard"
//               )
//             }
//             className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
//           >
//             Back to Dashboard
//           </button>

//         </div>


//         {/* ERROR */}

//         {error && (
//           <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}


//         {/* SUCCESS */}

//         {success && (
//           <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//             {success}
//           </div>
//         )}


//         {/* CONNECT */}

//         <GitHubConnectionCard
//           agentId={agentId}
//           onConnected={
//             handleRepositoryConnected
//           }
//         />


//         {/* CURRENT STATUS */}

//         <RepositoryStatus
//           repositories={
//             repositories
//           }
//           loading={
//             loading
//           }
//         />


//         {/* STATS */}

//         <RepositoryStats
//           total={
//             stats.total
//           }
//           indexed={
//             stats.indexed
//           }
//           files={
//             stats.total_files
//           }
//           chunks={
//             stats.total_chunks
//           }
//         />


//         {/* LIST */}

//         <ConnectedRepositories
//   repositories={
//     repositories
//   }
//   loading={
//     loading
//   }
//   onSelect={
//     handleSelectRepository
//   }
//   onOpenChat={
//     handleOpenChat
//   }
//   onReindex={
//     handleReindex
//   }
//   reindexingId={
//     reindexingId
//   }
//   onDelete={
//     handleDeleteRepository
//   }
//   deletingId={
//     deletingId
//   }
// />

//       </div>

//     </div>
//   );
// }




"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  FileCode2,
  GitBranch,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  reindexRepository,
  deleteRepository,
} from "@/services/github";

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
  const router = useRouter();

  const [
    agentId,
    setAgentId,
  ] = useState("");

  const [
    selectedRepositoryId,
    setSelectedRepositoryId,
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

  const [
    reindexingId,
    setReindexingId,
  ] = useState<string | null>(null);

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(null);

  // =========================================================
  // AUTH + INITIALIZATION
  // =========================================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {
      router.replace(
        "/login?redirect=/github"
      );

      setLoading(false);

      return;
    }

    initializePage();
  }, [router]);

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

      const savedRepositoryId =
        localStorage.getItem(
          "selected_repository_id"
        );

      if (savedRepositoryId) {
        setSelectedRepositoryId(
          savedRepositoryId
        );
      }

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

  // =========================================================
  // REINDEX
  // =========================================================

  async function handleReindex(
    repositoryId: string
  ) {
    try {
      setReindexingId(
        repositoryId
      );

      setError("");
      setSuccess("");

      await reindexRepository(
        repositoryId
      );

      await loadRepositories(
        agentId
      );

      setSuccess(
        "Repository re-indexed successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      console.error(
        "REINDEX ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to re-index repository."
      );
    } finally {
      setReindexingId(null);
    }
  }

  // =========================================================
  // DELETE REPOSITORY
  // =========================================================

  async function handleDeleteRepository(
    repositoryId: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this repository? This will remove its indexed data as well."
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        repositoryId
      );

      setError("");
      setSuccess("");

      await deleteRepository(
        repositoryId
      );

      const savedRepositoryId =
        localStorage.getItem(
          "selected_repository_id"
        );

      if (
        savedRepositoryId ===
        repositoryId
      ) {
        localStorage.removeItem(
          "selected_repository_id"
        );

        setSelectedRepositoryId("");
      }

      await loadRepositories(
        agentId
      );

      setSuccess(
        "Repository deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      console.error(
        "DELETE REPOSITORY ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to delete repository."
      );
    } finally {
      setDeletingId(null);
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

    setSelectedRepositoryId(
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
    localStorage.setItem(
      "selected_repository_id",
      repositoryId
    );

    localStorage.removeItem(
      "selected_document_id"
    );

    setSelectedRepositoryId(
      repositoryId
    );

    router.push(
      `/chat?repository_id=${repositoryId}`
    );
  }

  // =========================================================
  // NO AGENT SELECTED
  // =========================================================

  if (
    !loading &&
    !agentId
  ) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F7FB] px-5">
        {/* BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-200px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-[140px]" />

          <div className="absolute bottom-[-180px] right-[-120px] h-[450px] w-[450px] rounded-full bg-violet-300/10 blur-[130px]" />

          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
              backgroundSize:
                "52px 52px",
            }}
          />
        </div>

        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white bg-white/90 p-9 text-center shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-xl shadow-blue-500/20">
            <GitBranch className="h-7 w-7 text-white" />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Workspace Required
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
            Select an AI agent first
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            GitHub repositories are scoped to shared AI workspaces.
            Select an agent from the dashboard before connecting and
            indexing a repository.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

            Select Agent
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* =====================================================
          DARK TOP HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#07111F]">
        {/* BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-[-180px] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[160px]" />

          <div className="absolute right-[-150px] top-[-80px] h-[550px] w-[550px] rounded-full bg-violet-600/20 blur-[150px]" />

          <div className="absolute bottom-[-220px] left-[40%] h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize:
                "52px 52px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pb-20">
          {/* TOP NAVIGATION */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-slate-300 backdrop-blur transition hover:bg-white/[0.09] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

              Dashboard
            </button>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              GitHub Intelligence Online
            </div>
          </div>

          {/* HERO CONTENT */}
          <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur">
                <Code2 className="h-4 w-4" />

                Repository Intelligence
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Turn your codebase into
                <span className="block bg-linear-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  searchable AI knowledge.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
                Connect a GitHub repository, index its source code into
                vector knowledge, and ask architecture or implementation
                questions with grounded source references.
              </p>

              {/* ACTIVE AGENT */}
              <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-violet-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Active Agent
                  </p>

                  <p className="mt-0.5 max-w-[280px] truncate text-xs font-semibold text-white">
                    {agentId}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT ARCHITECTURE VISUAL */}
            <div className="relative">
              <div className="absolute -inset-10 rounded-[40px] bg-linear-to-br from-blue-600/15 via-violet-600/15 to-cyan-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                      Code Intelligence Pipeline
                    </p>

                    <p className="mt-2 text-lg font-black text-white">
                      GitHub → RAG → AI
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  <PipelineNode
                    icon={Code2}
                    title="GitHub Repository"
                    subtitle="Source code & project structure"
                    color="blue"
                  />

                  <PipelineConnector />

                  <PipelineNode
                    icon={FileCode2}
                    title="Code Processing"
                    subtitle="Parse & chunk repository files"
                    color="cyan"
                  />

                  <PipelineConnector />

                  <PipelineNode
                    icon={Database}
                    title="Qdrant Vector Index"
                    subtitle="Semantic code embeddings"
                    color="violet"
                  />

                  <PipelineConnector />

                  <PipelineNode
                    icon={Search}
                    title="Semantic Retrieval"
                    subtitle="Relevant source context"
                    color="purple"
                  />

                  <PipelineConnector />

                  <PipelineNode
                    icon={MessageSquare}
                    title="Grounded AI Chat"
                    subtitle="Answers with source references"
                    color="emerald"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="relative overflow-hidden">
        {/* BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-48 top-[-100px] h-[500px] w-[500px] rounded-full bg-blue-300/10 blur-[140px]" />

          <div className="absolute right-[-160px] top-[450px] h-[500px] w-[500px] rounded-full bg-violet-300/10 blur-[140px]" />

          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
              backgroundSize:
                "52px 52px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl space-y-8 px-5 py-10 lg:px-8 lg:py-14">
          {/* ALERTS */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 shadow-sm">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-bold">
                  GitHub Agent Error
                </p>

                <p className="mt-1 text-xs leading-6">
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-700 shadow-sm">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-bold">
                  Operation Successful
                </p>

                <p className="mt-1 text-xs">
                  {success}
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              CONNECT REPOSITORY
          ================================================== */}

          <section>
            <SectionHeading
              badge="Connect"
              title="Add repository knowledge"
              description="Connect a GitHub repository to the active AI agent and index its source code for semantic retrieval."
            />

            <div className="mt-5 overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl">
              <div className="border-b border-slate-100 bg-linear-to-r from-blue-50/80 via-violet-50/50 to-cyan-50/70 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                    <GitBranch className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-950">
                      GitHub Repository Connection
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Repository content will be indexed inside the selected
                      agent workspace.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-1 sm:p-2">
                <GitHubConnectionCard
                  agentId={agentId}
                  onConnected={
                    handleRepositoryConnected
                  }
                />
              </div>
            </div>
          </section>

          {/* =================================================
              REAL REPOSITORY STATS
          ================================================== */}

          <section>
            <SectionHeading
              badge="Knowledge"
              title="Repository intelligence"
              description="Real indexing statistics from repositories connected to this AI workspace."
            />

            <div className="mt-5">
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
            </div>
          </section>

          {/* EXTRA VISUAL STAT SUMMARY */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat
              icon={GitBranch}
              title="Repositories"
              value={stats.total}
              color="blue"
            />

            <MiniStat
              icon={CheckCircle2}
              title="Indexed"
              value={stats.indexed}
              color="emerald"
            />

            <MiniStat
              icon={FileCode2}
              title="Source Files"
              value={stats.total_files}
              color="cyan"
            />

            <MiniStat
              icon={Database}
              title="Code Chunks"
              value={stats.total_chunks}
              color="violet"
            />
          </section>

          {/* =================================================
              CURRENT STATUS
          ================================================== */}

          <section>
            <SectionHeading
              badge="Status"
              title="Indexing health"
              description="Monitor repository availability and current indexing state."
            />

            <div className="mt-5">
              <RepositoryStatus
                repositories={
                  repositories
                }
                loading={
                  loading
                }
              />
            </div>
          </section>

          {/* =================================================
              CONNECTED REPOSITORIES
          ================================================== */}

          <section className="pb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                badge="Repositories"
                title="Connected codebases"
                description="Select, re-index, remove or start an AI conversation with an indexed repository."
              />

              {repositories.length > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  {repositories.length} connected
                </div>
              )}
            </div>

            <div className="mt-5">
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
                onDelete={
                  handleDeleteRepository
                }
                deletingId={
                  deletingId
                }
              />
            </div>
          </section>

          {/* =================================================
              BOTTOM ENTERPRISE MESSAGE
          ================================================== */}

          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#07111F] p-7 shadow-[0_25px_70px_rgba(15,23,42,0.16)] md:p-8">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-600/20 blur-[90px]" />

              <div className="absolute -right-20 bottom-[-100px] h-64 w-64 rounded-full bg-violet-600/20 blur-[90px]" />
            </div>

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Grounded Developer Intelligence
                  </p>
                </div>

                <h3 className="mt-3 text-2xl font-black text-white">
                  Ask questions directly against
                  <span className="text-slate-400">
                    {" "}your codebase.
                  </span>
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  Repository chat retrieves relevant indexed source code before
                  generating an answer, helping keep responses grounded in the
                  connected project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedRepositoryId
                  ) {
                    handleOpenChat(
                      selectedRepositoryId
                    );
                  }
                }}
                disabled={
                  !selectedRepositoryId
                }
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                <MessageSquare className="h-4 w-4" />

                Open Repository Chat
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
          {badge}
        </p>
      </div>

      <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: any;
  title: string;
  value: number;
  color:
    | "blue"
    | "emerald"
    | "cyan"
    | "violet";
}) {
  const styles = {
    blue: {
      icon:
        "bg-blue-50 text-blue-600",
      accent:
        "from-blue-600 to-cyan-500",
    },

    emerald: {
      icon:
        "bg-emerald-50 text-emerald-600",
      accent:
        "from-emerald-600 to-cyan-500",
    },

    cyan: {
      icon:
        "bg-cyan-50 text-cyan-600",
      accent:
        "from-cyan-600 to-blue-500",
    },

    violet: {
      icon:
        "bg-violet-50 text-violet-600",
      accent:
        "from-violet-600 to-purple-500",
    },
  };

  const current =
    styles[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white bg-white/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(37,99,235,0.10)]">
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-linear-to-r ${current.accent} opacity-0 transition group-hover:opacity-100`}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${current.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PIPELINE NODE
========================================================= */

function PipelineNode({
  icon: Icon,
  title,
  subtitle,
  color,
}: {
  icon: any;
  title: string;
  subtitle: string;
  color:
    | "blue"
    | "cyan"
    | "violet"
    | "purple"
    | "emerald";
}) {
  const styles = {
    blue:
      "border-blue-400/15 bg-blue-500/10 text-blue-400",

    cyan:
      "border-cyan-400/15 bg-cyan-500/10 text-cyan-400",

    violet:
      "border-violet-400/15 bg-violet-500/10 text-violet-400",

    purple:
      "border-purple-400/15 bg-purple-500/10 text-purple-400",

    emerald:
      "border-emerald-400/15 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${styles[color]}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/15">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-xs font-bold text-white">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PIPELINE CONNECTOR
========================================================= */

function PipelineConnector() {
  return (
    <div className="flex h-3 justify-center">
      <div className="h-full w-px bg-linear-to-b from-blue-400/40 to-violet-400/30" />
    </div>
  );
}
