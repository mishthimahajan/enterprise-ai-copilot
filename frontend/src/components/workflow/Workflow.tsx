// "use client";

// import { motion } from "framer-motion";
// import {
  
//   FolderGit2,
//   Database,
//   MessageSquare,
// } from "lucide-react";

// const workflow = [
//   // {
//   //   icon: Github,
//   //   title: "Connect Repository",
//   //   description:
//   //     "Connect your GitHub repository securely using the GitHub API.",
//   // },
//   {
//     icon: FolderGit2,
//     title: "Analyze & Index",
//     description:
//       "The AI agent analyzes folders, files, classes, functions, and documentation.",
//   },
//   {
//     icon: Database,
//     title: "Generate Embeddings",
//     description:
//       "Code and documentation are converted into vector embeddings and stored for semantic search.",
//   },
//   {
//     icon: MessageSquare,
//     title: "Ask Questions",
//     description:
//       "Ask questions in natural language and receive AI-generated answers with source references.",
//   },
// ];

// export default function Workflow() {
//   return (
//     <section className="bg-slate-50 py-24">
//       <div className="mx-auto max-w-7xl px-6">

//         {/* Heading */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="text-center"
//         >
//           <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
//             Workflow
//           </span>

//           <h2 className="mt-6 text-4xl font-bold text-slate-900">
//             How Enterprise AI Copilot Works
//           </h2>

//           <p className="mt-5 text-lg text-slate-600">
//             From connecting your repository to receiving AI-powered answers in
//             just a few steps.
//           </p>
//         </motion.div>

//         {/* Workflow Cards */}
//         <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
//           {workflow.map((step, index) => {
//             const Icon = step.icon;

//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{
//                   duration: 0.5,
//                   delay: index * 0.2,
//                 }}
//                 viewport={{ once: true }}
//                 className="relative rounded-3xl bg-white p-8 shadow-md hover:shadow-xl transition duration-300"
//               >
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
//                   <Icon className="h-7 w-7 text-blue-600" />
//                 </div>

//                 <h3 className="mt-6 text-xl font-semibold text-slate-900">
//                   {step.title}
//                 </h3>

//                 <p className="mt-4 text-slate-600 leading-7">
//                   {step.description}
//                 </p>

//                 {/* Arrow */}
//                 {index !== workflow.length - 1 && (
//                   <div className="hidden lg:flex absolute top-1/2 -right-8 -translate-y-1/2 text-blue-400 text-3xl font-bold">
//                     →
//                   </div>
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }
import type { ElementType } from "react";
import {
  ArrowDown,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  FileText,
  Search,
  Sparkles,
  Workflow as WorkflowIcon,
} from "lucide-react";

const steps = [
  {
    icon: Code2,
    number: "01",
    title: "Connect Knowledge Sources",
    description:
      "Connect GitHub repositories or upload enterprise files such as PDF, DOCX, and PPTX.",
    accent: "from-blue-600 to-cyan-500",
    iconBg: "from-blue-600 to-cyan-500",
  },
  {
    icon: FileText,
    number: "02",
    title: "Process & Chunk Content",
    description:
      "Repository files and enterprise documents are parsed and divided into meaningful knowledge chunks.",
    accent: "from-cyan-500 to-blue-500",
    iconBg: "from-cyan-500 to-blue-500",
  },
  {
    icon: Database,
    number: "03",
    title: "Generate Embeddings",
    description:
      "FastEmbed converts code and document chunks into vector representations for semantic understanding.",
    accent: "from-violet-600 to-purple-500",
    iconBg: "from-violet-600 to-purple-500",
  },
  {
    icon: Search,
    number: "04",
    title: "Retrieve Relevant Context",
    description:
      "Qdrant semantic search retrieves the most relevant knowledge for every user question.",
    accent: "from-purple-600 to-violet-500",
    iconBg: "from-purple-600 to-violet-500",
  },
  {
    icon: Bot,
    number: "05",
    title: "Generate Grounded Answer",
    description:
      "Gemini uses retrieved enterprise context to generate accurate responses with source references.",
    accent: "from-violet-600 via-blue-600 to-cyan-500",
    iconBg: "from-violet-600 via-blue-600 to-cyan-500",
  },
];

export default function Workflow() {
  return (
    <section className="relative overflow-hidden bg-[#07111F] py-24 text-white lg:py-28">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-100px] h-[520px] w-[520px] rounded-full bg-blue-600/15 blur-[150px]" />

        <div className="absolute bottom-[-140px] right-[-140px] h-[520px] w-[520px] rounded-full bg-violet-600/15 blur-[150px]" />

        <div className="absolute left-[42%] top-[30%] h-[380px] w-[380px] rounded-full bg-cyan-500/5 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#0B1728] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur">
            <WorkflowIcon className="h-4 w-4" />
            Retrieval-Augmented Generation Pipeline
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl">
            From enterprise knowledge to
            <span className="block bg-linear-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              grounded AI answers.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Enterprise AI Operations Copilot combines ingestion, vector
            embeddings, semantic retrieval, and generative AI into one
            intelligent developer knowledge pipeline.
          </p>
        </div>

        {/* PIPELINE */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          {/* LEFT ARCHITECTURE SUMMARY */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Architecture
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    Enterprise RAG Engine
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                The platform turns repositories and documents into searchable
                vector knowledge and uses that retrieved context to generate
                grounded AI responses.
              </p>

              {/* FLOW VISUAL */}
              <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-5">
                <div className="space-y-3">
                  <ArchitectureNode
                    icon={Code2}
                    label="GitHub Repository"
                    sublabel="Source code"
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    border="border-blue-400/20"
                  />

                  <FlowLine />

                  <ArchitectureNode
                    icon={FileText}
                    label="Enterprise Documents"
                    sublabel="PDF • DOCX • PPTX"
                    color="text-cyan-400"
                    bg="bg-cyan-500/10"
                    border="border-cyan-400/20"
                  />

                  <FlowLine />

                  <ArchitectureNode
                    icon={Database}
                    label="Qdrant Vector Database"
                    sublabel="Semantic embeddings"
                    color="text-violet-400"
                    bg="bg-violet-500/10"
                    border="border-violet-400/20"
                  />

                  <FlowLine />

                  <ArchitectureNode
                    icon={Search}
                    label="Context Retrieval"
                    sublabel="Relevant knowledge"
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                    border="border-purple-400/20"
                  />

                  <FlowLine />

                  <ArchitectureNode
                    icon={Bot}
                    label="Gemini"
                    sublabel="Grounded generation"
                    color="text-cyan-300"
                    bg="bg-blue-500/10"
                    border="border-blue-400/20"
                  />
                </div>
              </div>

              {/* TECH STACK */}
              <div className="mt-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Core Technology
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Next.js",
                    "FastAPI",
                    "MongoDB",
                    "Qdrant",
                    "FastEmbed",
                    "Gemini",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PIPELINE STEPS */}
          <div>
            <div className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.number}>
                    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)] md:p-7">
                      {/* LEFT ACCENT */}
                      <div
                        className={`absolute bottom-0 left-0 top-0 w-[3px] bg-linear-to-b ${step.accent} opacity-50 transition-opacity group-hover:opacity-100`}
                      />

                      {/* SOFT GLOW */}
                      <div
                        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-linear-to-br ${step.accent} opacity-[0.05] blur-3xl transition group-hover:opacity-[0.10]`}
                      />

                      <div className="relative flex gap-5">
                        {/* ICON */}
                        <div
                          className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${step.iconBg} shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-105`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        {/* CONTENT */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                Pipeline Step
                              </p>

                              <h3 className="mt-1 text-lg font-bold text-white md:text-xl">
                                {step.title}
                              </h3>
                            </div>

                            <span className="text-2xl font-black text-white/[0.08]">
                              {step.number}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-7 text-slate-400">
                            {step.description}
                          </p>

                          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Automated knowledge pipeline
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ARROW */}
                    {index < steps.length - 1 && (
                      <div className="ml-[26px] flex h-7 items-center">
                        <div className="h-full w-px bg-linear-to-b from-blue-500/50 to-violet-500/20" />

                        <ArrowDown className="-ml-[8px] mt-5 h-4 w-4 text-violet-400/70" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FINAL OUTPUT */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-emerald-400/15 bg-linear-to-r from-emerald-500/[0.07] via-blue-500/[0.07] to-violet-500/[0.07] p-8 backdrop-blur-xl md:p-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                  Final Output
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-black tracking-tight text-white md:text-3xl">
                Answers backed by your
                <span className="bg-linear-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  {" "}enterprise knowledge.
                </span>
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Instead of returning generic LLM responses, the platform
                retrieves relevant enterprise context and provides grounded
                answers with verifiable source references.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.07] px-5 py-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />

              <div>
                <p className="text-sm font-bold text-white">
                  Grounded Response
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Context + Sources + AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* SMALL REUSABLE COMPONENTS */

function ArchitectureNode({
  icon: Icon,
  label,
  sublabel,
  color,
  bg,
  border,
}: {
  icon: ElementType;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border ${border} ${bg} px-3 py-3`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/15">
        <Icon className={`h-4 w-4 ${color}`} />
      </div>

      <div>
        <p className="text-xs font-bold text-white">{label}</p>
        <p className="mt-0.5 text-[10px] text-slate-500">{sublabel}</p>
      </div>
    </div>
  );
}

function FlowLine() {
  return (
    <div className="flex justify-center">
      <div className="h-4 w-px bg-linear-to-b from-blue-400/50 to-violet-400/30" />
    </div>
  );
}