// "use client";

// import Link from "next/link";
// import { FolderGit2, Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();

//   function openGitHubAgent() {
//     const token = localStorage.getItem("access_token");

//     if (!token) {
//       router.push("/login?redirect=/repositories");
//       return;
//     }

//     router.push("/repositories");
//   }

//   function connectRepository() {
//     const token = localStorage.getItem("access_token");

//     if (!token) {
//       router.push("/login?redirect=/repositories");
//       return;
//     }

//     router.push("/repositories");
//   }

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <FolderGit2 className="h-7 w-7 text-blue-600" />

//           <span className="text-lg font-bold text-slate-800">
//             Enterprise AI Copilot
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden items-center gap-8 md:flex">
//           <Link
//             href="/"
//             className="transition hover:text-blue-600"
//           >
//             Home
//           </Link>

//           <Link
//             href="/documents"
//             className="transition hover:text-blue-600"
//           >
//             Documents
//           </Link>

//           <button
//             type="button"
//             onClick={openGitHubAgent}
//             className="transition hover:text-blue-600"
//           >
//             GitHub Agent
//           </button>

//           <Link
//             href="/about"
//             className="transition hover:text-blue-600"
//           >
//             About
//           </Link>
//         </div>

//         {/* Desktop Buttons */}
//         <div className="hidden items-center gap-3 md:flex">
//           <Link href="/login">
//             <Button variant="outline">
//               Sign In
//             </Button>
//           </Link>

//           <Button
//             onClick={connectRepository}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             Connect Repository
//           </Button>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           type="button"
//           className="md:hidden"
//           onClick={() => setOpen(!open)}
//         >
//           <Menu />
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {open && (
//         <div className="border-t bg-white md:hidden">
//           <div className="flex flex-col gap-4 p-6">

//             <Link
//               href="/"
//               onClick={() => setOpen(false)}
//             >
//               Home
//             </Link>

//             <Link
//               href="/documents"
//               onClick={() => setOpen(false)}
//             >
//               Documents
//             </Link>

//             <button
//               type="button"
//               onClick={() => {
//                 setOpen(false);
//                 openGitHubAgent();
//               }}
//               className="text-left"
//             >
//               GitHub Agent
//             </button>

//             <Link
//               href="/about"
//               onClick={() => setOpen(false)}
//             >
//               About
//             </Link>

//             <Link
//               href="/login"
//               onClick={() => setOpen(false)}
//             >
//               <Button
//                 variant="outline"
//                 className="w-full"
//               >
//                 Sign In
//               </Button>
//             </Link>

//             <Button
//               onClick={() => {
//                 setOpen(false);
//                 connectRepository();
//               }}
//               className="w-full bg-blue-600 hover:bg-blue-700"
//             >
//               Connect Repository
//             </Button>

//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  Code2,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function openProtectedRoute(path: string) {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push(`/login?redirect=${path}`);
      return;
    }

    router.push(path);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
            <Bot className="h-5 w-5 text-white" />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-black tracking-tight text-slate-950">
              Enterprise AI
            </p>

            <p className="text-[11px] font-medium text-slate-500">
              Operations Copilot
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Home
          </Link>

          <button
            onClick={() => openProtectedRoute("/github")}
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            GitHub Agent
          </button>

          <button
            onClick={() => openProtectedRoute("/documents")}
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Documents
          </button>

          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Sign In
          </Link>

          <button
            onClick={() => openProtectedRoute("/github")}
            className="group flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/20"
          >
            <Code2 className="h-4 w-4" />

            Connect Repository

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200 bg-white/95 px-5 py-5 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-slate-700"
            >
              Home
            </Link>

            <button
              className="text-left text-sm font-medium text-slate-700"
              onClick={() => {
                setOpen(false);
                openProtectedRoute("/github");
              }}
            >
              GitHub Agent
            </button>

            <button
              className="text-left text-sm font-medium text-slate-700"
              onClick={() => {
                setOpen(false);
                openProtectedRoute("/documents");
              }}
            >
              Documents
            </button>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-slate-700"
            >
              About
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
            >
              Sign In
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                openProtectedRoute("/github");
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              <Code2 className="h-4 w-4" />
              Connect Repository
            </button>
          </div>
        </div>
      )}
    </header>
  );
}