
// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, GitBranch, Sparkles } from "lucide-react";

// export default function Hero() {
//   return (
//     <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-blue-50">

//       <div className="mx-auto max-w-7xl px-6 py-28">

//         <div className="mx-auto max-w-4xl text-center">

//           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
//             <Sparkles className="h-4 w-4" />
//             AI Powered Developer Assistant
//           </div>

//           <h1 className="text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
//             Enterprise AI
//             <span className="block text-blue-600">
//               Operations Copilot
//             </span>
//           </h1>

//           <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600">
//             Connect your GitHub repositories and let AI automatically
//             analyze your codebase, generate documentation, detect bugs,
//             explain architecture, and answer questions about your project.
//           </p>

//           <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">

//             <Link href="/login">
//               <Button
//                 size="lg"
//                 className="bg-blue-600 px-8 hover:bg-blue-700"
//               >
//                 Sign In
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </Link>

//             <Link href="/repositories">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="px-8"
//               >
//                 <GitBranch className="mr-2 h-5 w-5" />
//                 Connect Repository
//               </Button>
//             </Link>

//           </div>

//           <div className="mt-20 grid gap-6 md:grid-cols-3">

//             <div className="rounded-2xl border bg-white p-6 shadow-sm">
//               <h3 className="text-xl font-semibold">
//                 AI Code Analysis
//               </h3>

//               <p className="mt-3 text-sm text-slate-600">
//                 Automatically understand folders, architecture,
//                 dependencies, and project structure.
//               </p>
//             </div>

//             <div className="rounded-2xl border bg-white p-6 shadow-sm">
//               <h3 className="text-xl font-semibold">
//                 Smart Documentation
//               </h3>

//               <p className="mt-3 text-sm text-slate-600">
//                 Generate professional documentation and README files
//                 instantly using AI.
//               </p>
//             </div>

//             <div className="rounded-2xl border bg-white p-6 shadow-sm">
//               <h3 className="text-xl font-semibold">
//                 AI Chat Assistant
//               </h3>

//               <p className="mt-3 text-sm text-slate-600">
//                 Ask questions about your repository and receive
//                 context-aware answers powered by AI.
//               </p>
//             </div>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCode2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();

  function startCopilot() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAFF] pt-24">
      {/* PREMIUM BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        {/* Blue glow */}
        <div className="absolute left-[3%] top-[-140px] h-[540px] w-[540px] rounded-full bg-blue-400/15 blur-[140px]" />

        {/* Violet glow */}
        <div className="absolute right-[-120px] top-[60px] h-[520px] w-[520px] rounded-full bg-violet-400/15 blur-[150px]" />

        {/* Cyan glow */}
        <div className="absolute bottom-[-200px] left-[38%] h-[480px] w-[480px] rounded-full bg-cyan-300/10 blur-[140px]" />

        {/* Technical grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/80 to-transparent" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT CONTENT */}
          <div>
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-xl">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-violet-100">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              </div>

              Enterprise Developer Intelligence Platform
            </div>

            {/* HEADING */}
            <h1 className="mt-7 max-w-3xl text-5xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Understand your
              <span className="block bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                codebase instantly.
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              Connect repositories and enterprise documents into one
              intelligent workspace. Search code, understand architecture,
              and receive grounded AI answers with verifiable sources.
            </p>

            {/* ACTION BUTTONS */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={startCopilot}
                className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-6 py-3.5 font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(124,58,237,0.25)]"
              >
                Start Using Copilot

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => router.push("/about")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-md"
              >
                View Architecture
              </button>
            </div>

            {/* TRUST POINTS */}
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                </div>

                JWT Authentication
              </span>

              <span className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                </div>

                Source-grounded answers
              </span>

              <span className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-violet-600" />
                </div>

                Shared AI workspaces
              </span>
            </div>
          </div>

          {/* RIGHT PRODUCT PREVIEW */}
          <div className="relative">
            {/* Preview glow */}
            <div className="absolute -inset-10 rounded-[40px] bg-linear-to-br from-blue-500/15 via-violet-500/15 to-cyan-400/15 blur-3xl" />

            {/* Main preview card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[0_30px_80px_rgba(30,64,175,0.15)] backdrop-blur-xl">
              {/* TOP WINDOW BAR */}
              <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>

                  <div className="hidden h-5 w-px bg-slate-200 sm:block" />

                  <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                    Enterprise AI Workspace
                  </span>
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Live Preview
                </span>
              </div>

              {/* COPILOT HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                    <Code2 className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Engineering Copilot
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      SmartTaskAnalyzer
                      <span className="mx-1.5 text-slate-300">•</span>
                      main
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Indexed
                </span>
              </div>

              {/* CHAT */}
              <div className="space-y-5 bg-linear-to-b from-slate-50/90 via-white to-blue-50/40 p-5 sm:p-6">
                {/* USER MESSAGE */}
                <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-linear-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-blue-500/10">
                  Where is authentication implemented in this project?
                </div>

                {/* AI ANSWER */}
                <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-blue-100 to-violet-100">
                      <Sparkles className="h-4 w-4 text-violet-600" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                      Copilot Answer
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    Authentication is handled by the FastAPI auth route.
                    Agent credentials are validated and a JWT access token
                    is returned for protected application routes.
                  </p>

                  {/* SOURCES */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Verified Sources
                      </p>

                      <span className="text-[10px] font-medium text-emerald-600">
                        2 sources
                      </span>
                    </div>

                    {/* SOURCE 1 */}
                    <div className="group flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5 transition hover:border-blue-200 hover:bg-blue-50">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <FileCode2 className="h-4 w-4 text-blue-600" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          backend/routes/auth.py
                        </p>

                        <p className="text-[11px] text-slate-500">
                          Authentication route
                        </p>
                      </div>

                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    </div>

                    {/* SOURCE 2 */}
                    <div className="group flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-3 py-2.5 transition hover:border-violet-200 hover:bg-violet-50">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                        <Search className="h-4 w-4 text-violet-600" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          Indexed repository
                        </p>

                        <p className="text-[11px] text-slate-500">
                          Semantic code retrieval
                        </p>
                      </div>

                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM STATUS */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-[11px] font-medium text-slate-500">
                    Knowledge workspace active
                  </span>
                </div>

                <span className="text-[10px] text-slate-400">
                  RAG Powered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TECHNOLOGY STRIP */}
        <div className="mt-20 overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "GitHub",
                description: "Repository intelligence",
                text: "text-blue-600",
                dot: "bg-blue-500",
              },
              {
                title: "Qdrant",
                description: "Vector retrieval",
                text: "text-violet-600",
                dot: "bg-violet-500",
              },
              {
                title: "MongoDB",
                description: "Persistent workspace",
                text: "text-emerald-600",
                dot: "bg-emerald-500",
              },
              {
                title: "Gemini",
                description: "Grounded generation",
                text: "text-cyan-600",
                dot: "bg-cyan-500",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`group relative p-6 transition-all duration-300 hover:bg-slate-50/80 ${
                  index < 3 ? "lg:border-r lg:border-slate-200" : ""
                } ${
                  index < 2 ? "border-b border-slate-200 lg:border-b-0" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${item.dot}`}
                  />

                  <p className={`text-xl font-black ${item.text}`}>
                    {item.title}
                  </p>
                </div>

                <p className="mt-1.5 text-xs font-medium text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SMOOTH TRANSITION INTO FEATURES */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-b from-transparent to-[#F7F9FC]" />
    </section>
  );
}