// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import Link from "next/link";

// import { useRouter, useSearchParams } from "next/navigation";

// import {
//   Lock,
//   UserRound,
// } from "lucide-react";

// import AuthCard from "./AuthCard";
// import AuthHeader from "./AuthHeader";

// import useAuth from "@/hooks/useAuth";


// export default function LoginForm() {

//   const router = useRouter();
// const searchParams = useSearchParams();

// const redirect = searchParams.get("redirect") || "/dashboard";


//   const {
//     loginUser,
//     loading,
//   } = useAuth();


//   const [
//     agentId,
//     setAgentId,
//   ] = useState("");


//   const [
//     password,
//     setPassword,
//   ] = useState("");





//   useEffect(() => {

//     const token =
//       localStorage.getItem(
//         "access_token"
//       );


    
//     if (token) {

//       router.push(redirect);

//     }

//   }, [router]);





//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {

//     e.preventDefault();


//     try {

//       await loginUser({

//         agent_id:
//           agentId.trim(),

//         password:
//           password,

//       });

      

//     } catch (err: any) {

//       alert(
//         err.message ||
//           "Login failed"
//       );

//     }

//   };


//   return (

//     <AuthCard>

//       <AuthHeader
//         title="Enterprise AI"
//         subtitle="Sign in using your Agent ID"
//       />


//       <form
//         onSubmit={
//           handleSubmit
//         }
//         className="space-y-6"
//       >


//         {/* AGENT ID */}

//         <div>

//           <label className="text-sm font-medium">
//             Agent ID
//           </label>


//           <div className="mt-2 flex items-center rounded-xl border px-4">

//             <UserRound
//               className="text-slate-400"
//               size={18}
//             />


//             <input
//               type="text"
//               placeholder="EMP001"
//               value={
//                 agentId
//               }
//               onChange={(e) =>
//                 setAgentId(
//                   e.target.value
//                 )
//               }
//               className="w-full bg-transparent px-3 py-4 outline-none"
//               required
//             />

//           </div>

//         </div>


//         {/* PASSWORD */}

//         <div>

//           <label className="text-sm font-medium">
//             Password
//           </label>


//           <div className="mt-2 flex items-center rounded-xl border px-4">

//             <Lock
//               className="text-slate-400"
//               size={18}
//             />


//             <input
//               type="password"
//               placeholder="********"
//               value={
//                 password
//               }
//               onChange={(e) =>
//                 setPassword(
//                   e.target.value
//                 )
//               }
//               className="w-full bg-transparent px-3 py-4 outline-none"
//               required
//             />

//           </div>

//         </div>


//         {/* REMEMBER / FORGOT PASSWORD */}

//         <div className="flex items-center justify-between">

//           <label className="flex items-center gap-2 text-sm">

//             <input
//               type="checkbox"
//             />

//             Remember Me

//           </label>


//           <Link
//             href="/forgot-password"
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Forgot Password?
//           </Link>

//         </div>


//         {/* LOGIN BUTTON */}

//         <button
//           type="submit"
//           disabled={
//             loading
//           }
//           className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
//         >

//           {loading
//             ? "Signing In..."
//             : "Sign In"}

//         </button>


//         {/* REGISTER */}

//         <p className="text-center text-sm text-slate-500">

//           Don't have an account?{" "}

//           <Link
//             href="/register"
//             className="text-blue-600 hover:underline"
//           >
//             Register
//           </Link>

//         </p>

//       </form>

//     </AuthCard>

//   );
// }


"use client";

import {
  useState,
  type FormEvent,
  type ElementType,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  Eye,
  EyeOff,
  FileText,
  GitBranch,
  Loader2,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";

import useAuth from "@/hooks/useAuth";

export default function LoginForm() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const redirect =
    searchParams.get(
      "redirect"
    ) || "/dashboard";

  const {
    loginUser,
    loading,
  } = useAuth();

  const [
    employeeId,
    setEmployeeId,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    rememberMe,
    setRememberMe,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setError("");

  const cleanEmployeeId =
    employeeId.trim();

  if (!cleanEmployeeId) {
    setError(
      "Employee ID is required."
    );
    return;
  }

  if (!password) {
    setError(
      "Password is required."
    );
    return;
  }

  try {
    /*
     * Clear account-specific workspace state before
     * authenticating another user.
     *
     * Do NOT remove access_token here yet.
     * If login fails, the existing session is not
     * unnecessarily destroyed.
     */
    if (
      typeof window !==
      "undefined"
    ) {
      window.localStorage.removeItem(
        "selected_agent_id"
      );

      window.localStorage.removeItem(
        "selected_document_id"
      );

      window.localStorage.removeItem(
        "selected_repository_id"
      );
    }

    await loginUser({
      // Backend expects agent_id,
      // but UI correctly calls this Employee ID.
      agent_id:
        cleanEmployeeId,

      password,
    });

    /*
     * loginUser should overwrite access_token
     * with the newly authenticated user's JWT.
     */

    router.replace(
      redirect
    );
  } catch (err: any) {
    console.error(
      "LOGIN ERROR:",
      err
    );

    setError(
      err?.message ||
        "Unable to sign in. Please check your credentials."
    );
  }
}
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F8FC]">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[220px] top-[-200px] h-[600px] w-[600px] rounded-full bg-blue-300/[0.10] blur-[160px]" />

        <div className="absolute bottom-[-220px] right-[-150px] h-[560px] w-[560px] rounded-full bg-violet-300/[0.10] blur-[160px]" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* =====================================================
            LEFT PRODUCT PANEL
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#07111F] lg:flex lg:flex-col">
          {/* GLOWS */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-blue-600/20 blur-[130px]" />

            <div className="absolute bottom-[-180px] right-[-120px] h-[480px] w-[480px] rounded-full bg-violet-600/15 blur-[140px]" />

            <div className="absolute right-[10%] top-[30%] h-[280px] w-[280px] rounded-full bg-cyan-500/[0.06] blur-[110px]" />
          </div>

          {/* SUBTLE GRID */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",

              backgroundSize:
                "48px 48px",
            }}
          />

          <div className="relative flex h-full flex-col px-10 py-8 xl:px-14 xl:py-10">
            {/* BRAND */}
            <Link
              href="/"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-xl shadow-blue-500/20">
                <Bot className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-sm font-black tracking-tight text-white">
                  Enterprise AI
                </p>

                <p className="text-[10px] font-medium text-slate-500">
                  Operations Copilot
                </p>
              </div>
            </Link>

            {/* HERO */}
            <div className="my-auto max-w-[610px] py-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />

                Enterprise Intelligence Platform
              </div>

              <h1 className="mt-7 text-[42px] font-black leading-[1.08] tracking-[-0.045em] text-white xl:text-[50px]">
                Your organization&apos;s
                <span className="block bg-linear-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  knowledge, connected.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
                Search enterprise documents and source code, retrieve
                relevant context, and generate grounded answers from a
                unified AI workspace.
              </p>

              {/* PIPELINE */}
              <div className="mt-9 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">
                      Enterprise RAG Pipeline
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-300">
                      From knowledge to grounded answers
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2.5 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>

                    <span className="text-[8px] font-bold text-emerald-300">
                      ONLINE
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  <PipelineStep
                    icon={
                      FileText
                    }
                    label="Knowledge"
                  />

                  <PipelineStep
                    icon={
                      Database
                    }
                    label="Embeddings"
                  />

                  <PipelineStep
                    icon={
                      Sparkles
                    }
                    label="Retrieval"
                  />

                  <PipelineStep
                    icon={
                      MessageSquare
                    }
                    label="Answer"
                  />
                </div>
              </div>

              {/* FEATURES */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <ProductFeature
                  icon={
                    GitBranch
                  }
                  title="Repository Intelligence"
                  description="Understand source code with semantic retrieval."
                />

                <ProductFeature
                  icon={
                    FileText
                  }
                  title="Document RAG"
                  description="Ask grounded questions across enterprise files."
                />

                <ProductFeature
                  icon={
                    Database
                  }
                  title="Vector Search"
                  description="Retrieve relevant context from indexed knowledge."
                />

                <ProductFeature
                  icon={
                    ShieldCheck
                  }
                  title="Scoped Workspaces"
                  description="Keep enterprise knowledge organized by AI agent."
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
              <p className="text-[9px] text-slate-600">
                Enterprise AI Operations Copilot
              </p>

              <div className="flex items-center gap-2 text-[9px] font-medium text-slate-500">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />

                Secure workspace access
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT LOGIN PANEL
        ====================================================== */}

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[440px]">
            {/* MOBILE BRAND */}
            <Link
              href="/"
              className="mb-10 flex w-fit items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                <Bot className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  Enterprise AI
                </p>

                <p className="text-[9px] text-slate-400">
                  Operations Copilot
                </p>
              </div>
            </Link>

            {/* LOGIN HEADING */}
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                <UserRound className="h-5 w-5" />
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-[-0.035em] text-slate-950">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access your organization&apos;s AI knowledge
                workspace.
              </p>
            </div>

            {/* SECURITY INFO */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-bold text-emerald-800">
                  Secure organization access
                </p>

                <p className="mt-0.5 text-[9px] text-emerald-700/70">
                  Authenticate with your employee credentials.
                </p>
              </div>
            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7"
            >
              {/* EMPLOYEE ID */}
              <div>
                <label
                  htmlFor="employeeId"
                  className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                >
                  Employee ID
                </label>

                <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/50">
                  <UserRound className="h-4 w-4 shrink-0 text-slate-400" />

                  <input
                    id="employeeId"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. EMP001"
                    value={
                      employeeId
                    }
                    onChange={(
                      event
                    ) => {
                      setEmployeeId(
                        event.target.value
                      );

                      if (
                        error
                      ) {
                        setError("");
                      }
                    }}
                    disabled={
                      loading
                    }
                    className="w-full bg-transparent px-3 py-3.5 text-sm font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <p className="mt-1.5 text-[9px] text-slate-400">
                  Use the Employee ID assigned to your account.
                </p>
              </div>

              {/* PASSWORD */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold text-blue-600 transition hover:text-violet-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100/50">
                  <Lock className="h-4 w-4 shrink-0 text-slate-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={
                      password
                    }
                    onChange={(
                      event
                    ) => {
                      setPassword(
                        event.target.value
                      );

                      if (
                        error
                      ) {
                        setError("");
                      }
                    }}
                    disabled={
                      loading
                    }
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (
                          previous
                        ) =>
                          !previous
                      )
                    }
                    disabled={
                      loading
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="mt-4 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={
                      rememberMe
                    }
                    onChange={(
                      event
                    ) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  />

                  Remember me
                </label>

                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />

                  Protected session
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                  <div>
                    <p className="text-[10px] font-bold text-red-700">
                      Sign in failed
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !employeeId.trim() ||
                  !password
                }
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Workspace

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* REGISTER */}
              <p className="mt-6 text-center text-xs text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-blue-600 transition hover:text-violet-600"
                >
                  Create account
                </Link>
              </p>
            </form>

            {/* BOTTOM */}
            <div className="mt-8 border-t border-slate-200 pt-5">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <LoginTrustItem text="JWT Authentication" />

                <LoginTrustItem text="Scoped Access" />

                <LoginTrustItem text="RAG Grounding" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


function PipelineStep({
  icon: Icon,
  label,
}: {
  icon:
    ElementType;

  label:
    string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] px-2 py-3 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <p className="mt-2 truncate text-[8px] font-semibold text-slate-400">
        {label}
      </p>
    </div>
  );
}



function ProductFeature({
  icon: Icon,
  title,
  description,
}: {
  icon:
    ElementType;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-blue-300">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <p className="mt-3 text-[10px] font-bold text-slate-200">
        {title}
      </p>

      <p className="mt-1 text-[9px] leading-4 text-slate-500">
        {description}
      </p>
    </div>
  );
}



function LoginTrustItem({
  text,
}: {
  text:
    string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
      <CheckCircle2 className="h-3 w-3 text-emerald-500" />

      {text}
    </span>
  );
}