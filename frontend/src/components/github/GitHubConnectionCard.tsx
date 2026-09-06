// "use client";

// import {
//   FormEvent,
//   useState,
// } from "react";

// import {
//   Code2,
//   GitBranch,
//   Link2,
// } from "lucide-react";

// import {
//   connectRepository,
// } from "@/services/github";


// interface GitHubConnectionCardProps {
//   agentId: string;

//   onConnected:
//     () => Promise<void>
//     | void;
// }


// export default function GitHubConnectionCard({
//   agentId,
//   onConnected,
// }: GitHubConnectionCardProps) {

//   const [
//     repoUrl,
//     setRepoUrl,
//   ] = useState("");


//   const [
//     branch,
//     setBranch,
//   ] = useState(
//     "main"
//   );


//   const [
//     githubToken,
//     setGithubToken,
//   ] = useState("");


//   const [
//     connecting,
//     setConnecting,
//   ] = useState(false);


//   const [
//     error,
//     setError,
//   ] = useState("");


//   const [
//     success,
//     setSuccess,
//   ] = useState("");


//   // =========================================================
//   // CONNECT
//   // =========================================================

//   async function handleSubmit(
//     event: FormEvent<HTMLFormElement>
//   ) {

//     event.preventDefault();


//     setError("");
//     setSuccess("");


//     if (!agentId) {

//       setError(
//         "Please select an agent first."
//       );

//       return;
//     }


//     if (!repoUrl.trim()) {

//       setError(
//         "GitHub repository URL is required."
//       );

//       return;
//     }


//     if (!branch.trim()) {

//       setError(
//         "Branch name is required."
//       );

//       return;
//     }


//     try {

//       setConnecting(true);


//       const response =
//         await connectRepository({

//           agent_id:
//             agentId,

//           repo_url:
//             repoUrl.trim(),

//           branch:
//             branch.trim(),

//           github_token:
//             githubToken.trim()
//               ? githubToken.trim()
//               : null,

//         });


//       setSuccess(
//         response.message ||
//           "Repository connected successfully."
//       );


//       setRepoUrl("");
//       setGithubToken("");


//       await onConnected();


//     } catch (err: any) {

//       console.error(
//         "CONNECT REPOSITORY ERROR:",
//         err
//       );


//       setError(
//         err.message ||
//           "Failed to connect repository."
//       );


//     } finally {

//       setConnecting(false);

//     }
//   }


//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//       <div className="flex items-start gap-4">

//         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">

//           <Code2
//             size={24}
//           />

//         </div>


//         <div>

//           <h2 className="text-xl font-semibold text-slate-900">
//             Connect GitHub Repository
//           </h2>


//           <p className="mt-1 text-sm text-slate-500">
//             Connect a public repository or provide
//             a GitHub token for a private repository.
//           </p>

//         </div>

//       </div>


//       <form
//         onSubmit={
//           handleSubmit
//         }
//         className="mt-6 space-y-5"
//       >


//         {/* REPOSITORY URL */}

//         <div>

//           <label className="text-sm font-medium text-slate-700">
//             Repository URL
//           </label>


//           <div className="mt-2 flex items-center rounded-xl border border-slate-300 bg-white px-4">

//             <Link2
//               size={18}
//               className="text-slate-400"
//             />


//             <input
//               type="text"
//               value={
//                 repoUrl
//               }
//               onChange={(e) =>
//                 setRepoUrl(
//                   e.target.value
//                 )
//               }
//               placeholder="https://github.com/owner/repository.git"
//               className="w-full bg-transparent px-3 py-3 outline-none"
//             />

//           </div>

//         </div>


//         {/* BRANCH */}

//         <div>

//           <label className="text-sm font-medium text-slate-700">
//             Branch
//           </label>


//           <div className="mt-2 flex items-center rounded-xl border border-slate-300 bg-white px-4">

//             <GitBranch
//               size={18}
//               className="text-slate-400"
//             />


//             <input
//               type="text"
//               value={
//                 branch
//               }
//               onChange={(e) =>
//                 setBranch(
//                   e.target.value
//                 )
//               }
//               placeholder="main"
//               className="w-full bg-transparent px-3 py-3 outline-none"
//             />

//           </div>

//         </div>


//         {/* TOKEN */}

//         <div>

//           <label className="text-sm font-medium text-slate-700">
//             GitHub Token
//             <span className="ml-2 font-normal text-slate-400">
//               Optional
//             </span>
//           </label>


//           <input
//             type="password"
//             value={
//               githubToken
//             }
//             onChange={(e) =>
//               setGithubToken(
//                 e.target.value
//               )
//             }
//             placeholder="Required only for private repositories"
//             autoComplete="off"
//             className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
//           />


//           <p className="mt-2 text-xs text-slate-400">
//             Do not enter a token for public repositories.
//           </p>

//         </div>


//         {/* ERRORS */}

//         {error && (

//           <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//             {error}
//           </div>

//         )}


//         {success && (

//           <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
//             {success}
//           </div>

//         )}


//         {/* BUTTON */}

//         <button
//           type="submit"
//           disabled={
//             connecting ||
//             !agentId
//           }
//           className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
//         >

//           {connecting
//             ? "Cloning & Indexing Repository..."
//             : "Connect Repository"}

//         </button>


//         {connecting && (

//           <p className="text-center text-xs text-slate-500">
//             Large repositories may take some time to clone,
//             chunk, embed and index.
//           </p>

//         )}

//       </form>

//     </div>
//   );
// }

"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  CheckCircle2,
  Code2,
  GitBranch,
  KeyRound,
  Link2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  connectRepository,
} from "@/services/github";

interface GitHubConnectionCardProps {
  agentId: string;

  onConnected:
    () => Promise<void>
    | void;
}

export default function GitHubConnectionCard({
  agentId,
  onConnected,
}: GitHubConnectionCardProps) {
  const [
    repoUrl,
    setRepoUrl,
  ] = useState("");

  const [
    branch,
    setBranch,
  ] = useState(
    "main"
  );

  const [
    githubToken,
    setGithubToken,
  ] = useState("");

  const [
    connecting,
    setConnecting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  // =========================================================
  // CONNECT
  // =========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!agentId) {
      setError(
        "Please select an agent first."
      );

      return;
    }

    if (!repoUrl.trim()) {
      setError(
        "GitHub repository URL is required."
      );

      return;
    }

    if (!branch.trim()) {
      setError(
        "Branch name is required."
      );

      return;
    }

    try {
      setConnecting(true);

      const response =
        await connectRepository({
          agent_id:
            agentId,

          repo_url:
            repoUrl.trim(),

          branch:
            branch.trim(),

          github_token:
            githubToken.trim()
              ? githubToken.trim()
              : null,
        });

      setSuccess(
        response.message ||
          "Repository connected successfully."
      );

      setRepoUrl("");
      setGithubToken("");

      await onConnected();
    } catch (err: any) {
      console.error(
        "CONNECT REPOSITORY ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to connect repository."
      );
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-white">
      {/* SOFT BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-300/10 blur-[90px]" />

        <div className="absolute -bottom-28 left-20 h-64 w-64 rounded-full bg-violet-300/10 blur-[90px]" />
      </div>

      <div className="relative p-6 md:p-7">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <Code2 className="h-5 w-5 text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  Connect GitHub Repository
                </h2>

                <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                  Repository RAG
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Connect public or private repositories and transform source
                code into searchable enterprise AI knowledge.
              </p>
            </div>
          </div>

          {/* AGENT STATUS */}
          <div
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
              agentId
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                agentId
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />

            {agentId
              ? "Workspace Ready"
              : "Agent Required"}
          </div>
        </div>

        {/* SECURITY INFORMATION */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

            <div>
              <p className="text-xs font-bold text-slate-800">
                Public Repository
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Repository URL and branch are enough. No token required.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

            <div>
              <p className="text-xs font-bold text-slate-800">
                Private Repository
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Provide a GitHub access token with repository permissions.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7 space-y-5"
        >
          {/* URL + BRANCH GRID */}
          <div className="grid gap-5 lg:grid-cols-[1.6fr_0.7fr]">
            {/* REPOSITORY URL */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Repository URL
              </label>

              <div className="group mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/60">
                <Link2 className="h-4 w-4 shrink-0 text-slate-400 transition group-focus-within:text-blue-600" />

                <input
                  type="text"
                  value={
                    repoUrl
                  }
                  onChange={(e) =>
                    setRepoUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://github.com/owner/repository.git"
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-400">
                Example: https://github.com/company/project.git
              </p>
            </div>

            {/* BRANCH */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Branch
              </label>

              <div className="group mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100/60">
                <GitBranch className="h-4 w-4 shrink-0 text-slate-400 transition group-focus-within:text-violet-600" />

                <input
                  type="text"
                  value={
                    branch
                  }
                  onChange={(e) =>
                    setBranch(
                      e.target.value
                    )
                  }
                  placeholder="main"
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* TOKEN */}
          <div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                GitHub Access Token
              </label>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Optional
              </span>
            </div>

            <div className="group mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100/60">
              <KeyRound className="h-4 w-4 shrink-0 text-slate-400 transition group-focus-within:text-violet-600" />

              <input
                type="password"
                value={
                  githubToken
                }
                onChange={(e) =>
                  setGithubToken(
                    e.target.value
                  )
                }
                placeholder="Required only for private repositories"
                autoComplete="off"
                className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />

              Do not provide a token for public repositories.
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <div>
                <p className="text-xs font-bold">
                  Connection failed
                </p>

                <p className="mt-1 text-xs">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

              <div>
                <p className="text-xs font-bold">
                  Repository connected
                </p>

                <p className="mt-1 text-xs">
                  {success}
                </p>
              </div>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              connecting ||
              !agentId
            }
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {connecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Cloning & Indexing Repository...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />

                Connect & Index Repository
              </>
            )}
          </button>

          {/* INDEXING INFO */}
          {connecting && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="flex items-start gap-3">
                <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-blue-600" />

                <div>
                  <p className="text-xs font-bold text-blue-900">
                    Building repository knowledge
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-blue-700/70">
                    The repository is being cloned, parsed, chunked,
                    embedded and indexed. Large repositories may take longer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}