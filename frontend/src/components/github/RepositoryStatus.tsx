// "use client";

// import {
//   CheckCircle2,
//   Clock3,
//   XCircle,
// } from "lucide-react";

// import {
//   GitHubRepository,
// } from "@/services/github";


// interface RepositoryStatusProps {
//   repositories:
//     GitHubRepository[];

//   loading:
//     boolean;
// }


// export default function RepositoryStatus({
//   repositories,
//   loading,
// }: RepositoryStatusProps) {

//   if (loading) {

//     return (
//       <div className="rounded-2xl border bg-white p-6 shadow-sm">

//         <h2 className="text-xl font-semibold text-slate-900">
//           Repository Status
//         </h2>


//         <p className="mt-3 text-slate-500">
//           Loading repository status...
//         </p>

//       </div>
//     );
//   }


//   const processing =
//     repositories.filter(
//       (repo) =>
//         repo.status ===
//         "Processing"
//     );


//   const failed =
//     repositories.filter(
//       (repo) =>
//         repo.status ===
//         "Failed"
//     );


//   const indexed =
//     repositories.filter(
//       (repo) =>
//         repo.status ===
//         "Indexed"
//     );


//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//       <h2 className="text-xl font-semibold text-slate-900">
//         Repository Status
//       </h2>


//       <p className="mt-1 text-sm text-slate-500">
//         Current indexing status for this agent.
//       </p>


//       <div className="mt-5 grid gap-4 md:grid-cols-3">


//         {/* INDEXED */}

//         <div className="rounded-xl border border-green-200 bg-green-50 p-4">

//           <div className="flex items-center gap-3">

//             <CheckCircle2
//               size={21}
//               className="text-green-600"
//             />


//             <div>

//               <p className="text-sm text-green-700">
//                 Indexed
//               </p>


//               <p className="text-2xl font-bold text-green-900">
//                 {indexed.length}
//               </p>

//             </div>

//           </div>

//         </div>


//         {/* PROCESSING */}

//         <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">

//           <div className="flex items-center gap-3">

//             <Clock3
//               size={21}
//               className="text-yellow-600"
//             />


//             <div>

//               <p className="text-sm text-yellow-700">
//                 Processing
//               </p>


//               <p className="text-2xl font-bold text-yellow-900">
//                 {processing.length}
//               </p>

//             </div>

//           </div>

//         </div>


//         {/* FAILED */}

//         <div className="rounded-xl border border-red-200 bg-red-50 p-4">

//           <div className="flex items-center gap-3">

//             <XCircle
//               size={21}
//               className="text-red-600"
//             />


//             <div>

//               <p className="text-sm text-red-700">
//                 Failed
//               </p>


//               <p className="text-2xl font-bold text-red-900">
//                 {failed.length}
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>


//       {repositories.length === 0 && (

//         <p className="mt-5 text-sm text-slate-500">
//           No repository has been connected yet.
//         </p>

//       )}

//     </div>
//   );
// }


"use client";

import {
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  GitHubRepository,
} from "@/services/github";

interface RepositoryStatusProps {
  repositories:
    GitHubRepository[];

  loading:
    boolean;
}

export default function RepositoryStatus({
  repositories,
  loading,
}: RepositoryStatusProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-white bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">
              Repository Status
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Loading repository indexing health...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const processing =
    repositories.filter(
      (repo) =>
        repo.status ===
        "Processing"
    );

  const failed =
    repositories.filter(
      (repo) =>
        repo.status ===
        "Failed"
    );

  const indexed =
    repositories.filter(
      (repo) =>
        repo.status ===
        "Indexed"
    );

  const total =
    repositories.length;

  const indexedPercent =
    total > 0
      ? Math.round(
          (indexed.length / total) * 100
        )
      : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-300/10 blur-[90px]" />

        <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-blue-300/10 blur-[90px]" />
      </div>

      <div className="relative">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Indexing Health
              </p>
            </div>

            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
              Repository Status
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Current indexing state of repositories in this workspace.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
              failed.length > 0
                ? "border-red-200 bg-red-50 text-red-700"
                : processing.length > 0
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                failed.length > 0
                  ? "bg-red-500"
                  : processing.length > 0
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
            />

            {failed.length > 0
              ? "Attention required"
              : processing.length > 0
                ? "Indexing in progress"
                : total > 0
                  ? "All systems ready"
                  : "No repositories"}
          </div>
        </div>

        {/* STATUS CARDS */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* INDEXED */}
          <StatusCard
            icon={CheckCircle2}
            title="Indexed"
            value={indexed.length}
            description="Ready for AI search"
            styles={{
              container:
                "border-emerald-200 bg-emerald-50/70",
              icon:
                "bg-emerald-100 text-emerald-600",
              value:
                "text-emerald-950",
              label:
                "text-emerald-700",
            }}
          />

          {/* PROCESSING */}
          <StatusCard
            icon={Clock3}
            title="Processing"
            value={processing.length}
            description="Currently indexing"
            styles={{
              container:
                "border-amber-200 bg-amber-50/70",
              icon:
                "bg-amber-100 text-amber-600",
              value:
                "text-amber-950",
              label:
                "text-amber-700",
            }}
          />

          {/* FAILED */}
          <StatusCard
            icon={XCircle}
            title="Failed"
            value={failed.length}
            description="Needs attention"
            styles={{
              container:
                "border-red-200 bg-red-50/70",
              icon:
                "bg-red-100 text-red-600",
              value:
                "text-red-950",
              label:
                "text-red-700",
            }}
          />
        </div>

        {/* OVERALL PROGRESS */}
        {total > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Knowledge Readiness
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  {indexed.length} of {total} repositories are ready for
                  semantic AI retrieval.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-2xl font-black text-slate-950">
                  {indexedPercent}%
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Indexed
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 transition-all duration-500"
                style={{
                  width: `${indexedPercent}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {repositories.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
              <Clock3 className="h-5 w-5 text-slate-400" />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-800">
              No repository connected yet
            </p>

            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
              Connect a repository above to start building searchable code
              intelligence for this agent.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  value,
  description,
  styles,
}: {
  icon: any;
  title: string;
  value: number;
  description: string;

  styles: {
    container: string;
    icon: string;
    value: string;
    label: string;
  };
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${styles.container}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className={`text-xs font-bold ${styles.label}`}>
            {title}
          </p>

          <p className={`mt-1 text-2xl font-black ${styles.value}`}>
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}