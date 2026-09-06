"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  FileText,
  GitBranch,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";

type Step =
  | "verify"
  | "reset"
  | "success";

const API_URL = "http://127.0.0.1:8000";

export default function ForgotPasswordForm() {
  const [
    step,
    setStep,
  ] = useState<Step>(
    "verify"
  );

  const [
    employeeId,
    setEmployeeId,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
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
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // This value should come from the backend after verification.
  const [
    resetToken,
    setResetToken,
  ] = useState("");

  // =========================================================
  // VERIFY ACCOUNT
  // =========================================================

  async function handleVerify(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      !employeeId.trim() ||
      !email.trim()
    ) {
      setError(
        "Employee ID and email are required."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/forgot-password`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                agent_id:
                  employeeId.trim(),

                email:
                  email
                    .trim()
                    .toLowerCase(),
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to verify account."
        );
      }

      /*
       * Expected development/demo response:
       *
       * {
       *   message: "...",
       *   reset_token: "..."
       * }
       */

      if (
        !data.reset_token
      ) {
        throw new Error(
          "Password reset token was not returned by the server."
        );
      }

      setResetToken(
        data.reset_token
      );

      setStep(
        "reset"
      );
    } catch (
      err: unknown
    ) {
      setError(
        getErrorMessage(
          err,
          "Unable to verify account."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  async function handleReset(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      newPassword.length <
      6
    ) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (!resetToken) {
      setError(
        "Your password reset session is invalid. Please verify your account again."
      );

      setStep(
        "verify"
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/reset-password`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                reset_token:
                  resetToken,

                new_password:
                  newPassword,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to reset password."
        );
      }

      setStep(
        "success"
      );

      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
    } catch (
      err: unknown
    ) {
      setError(
        getErrorMessage(
          err,
          "Unable to reset password."
        )
      );
    } finally {
      setLoading(false);
    }
  }
  /* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    const message = (
      error as {
        message?: unknown;
      }
    ).message;

    if (
      typeof message === "string"
    ) {
      return message;
    }
  }

  return fallback;
}

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F8FC]">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[220px] top-[-200px] h-[600px] w-[600px] rounded-full bg-blue-300/[0.10] blur-[160px]" />

        <div className="absolute bottom-[-220px] right-[-150px] h-[560px] w-[560px] rounded-full bg-violet-300/[0.10] blur-[160px]" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* =====================================================
            LEFT PANEL
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#07111F] lg:flex lg:flex-col">
          {/* GLOWS */}

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-blue-600/20 blur-[130px]" />

            <div className="absolute bottom-[-180px] right-[-120px] h-[480px] w-[480px] rounded-full bg-violet-600/15 blur-[140px]" />

            <div className="absolute right-[10%] top-[30%] h-[280px] w-[280px] rounded-full bg-cyan-500/[0.06] blur-[110px]" />
          </div>

          {/* GRID */}

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

            {/* CONTENT */}

            <div className="my-auto max-w-[600px] py-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5" />

                Secure Account Recovery
              </div>

              <h1 className="mt-7 text-[42px] font-black leading-[1.08] tracking-[-0.045em] text-white xl:text-[50px]">
                Recover access to
                <span className="block bg-linear-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  your AI workspace.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
                Verify your organization account and securely create a new
                password to regain access to Enterprise AI.
              </p>

              {/* RECOVERY FLOW */}

              <div className="mt-9 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">
                  Account Recovery
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-300">
                  Secure password reset workflow
                </p>

                <div className="mt-6 space-y-3">
                  <RecoveryStep
                    number="01"
                    title="Verify Identity"
                    description="Confirm Employee ID and registered email."
                    active={
                      step ===
                      "verify"
                    }
                    complete={
                      step ===
                        "reset" ||
                      step ===
                        "success"
                    }
                  />

                  <RecoveryStep
                    number="02"
                    title="Create Password"
                    description="Choose a new account password."
                    active={
                      step ===
                      "reset"
                    }
                    complete={
                      step ===
                      "success"
                    }
                  />

                  <RecoveryStep
                    number="03"
                    title="Access Workspace"
                    description="Sign in using your new credentials."
                    active={
                      step ===
                      "success"
                    }
                    complete={
                      step ===
                      "success"
                    }
                  />
                </div>
              </div>

              {/* PLATFORM */}

              <div className="mt-7 grid grid-cols-2 gap-3">
                <PlatformItem
                  icon={
                    FileText
                  }
                  title="Document RAG"
                />

                <PlatformItem
                  icon={
                    GitBranch
                  }
                  title="Repository AI"
                />

                <PlatformItem
                  icon={
                    Database
                  }
                  title="Vector Search"
                />

                <PlatformItem
                  icon={
                    MessageSquare
                  }
                  title="Grounded Chat"
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
            RIGHT FORM
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

            {/* =================================================
                VERIFY STEP
            ================================================== */}

            {step ===
              "verify" && (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                  <KeyRound className="h-5 w-5" />
                </div>

                <h2 className="mt-6 text-3xl font-black tracking-[-0.035em] text-slate-950">
                  Forgot password?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your Employee ID and registered email to verify your
                  account.
                </p>

                <form
                  onSubmit={
                    handleVerify
                  }
                  className="mt-7"
                >
                  {/* EMPLOYEE ID */}

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
                      value={
                        employeeId
                      }
                      onChange={(
                        event
                      ) => {
                        setEmployeeId(
                          event.target.value
                        );

                        setError("");
                      }}
                      placeholder="e.g. EMP001"
                      autoComplete="username"
                      disabled={
                        loading
                      }
                      className="w-full bg-transparent px-3 py-3.5 text-sm font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                      required
                    />
                  </div>

                  {/* EMAIL */}

                  <div className="mt-5">
                    <label
                      htmlFor="email"
                      className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                    >
                      Registered Email
                    </label>

                    <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100/50">
                      <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                      <input
                        id="email"
                        type="email"
                        value={
                          email
                        }
                        onChange={(
                          event
                        ) => {
                          setEmail(
                            event.target.value
                          );

                          setError("");
                        }}
                        placeholder="you@company.com"
                        autoComplete="email"
                        disabled={
                          loading
                        }
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <ErrorBox
                    error={
                      error
                    }
                  />

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !employeeId.trim() ||
                      !email.trim()
                    }
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Account

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* =================================================
                RESET STEP
            ================================================== */}

            {step ===
              "reset" && (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600">
                  <Lock className="h-5 w-5" />
                </div>

                <h2 className="mt-6 text-3xl font-black tracking-[-0.035em] text-slate-950">
                  Create new password
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your account has been verified. Choose a new password for
                  your Enterprise AI account.
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-[10px] font-bold text-emerald-700">
                      Identity verified
                    </p>

                    <p className="mt-0.5 text-[9px] text-emerald-600">
                      {employeeId}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={
                    handleReset
                  }
                  className="mt-6"
                >
                  {/* NEW PASSWORD */}

                  <label
                    htmlFor="newPassword"
                    className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                  >
                    New Password
                  </label>

                  <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/50">
                    <Lock className="h-4 w-4 shrink-0 text-slate-400" />

                    <input
                      id="newPassword"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        newPassword
                      }
                      onChange={(
                        event
                      ) => {
                        setNewPassword(
                          event.target.value
                        );

                        setError("");
                      }}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
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
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div className="mt-5">
                    <label
                      htmlFor="confirmPassword"
                      className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                    >
                      Confirm Password
                    </label>

                    <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100/50">
                      <Lock className="h-4 w-4 shrink-0 text-slate-400" />

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          confirmPassword
                        }
                        onChange={(
                          event
                        ) => {
                          setConfirmPassword(
                            event.target.value
                          );

                          setError("");
                        }}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        required
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
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* REQUIREMENTS */}

                  <div className="mt-4 space-y-2">
                    <Requirement
                      valid={
                        newPassword.length >=
                        6
                      }
                      text="At least 6 characters"
                    />

                    <Requirement
                      valid={
                        confirmPassword.length >
                          0 &&
                        newPassword ===
                          confirmPassword
                      }
                      text="Passwords match"
                    />
                  </div>

                  <ErrorBox
                    error={
                      error
                    }
                  />

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Updating...
                      </>
                    ) : (
                      <>
                        Reset Password

                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* =================================================
                SUCCESS
            ================================================== */}

            {step ===
              "success" && (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  Password Updated
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
                  You&apos;re all set
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Your password has been changed successfully. You can now
                  sign in using your new credentials.
                </p>

                <Link
                  href="/login"
                  className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20"
                >
                  Sign In

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}

            {/* BACK TO LOGIN */}

            {step !==
              "success" && (
              <div className="mt-7 border-t border-slate-200 pt-5 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-blue-600"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />

                  Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   RECOVERY STEP
========================================================= */

function RecoveryStep({
  number,
  title,
  description,
  active,
  complete,
}: {
  number:
    string;

  title:
    string;

  description:
    string;

  active:
    boolean;

  complete:
    boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
        active
          ? "border-blue-400/15 bg-blue-400/[0.06]"
          : "border-white/[0.05] bg-white/[0.02]"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-black ${
          complete
            ? "bg-emerald-400/10 text-emerald-400"
            : active
              ? "bg-blue-400/10 text-blue-300"
              : "bg-white/[0.04] text-slate-600"
        }`}
      >
        {complete ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <div>
        <p
          className={`text-[10px] font-bold ${
            active ||
            complete
              ? "text-slate-200"
              : "text-slate-500"
          }`}
        >
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PLATFORM ITEM
========================================================= */

function PlatformItem({
  icon: Icon,
  title,
}: {
  icon:
    React.ElementType;

  title:
    string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <p className="text-[9px] font-semibold text-slate-400">
        {title}
      </p>
    </div>
  );
}

/* =========================================================
   REQUIREMENT
========================================================= */

function Requirement({
  valid,
  text,
}: {
  valid:
    boolean;

  text:
    string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-[10px] ${
        valid
          ? "text-emerald-600"
          : "text-slate-400"
      }`}
    >
      {valid ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border border-slate-300" />
      )}

      {text}
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function ErrorBox({
  error,
}: {
  error:
    string;
}) {
  if (!error) {
    return null;
  }

  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

      <div>
        <p className="text-[10px] font-bold text-red-700">
          Unable to continue
        </p>

        <p className="mt-1 text-[10px] leading-5 text-red-600">
          {error}
        </p>
      </div>
    </div>
  );
}