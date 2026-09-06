// "use client";

// import { motion } from "framer-motion";
// import {
//   FolderGit2,
//   Search,
//   FileCode2,
// } from "lucide-react";

// const features = [
//   {
//     icon: FolderGit2,
//     title: "GitHub Repository Analysis",
//     description:
//       "Connect your GitHub repository and let AI analyze the project structure, folders, files, and architecture automatically.",
//   },
//   {
//     icon: Search,
//     title: "AI Code Search",
//     description:
//       "Ask questions in natural language and instantly find relevant code, APIs, classes, and business logic.",
//   },
//   {
//     icon: FileCode2,
//     title: "Source References",
//     description:
//       "Every AI response includes file paths and source references, making answers reliable and easy to verify.",
//   },
// ];

// export default function Features() {
//   return (
//     <section className="bg-white py-24">
//       <div className="mx-auto max-w-7xl px-6">

        
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="mx-auto max-w-3xl text-center"
//         >
//           <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
//             Features
//           </span>

//           <h2 className="mt-6 text-4xl font-bold text-slate-900">
//             Everything You Need to Understand Any Repository
//           </h2>

//           <p className="mt-5 text-lg text-slate-600">
//             Enterprise AI Operations Copilot helps interns and developers
//             understand large codebases quickly using AI-powered repository
//             analysis and intelligent code search.
//           </p>
//         </motion.div>

        
//         <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//           {features.map((feature, index) => {
//             const Icon = feature.icon;

//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{
//                   duration: 0.5,
//                   delay: index * 0.2,
//                 }}
//                 viewport={{ once: true }}
//                 className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
//               >
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
//                   <Icon className="h-7 w-7 text-blue-600" />
//                 </div>

//                 <h3 className="mt-6 text-xl font-semibold text-slate-900">
//                   {feature.title}
//                 </h3>

//                 <p className="mt-4 leading-7 text-slate-600">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Code2,
  Database,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Repository Intelligence",
    description:
      "Connect GitHub repositories and automatically understand files, modules, APIs, dependencies, and project architecture.",
    iconBackground: "bg-blue-50",
    iconColor: "text-blue-600",
    gradient: "from-blue-600 to-cyan-500",
    hoverBorder: "hover:border-blue-300",
  },
  {
    icon: Search,
    title: "Semantic Code Search",
    description:
      "Ask questions in natural language and retrieve the most relevant code using intelligent vector search.",
    iconBackground: "bg-violet-50",
    iconColor: "text-violet-600",
    gradient: "from-violet-600 to-purple-500",
    hoverBorder: "hover:border-violet-300",
  },
  {
    icon: FileText,
    title: "Enterprise Document RAG",
    description:
      "Transform PDFs, DOCX and PPTX files into searchable enterprise knowledge for grounded AI responses.",
    iconBackground: "bg-cyan-50",
    iconColor: "text-cyan-600",
    gradient: "from-cyan-600 to-blue-500",
    hoverBorder: "hover:border-cyan-300",
  },
  {
    icon: Bot,
    title: "Grounded AI Assistant",
    description:
      "Generate context-aware answers using retrieved enterprise knowledge instead of relying only on model memory.",
    iconBackground: "bg-purple-50",
    iconColor: "text-purple-600",
    gradient: "from-purple-600 to-violet-500",
    hoverBorder: "hover:border-purple-300",
  },
  {
    icon: Database,
    title: "Persistent Knowledge",
    description:
      "MongoDB stores workspace data while Qdrant provides fast vector retrieval across indexed enterprise knowledge.",
    iconBackground: "bg-emerald-50",
    iconColor: "text-emerald-600",
    gradient: "from-emerald-600 to-cyan-500",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    icon: ShieldCheck,
    title: "Secure AI Workspaces",
    description:
      "JWT authentication and agent-scoped knowledge keep enterprise repositories, documents, and conversations organized.",
    iconBackground: "bg-blue-50",
    iconColor: "text-blue-600",
    gradient: "from-blue-600 via-violet-600 to-cyan-500",
    hoverBorder: "hover:border-blue-300",
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-[#F7F9FC] py-24 lg:py-28">
      {/* PREMIUM BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        {/* Technical grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Blue glow */}
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[130px]" />

        {/* Violet glow */}
        <div className="absolute right-[-150px] top-[20%] h-[500px] w-[500px] rounded-full bg-violet-400/10 blur-[140px]" />

        {/* Cyan glow */}
        <div className="absolute bottom-[-180px] left-[35%] h-[450px] w-[450px] rounded-full bg-cyan-300/10 blur-[130px]" />

        {/* White center glow */}
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-white/70 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* SECTION HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm backdrop-blur-xl">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-violet-100">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            </div>

            Platform Capabilities
          </div>

          {/* TITLE */}
          <h2 className="mt-6 text-4xl font-black tracking-[-0.035em] text-slate-950 sm:text-5xl">
            Everything your team needs for
            <span className="block bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              intelligent knowledge.
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Bring repositories, enterprise documents, semantic retrieval,
            and generative AI together in one secure developer workspace.
          </p>
        </motion.div>

        {/* FEATURE GRID */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                }}
                className={`group relative overflow-hidden rounded-3xl border border-white/90 bg-white/80 p-7 shadow-[0_8px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${feature.hoverBorder} hover:bg-white hover:shadow-[0_22px_55px_rgba(37,99,235,0.12)]`}
              >
                {/* TOP GRADIENT ACCENT */}
                <div
                  className={`absolute inset-x-0 top-0 h-[3px] bg-linear-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                {/* SOFT INTERNAL GLOW */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-linear-to-br ${feature.gradient} opacity-[0.04] blur-3xl transition-opacity duration-300 group-hover:opacity-[0.10]`}
                />

                {/* ICON AND ARROW */}
                <div className="relative flex items-start justify-between">
                  <div
                    className={`flex h-13 w-13 items-center justify-center rounded-2xl ${feature.iconBackground} shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:scale-110`}
                  >
                    <Icon
                      className={`h-6 w-6 ${feature.iconColor}`}
                    />
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-300 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="relative">
                  <h3 className="mt-7 text-xl font-bold tracking-tight text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>

                {/* BOTTOM DECORATION */}
                <div className="relative mt-7 flex items-center gap-2">
                  <div
                    className={`h-1.5 w-9 rounded-full bg-linear-to-r ${feature.gradient}`}
                  />

                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />

                  <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ENTERPRISE KNOWLEDGE BANNER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.55,
          }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-slate-800 bg-[#07111F] p-8 shadow-[0_30px_70px_rgba(15,23,42,0.20)] md:p-10"
        >
          {/* DARK BACKGROUND EFFECTS */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />

            <div className="absolute -right-20 bottom-[-100px] h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />

            <div className="absolute left-[45%] top-[-100px] h-60 w-60 rounded-full bg-cyan-500/10 blur-[90px]" />

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative flex flex-col gap-9 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Enterprise Knowledge Layer
                </p>
              </div>

              <h3 className="mt-4 text-2xl font-black tracking-tight text-white md:text-3xl">
                One workspace. Multiple knowledge sources.
                <span className="text-slate-400">
                  {" "}
                  Grounded answers.
                </span>
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                Connect engineering knowledge across source code and
                enterprise documents while keeping AI responses grounded
                in retrieved context.
              </p>
            </div>

            {/* TECHNOLOGIES */}
            <div className="flex max-w-md flex-wrap gap-2">
              {[
                "GitHub",
                "PDF",
                "DOCX",
                "PPTX",
                "MongoDB",
                "Qdrant",
                "Gemini",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs font-semibold text-slate-300 backdrop-blur transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}