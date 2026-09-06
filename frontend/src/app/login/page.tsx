// import { Suspense } from "react";
// import LoginForm from "@/components/auth/LoginForm";

// export default function LoginPage() {
//   return (
//     <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4 py-8">
//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center">
//             <div className="text-center">
//               <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

//               <p className="mt-4 text-sm text-slate-500">
//                 Loading...
//               </p>
//             </div>
//           </div>
//         }
//       >
//         <LoginForm />
//       </Suspense>
//     </main>
//   );
// }

import {
  Suspense,
} from "react";

import {
  Bot,
  Loader2,
} from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#F6F8FC]">
      <Suspense
        fallback={
          <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-[140px]" />

              <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-300/10 blur-[130px]" />
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-xl shadow-blue-500/20">
                <Bot className="h-6 w-6 text-white" />
              </div>

              <Loader2 className="mx-auto mt-5 h-5 w-5 animate-spin text-blue-600" />

              <p className="mt-3 text-sm font-bold text-slate-700">
                Loading Enterprise AI
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Preparing your secure workspace...
              </p>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}