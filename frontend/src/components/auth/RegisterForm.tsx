
// "use client";

// import {
//   FormEvent,
//   useState,
// } from "react";

// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import {
//   User,
//   Mail,
//   Lock,
//   BadgeCheck,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// import AuthCard from "./AuthCard";
// import AuthHeader from "./AuthHeader";

// import {
//   registerUser,
// } from "@/services/auth";


// export default function RegisterForm() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     agent_id: "",
//     role: "developer",
//     password: "",
//     confirmPassword: "",
//   });

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [success, setSuccess] =
//     useState("");

//   const [popup, setPopup] =
//     useState<{
//       type: "success" | "error";
//       message: string;
//     } | null>(null);


//   function handleChange(
//     event:
//       React.ChangeEvent<
//         HTMLInputElement |
//         HTMLSelectElement
//       >
//   ) {
//     const {
//       name,
//       value,
//     } = event.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   }


//   function showPopup(
//     type: "success" | "error",
//     message: string
//   ) {
//     setPopup({
//       type,
//       message,
//     });

//     setTimeout(() => {
//       setPopup(null);
//     }, 3000);
//   }


//   async function handleSubmit(
//     event: FormEvent<HTMLFormElement>
//   ) {
//     event.preventDefault();

//     setError("");
//     setSuccess("");

//     if (
//       !form.name.trim() ||
//       !form.email.trim() ||
//       !form.agent_id.trim() ||
//       !form.password.trim()
//     ) {
//       const message =
//         "Please fill all required fields.";

//       setError(message);
//       showPopup(
//         "error",
//         message
//       );

//       return;
//     }


//     if (
//       form.password !==
//       form.confirmPassword
//     ) {
//       const message =
//         "Passwords do not match.";

//       setError(message);

//       showPopup(
//         "error",
//         message
//       );

//       return;
//     }


//     if (
//       form.password.length < 6
//     ) {
//       const message =
//         "Password must be at least 6 characters.";

//       setError(message);

//       showPopup(
//         "error",
//         message
//       );

//       return;
//     }


//     try {
//       setLoading(true);

//       await registerUser({
//         name: form.name.trim(),

//         email:
//           form.email
//             .trim()
//             .toLowerCase(),

//         agent_id:
//           form.agent_id.trim(),

//         role:
//           form.role,

//         password:
//           form.password,
//       });


//       const message =
//         "Registration successful! Redirecting to login...";

//       setSuccess(message);

//       showPopup(
//         "success",
//         message
//       );


//       setForm({
//         name: "",
//         email: "",
//         agent_id: "",
//         role: "developer",
//         password: "",
//         confirmPassword: "",
//       });


//       setTimeout(() => {
//         router.push(
//           "/login"
//         );
//       }, 1800);

//     } catch (error: any) {

//       console.error(
//         "REGISTER FORM ERROR:",
//         error
//       );

//       const message =
//         error.message ||
//         "Registration failed.";

//       setError(message);

//       showPopup(
//         "error",
//         message
//       );

//     } finally {
//       setLoading(false);
//     }
//   }


//   return (
//     <>
//       {/* POPUP */}

//       {popup && (
//         <div className="fixed right-5 top-5 z-[9999]">

//           <div
//             className={
//               popup.type === "success"
//                 ? "flex min-w-[320px] items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl"
//                 : "flex min-w-[320px] items-center gap-3 rounded-xl border border-red-200 bg-white px-5 py-4 shadow-xl"
//             }
//           >

//             {popup.type ===
//             "success" ? (
//               <CheckCircle2
//                 size={24}
//                 className="text-green-600"
//               />
//             ) : (
//               <XCircle
//                 size={24}
//                 className="text-red-600"
//               />
//             )}


//             <div className="flex-1">

//               <p
//                 className={
//                   popup.type ===
//                   "success"
//                     ? "font-semibold text-green-700"
//                     : "font-semibold text-red-700"
//                 }
//               >
//                 {popup.type ===
//                 "success"
//                   ? "Success"
//                   : "Error"}
//               </p>

//               <p className="mt-1 text-sm text-slate-600">
//                 {popup.message}
//               </p>

//             </div>


//             <button
//               type="button"
//               onClick={() =>
//                 setPopup(null)
//               }
//               className="text-xl text-slate-400 hover:text-slate-700"
//             >
//               ×
//             </button>

//           </div>

//         </div>
//       )}


//       <AuthCard>

//         <AuthHeader
//           title="Create Account"
//           subtitle="Register to access Enterprise AI Copilot"
//         />


//         <form
//           onSubmit={handleSubmit}
//           className="mt-8 space-y-5"
//         >

//           {/* NAME */}

//           <div>

//             <label
//               htmlFor="name"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Full Name
//             </label>

//             <div className="relative">

//               <User
//                 size={18}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={form.name}
//                 onChange={
//                   handleChange
//                 }
//                 placeholder="Enter your name"
//                 disabled={loading}
//                 autoComplete="name"
//                 className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//               />

//             </div>

//           </div>


//           {/* EMAIL */}

//           <div>

//             <label
//               htmlFor="email"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Email
//             </label>

//             <div className="relative">

//               <Mail
//                 size={18}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={
//                   handleChange
//                 }
//                 placeholder="Enter your email"
//                 disabled={loading}
//                 autoComplete="email"
//                 className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//               />

//             </div>

//           </div>


//           {/* AGENT ID */}

//           <div>

//             <label
//               htmlFor="agent_id"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Agent ID
//             </label>

//             <div className="relative">

//               <BadgeCheck
//                 size={18}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 id="agent_id"
//                 name="agent_id"
//                 type="text"
//                 value={
//                   form.agent_id
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 placeholder="EMP001"
//                 disabled={loading}
//                 className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//               />

//             </div>

//           </div>


//           {/* ROLE */}

//           <div>

//             <label
//               htmlFor="role"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Role
//             </label>

//             <select
//               id="role"
//               name="role"
//               value={form.role}
//               onChange={
//                 handleChange
//               }
//               disabled={loading}
//               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//             >
//               <option value="developer">
//                 Developer
//               </option>

//               <option value="admin">
//                 Admin
//               </option>

//               <option value="manager">
//                 Manager
//               </option>

//               <option value="member">
//                 Member
//               </option>
//             </select>

//           </div>


//           {/* PASSWORD */}

//           <div>

//             <label
//               htmlFor="password"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Password
//             </label>

//             <div className="relative">

//               <Lock
//                 size={18}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={
//                   form.password
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 placeholder="Enter password"
//                 disabled={loading}
//                 autoComplete="new-password"
//                 className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//               />

//             </div>

//           </div>


//           {/* CONFIRM PASSWORD */}

//           <div>

//             <label
//               htmlFor="confirmPassword"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Confirm Password
//             </label>

//             <div className="relative">

//               <Lock
//                 size={18}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 value={
//                   form.confirmPassword
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 placeholder="Confirm password"
//                 disabled={loading}
//                 autoComplete="new-password"
//                 className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//               />

//             </div>

//           </div>


//           {/* INLINE ERROR */}

//           {error && (
//             <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//               {error}
//             </div>
//           )}


//           {/* INLINE SUCCESS */}

//           {success && (
//             <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//               {success}
//             </div>
//           )}


//           {/* BUTTON */}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {loading
//               ? "Creating account..."
//               : "Register"}
//           </button>


//           <p className="text-center text-sm text-slate-500">

//             Already have an account?{" "}

//             <Link
//               href="/login"
//               className="font-semibold text-blue-600 hover:text-blue-700"
//             >
//               Login
//             </Link>

//           </p>

//         </form>

//       </AuthCard>
//     </>
//   );
// }


"use client";

import {
  useState,
  type ChangeEvent,
  type ElementType,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Check,
  CheckCircle2,
  Code2,
  Database,
  Eye,
  EyeOff,
  FileText,
  GitBranch,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  registerUser,
} from "@/services/auth";

export default function RegisterForm() {
  const router =
    useRouter();

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    email: "",
    agent_id: "",
    role: "developer",
    password: "",
    confirmPassword: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    popup,
    setPopup,
  ] = useState<{
    type:
      | "success"
      | "error";

    message:
      string;
  } | null>(
    null
  );

  // =========================================================
  // FORM CHANGE
  // =========================================================

  function handleChange(
    event:
      ChangeEvent<
        | HTMLInputElement
        | HTMLSelectElement
      >
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (
        previous
      ) => ({
        ...previous,
        [name]:
          value,
      })
    );

    if (error) {
      setError("");
    }
  }

  // =========================================================
  // POPUP
  // =========================================================

  function showPopup(
    type:
      | "success"
      | "error",

    message:
      string
  ) {
    setPopup({
      type,
      message,
    });

    setTimeout(() => {
      setPopup(null);
    }, 3000);
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.agent_id.trim() ||
      !form.password.trim()
    ) {
      const message =
        "Please fill all required fields.";

      setError(
        message
      );

      showPopup(
        "error",
        message
      );

      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      const message =
        "Passwords do not match.";

      setError(
        message
      );

      showPopup(
        "error",
        message
      );

      return;
    }

    if (
      form.password.length <
      6
    ) {
      const message =
        "Password must be at least 6 characters.";

      setError(
        message
      );

      showPopup(
        "error",
        message
      );

      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name:
          form.name.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        // Backend field remains agent_id.
        // In the UI this represents Employee ID.
        agent_id:
          form.agent_id.trim(),

        role:
          form.role,

        password:
          form.password,
      });

      const message =
        "Account created successfully. Redirecting to sign in...";

      setSuccess(
        message
      );

      showPopup(
        "success",
        message
      );

      setForm({
        name: "",
        email: "",
        agent_id: "",
        role: "developer",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push(
          "/login"
        );
      }, 1800);
    } catch (
      error: any
    ) {
      console.error(
        "REGISTER FORM ERROR:",
        error
      );

      const message =
        error?.message ||
        "Registration failed.";

      setError(
        message
      );

      showPopup(
        "error",
        message
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // PASSWORD STATE
  // =========================================================

  const passwordHasMinimumLength =
    form.password.length >=
    6;

  const passwordsMatch =
    form.confirmPassword.length >
      0 &&
    form.password ===
      form.confirmPassword;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F8FC]">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[220px] top-[-200px] h-[600px] w-[600px] rounded-full bg-blue-300/[0.10] blur-[160px]" />

        <div className="absolute bottom-[-220px] right-[-150px] h-[560px] w-[560px] rounded-full bg-violet-300/[0.10] blur-[160px]" />
      </div>

      {/* =====================================================
          POPUP
      ====================================================== */}

      {popup && (
        <div className="fixed right-5 top-5 z-[9999]">
          <div
            className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-2xl border bg-white px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.14)] ${
              popup.type ===
              "success"
                ? "border-emerald-200"
                : "border-red-200"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                popup.type ===
                "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {popup.type ===
              "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-black ${
                  popup.type ===
                  "success"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {popup.type ===
                "success"
                  ? "Account created"
                  : "Registration failed"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {
                  popup.message
                }
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setPopup(
                  null
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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

          {/* TECHNICAL GRID */}

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
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />

                Enterprise Knowledge Platform
              </div>

              <h1 className="mt-7 text-[42px] font-black leading-[1.08] tracking-[-0.045em] text-white xl:text-[50px]">
                Build your
                <span className="block bg-linear-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  AI knowledge workspace.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
                Connect enterprise documents and source code, retrieve
                relevant context, and collaborate through grounded AI
                workspaces.
              </p>

              {/* PLATFORM PREVIEW */}

              <div className="mt-9 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">
                      Unified Knowledge Layer
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-300">
                      Enterprise context in one workspace
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[8px] font-bold text-emerald-300">
                      READY
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <PlatformCard
                    icon={
                      FileText
                    }
                    title="Documents"
                    text="Enterprise knowledge"
                  />

                  <PlatformCard
                    icon={
                      GitBranch
                    }
                    title="Repositories"
                    text="Source-code context"
                  />

                  <PlatformCard
                    icon={
                      Database
                    }
                    title="Vector Search"
                    text="Semantic retrieval"
                  />

                  <PlatformCard
                    icon={
                      MessageSquare
                    }
                    title="AI Chat"
                    text="Grounded answers"
                  />
                </div>
              </div>

              {/* BENEFITS */}

              <div className="mt-7 space-y-3">
                <BenefitItem
                  text="Shared organization AI workspaces"
                />

                <BenefitItem
                  text="Document and repository intelligence"
                />

                <BenefitItem
                  text="Source-grounded enterprise answers"
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

                Secure organization access
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT REGISTRATION
        ====================================================== */}

        <section className="relative flex min-h-screen items-center justify-center overflow-y-auto px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[480px]">
            {/* MOBILE BRAND */}

            <Link
              href="/"
              className="mb-8 flex w-fit items-center gap-3 lg:hidden"
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

            {/* HEADING */}

            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600">
                <User className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-[-0.035em] text-slate-950">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join your organization&apos;s Enterprise AI workspace.
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7"
            >
              {/* NAME + EMAIL */}

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="name"
                  label="Full Name"
                  icon={
                    User
                  }
                >
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Your name"
                    disabled={
                      loading
                    }
                    autoComplete="name"
                    required
                    className="w-full bg-transparent px-3 py-3.5 text-xs font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                  />
                </FormField>

                <FormField
                  id="email"
                  label="Work Email"
                  icon={
                    Mail
                  }
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@company.com"
                    disabled={
                      loading
                    }
                    autoComplete="email"
                    required
                    className="w-full bg-transparent px-3 py-3.5 text-xs font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                  />
                </FormField>
              </div>

              {/* EMPLOYEE ID + ROLE */}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FormField
                  id="agent_id"
                  label="Employee ID"
                  icon={
                    BadgeCheck
                  }
                >
                  <input
                    id="agent_id"
                    name="agent_id"
                    type="text"
                    value={
                      form.agent_id
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="EMP001"
                    disabled={
                      loading
                    }
                    autoComplete="username"
                    required
                    className="w-full bg-transparent px-3 py-3.5 text-xs font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                  />
                </FormField>

                <div>
                  <label
                    htmlFor="role"
                    className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Organization Role
                  </label>

                  <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/50">
                    <Users className="h-4 w-4 shrink-0 text-slate-400" />

                    <select
                      id="role"
                      name="role"
                      value={
                        form.role
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        loading
                      }
                      className="w-full cursor-pointer bg-transparent px-3 py-3.5 text-xs font-medium text-slate-700 outline-none"
                    >
                      <option value="developer">
                        Developer
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                      <option value="manager">
                        Manager
                      </option>

                      <option value="member">
                        Member
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <p className="mt-2 text-[9px] leading-4 text-slate-400">
                Employee ID is your login identifier, for example EMP001.
                Shared AI workspace IDs are created separately after login.
              </p>

              {/* PASSWORD */}

              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                >
                  Password
                </label>

                <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100/50">
                  <Lock className="h-4 w-4 shrink-0 text-slate-400" />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Create a password"
                    disabled={
                      loading
                    }
                    autoComplete="new-password"
                    required
                    className="w-full bg-transparent px-3 py-3.5 text-xs text-slate-800 outline-none placeholder:text-slate-400"
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
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mt-4">
                <label
                  htmlFor="confirmPassword"
                  className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                >
                  Confirm Password
                </label>

                <div
                  className={`mt-2 flex items-center rounded-xl border bg-white px-4 shadow-sm transition focus-within:ring-4 ${
                    form.confirmPassword &&
                    !passwordsMatch
                      ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100/50"
                      : passwordsMatch
                        ? "border-emerald-300 focus-within:border-emerald-400 focus-within:ring-emerald-100/50"
                        : "border-slate-200 focus-within:border-violet-400 focus-within:ring-violet-100/50"
                  }`}
                >
                  <Lock className="h-4 w-4 shrink-0 text-slate-400" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Repeat your password"
                    disabled={
                      loading
                    }
                    autoComplete="new-password"
                    required
                    className="w-full bg-transparent px-3 py-3.5 text-xs text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (
                          previous
                        ) =>
                          !previous
                      )
                    }
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* PASSWORD REQUIREMENTS */}

              {form.password && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <PasswordRequirement
                    valid={
                      passwordHasMinimumLength
                    }
                    text="6+ characters"
                  />

                  {form.confirmPassword && (
                    <PasswordRequirement
                      valid={
                        passwordsMatch
                      }
                      text={
                        passwordsMatch
                          ? "Passwords match"
                          : "Passwords do not match"
                      }
                    />
                  )}
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                  <div>
                    <p className="text-[10px] font-bold text-red-700">
                      Registration failed
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-[10px] font-bold text-emerald-700">
                      Account created
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-emerald-600">
                      {success}
                    </p>
                  </div>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !form.name.trim() ||
                  !form.email.trim() ||
                  !form.agent_id.trim() ||
                  !form.password ||
                  !form.confirmPassword
                }
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Creating account...
                  </>
                ) : (
                  <>
                    Create Enterprise Account

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* LOGIN */}

              <p className="mt-6 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-blue-600 transition hover:text-violet-600"
                >
                  Sign in
                </Link>
              </p>
            </form>

            {/* TRUST */}

            <div className="mt-7 border-t border-slate-200 pt-5">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <TrustItem text="Secure Access" />

                <TrustItem text="Shared Workspaces" />

                <TrustItem text="Grounded AI" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}



function FormField({
  id,
  label,
  icon: Icon,
  children,
}: {
  id:
    string;

  label:
    string;

  icon:
    ElementType;

  children:
    React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={
          id
        }
        className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
      >
        {label}
      </label>

      <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/50">
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />

        {children}
      </div>
    </div>
  );
}



function PlatformCard({
  icon: Icon,
  title,
  text,
}: {
  icon:
    ElementType;

  title:
    string;

  text:
    string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold text-slate-200">
            {title}
          </p>

          <p className="mt-0.5 truncate text-[8px] text-slate-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}



function BenefitItem({
  text,
}: {
  text:
    string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
        <Check className="h-3 w-3 text-emerald-400" />
      </div>

      <span className="text-[10px] font-medium text-slate-400">
        {text}
      </span>
    </div>
  );
}



function PasswordRequirement({
  valid,
  text,
}: {
  valid:
    boolean;

  text:
    string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${
        valid
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {valid ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}

      {text}
    </span>
  );
}



function TrustItem({
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

