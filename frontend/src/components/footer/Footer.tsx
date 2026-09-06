// import Link from "next/link";
// import {
//   Mail,
//   FolderGit2
  
// } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="border-t bg-slate-950 text-slate-300">
//       <div className="mx-auto max-w-7xl px-6 py-16">

//         <div className="grid gap-12 md:grid-cols-4">

//           {/* Logo */}
//           <div>
//             <h2 className="text-2xl font-bold text-white">
//               Enterprise AI
//             </h2>

//             <p className="mt-4 text-sm leading-7 text-slate-400">
//               AI-powered Enterprise Operations Copilot that helps developers
//               understand GitHub repositories using Retrieval-Augmented
//               Generation (RAG) and Large Language Models.
//             </p>
//           </div>

          
//           <div>
//             <h3 className="mb-5 text-lg font-semibold text-white">
//               Navigation
//             </h3>

//             <ul className="space-y-3">

//               <li>
//                 <Link href="/" className="hover:text-blue-400">
//                   Home
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/documents"
//                   className="hover:text-blue-400"
//                 >
//                   Documents
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/github-agent"
//                   className="hover:text-blue-400"
//                 >
//                   GitHub Agent
//                 </Link>
//               </li>

//               <li>
//                 <Link href="/about" className="hover:text-blue-400">
//                   About
//                 </Link>
//               </li>

//             </ul>
//           </div>

          
//           <div>
//             <h3 className="mb-5 text-lg font-semibold text-white">
//               Features
//             </h3>

//             <ul className="space-y-3">

//               <li>GitHub Repository Analysis</li>

//               <li>AI Code Search</li>

//               <li>Source References</li>

//               <li>Vector Search</li>

//               <li>RAG Pipeline</li>

//             </ul>
//           </div>

         
//           <div>
//             <h3 className="mb-5 text-lg font-semibold text-white">
//               Contact
//             </h3>

//             <div className="space-y-4">

//               <div className="flex items-center gap-3">
//                 <Mail size={18} />
//                 <span>support@enterpriseai.com</span>
//               </div>

//               <div className="flex gap-4 pt-3">

//                 <a href="#" className="hover:text-blue-400">
//                   <FolderGit2 />
//                 </a>

//                 <a href="#" className="hover:text-blue-400">
//                   <span>LinkedIN</span>
//                 </a>

//               </div>

//             </div>
//           </div>

//         </div>

//         <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
//           © {new Date().getFullYear()} Enterprise AI Operations Copilot.
//           All Rights Reserved.
//         </div>

//       </div>
//     </footer>
//   );
// }
import type { ElementType } from "react";
import Link from "next/link";
import {
  Bot,
  Code2,
  Database,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 bottom-[-120px] h-[400px] w-[400px] rounded-full bg-blue-300/10 blur-[120px]" />

        <div className="absolute -right-40 top-[-100px] h-[400px] w-[400px] rounded-full bg-violet-300/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                <Bot className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="font-black tracking-tight text-slate-950">
                  Enterprise AI
                </p>

                <p className="text-xs font-medium text-slate-500">
                  Operations Copilot
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              An enterprise developer intelligence platform connecting
              repositories, documents, retrieval systems, and grounded AI
              into one secure knowledge workspace.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["GitHub", "MongoDB", "Qdrant", "Gemini"].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <p className="text-sm font-bold text-slate-950">
              Product
            </p>

            <div className="mt-5 space-y-3 text-sm text-slate-500">
              <Link
                href="/dashboard"
                className="block transition hover:text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                href="/github"
                className="block transition hover:text-blue-600"
              >
                GitHub Agent
              </Link>

              <Link
                href="/documents"
                className="block transition hover:text-blue-600"
              >
                Documents
              </Link>

              <Link
                href="/about"
                className="block transition hover:text-blue-600"
              >
                About
              </Link>
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <p className="text-sm font-bold text-slate-950">
              Platform
            </p>

            <div className="mt-5 space-y-4">
              <FooterItem
                icon={Code2}
                title="Repository Intelligence"
              />

              <FooterItem
                icon={FileText}
                title="Document RAG"
              />

              <FooterItem
                icon={Database}
                title="Vector Retrieval"
              />

              <FooterItem
                icon={ShieldCheck}
                title="Secure Workspaces"
              />
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-14 border-t border-slate-200 pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              © 2026 Enterprise AI Operations Copilot. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              Built for enterprise developer intelligence
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterItem({
  icon: Icon,
  title,
}: {
  icon: ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>

      <span>{title}</span>
    </div>
  );
}