// "use client";

// import {
//   Boxes,
//   Code2,
//   FileCode2,
  
//   SearchCheck,
// } from "lucide-react";


// interface RepositoryStatsProps {
//   total: number;
//   indexed: number;
//   files: number;
//   chunks: number;
// }


// export default function RepositoryStats({
//   total,
//   indexed,
//   files,
//   chunks,
// }: RepositoryStatsProps) {

//   return (
//     <div>

//       <h2 className="text-xl font-semibold text-slate-900">
//         Repository Knowledge
//       </h2>


//       <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


//         <StatCard
//           title="Repositories"
//           value={
//             total
//           }
//           icon={
//             <Code2
//               size={22}
//             />
//           }
//         />


//         <StatCard
//           title="Indexed"
//           value={
//             indexed
//           }
//           icon={
//             <SearchCheck
//               size={22}
//             />
//           }
//         />


//         <StatCard
//           title="Source Files"
//           value={
//             files
//           }
//           icon={
//             <FileCode2
//               size={22}
//             />
//           }
//         />


//         <StatCard
//           title="Code Chunks"
//           value={
//             chunks
//           }
//           icon={
//             <Boxes
//               size={22}
//             />
//           }
//         />

//       </div>

//     </div>
//   );
// }


// function StatCard({
//   title,
//   value,
//   icon,
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
// }) {

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

//       <div className="flex items-center justify-between">

//         <div>

//           <p className="text-sm text-slate-500">
//             {title}
//           </p>


//           <p className="mt-2 text-3xl font-bold text-slate-900">
//             {value}
//           </p>

//         </div>


//         <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
//           {icon}
//         </div>

//       </div>

//     </div>
//   );
// }

"use client";

import {
  Boxes,
  Code2,
  FileCode2,
  SearchCheck,
  Sparkles,
} from "lucide-react";

interface RepositoryStatsProps {
  total: number;
  indexed: number;
  files: number;
  chunks: number;
}

export default function RepositoryStats({
  total,
  indexed,
  files,
  chunks,
}: RepositoryStatsProps) {
  const stats = [
    {
      title: "Repositories",
      value: total,
      subtitle: "Connected codebases",
      icon: Code2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "from-blue-600 to-cyan-500",
    },
    {
      title: "Indexed",
      value: indexed,
      subtitle: "Ready for AI retrieval",
      icon: SearchCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "from-emerald-600 to-cyan-500",
    },
    {
      title: "Source Files",
      value: files,
      subtitle: "Files processed",
      icon: FileCode2,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      accent: "from-cyan-600 to-blue-500",
    },
    {
      title: "Code Chunks",
      value: chunks,
      subtitle: "Searchable RAG units",
      icon: Boxes,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      accent: "from-violet-600 to-purple-500",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-300/10 blur-[90px]" />

        <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-violet-300/10 blur-[90px]" />
      </div>

      <div className="relative">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                Knowledge Metrics
              </p>
            </div>

            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
              Repository Knowledge
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Real indexing metrics from repositories connected to this agent.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            Live workspace data
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-white hover:shadow-[0_14px_35px_rgba(37,99,235,0.09)]"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-[3px] bg-linear-to-r ${stat.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {stat.subtitle}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}