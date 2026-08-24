
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitBranch, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-blue-50">

      <div className="mx-auto max-w-7xl px-6 py-28">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            AI Powered Developer Assistant
          </div>

          <h1 className="text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            Enterprise AI
            <span className="block text-blue-600">
              Operations Copilot
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600">
            Connect your GitHub repositories and let AI automatically
            analyze your codebase, generate documentation, detect bugs,
            explain architecture, and answer questions about your project.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <Link href="/login">
              <Button
                size="lg"
                className="bg-blue-600 px-8 hover:bg-blue-700"
              >
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/repositories">
              <Button
                variant="outline"
                size="lg"
                className="px-8"
              >
                <GitBranch className="mr-2 h-5 w-5" />
                Connect Repository
              </Button>
            </Link>

          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">
                AI Code Analysis
              </h3>

              <p className="mt-3 text-sm text-slate-600">
                Automatically understand folders, architecture,
                dependencies, and project structure.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">
                Smart Documentation
              </h3>

              <p className="mt-3 text-sm text-slate-600">
                Generate professional documentation and README files
                instantly using AI.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">
                AI Chat Assistant
              </h3>

              <p className="mt-3 text-sm text-slate-600">
                Ask questions about your repository and receive
                context-aware answers powered by AI.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}