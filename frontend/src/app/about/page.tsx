"use client";

import Link from "next/link";
import {
  Brain,
  Code2,
  Database,
  FileText,
  Search,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-blue-50/40 to-white">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <Brain className="h-4 w-4" />
          About Enterprise AI Copilot
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Understand Enterprise Knowledge
          <span className="block text-blue-600">
            Faster with AI
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Enterprise AI Copilot is an AI-powered developer and knowledge
          assistant that helps teams understand GitHub repositories,
          enterprise documents, architecture, and internal knowledge through
          natural-language conversations.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/github"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Connect Repository
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
              The Problem
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Enterprise knowledge is scattered everywhere
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Developers and teams often spend significant time searching
              through large repositories, documentation, files, APIs, and
              internal systems just to understand how something works.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Enterprise AI Copilot turns this distributed information into a
              searchable AI knowledge layer so users can ask questions and get
              context-aware answers with relevant source references.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-5">
              {[
                "Large and unfamiliar codebases",
                "Scattered technical documentation",
                "Slow onboarding for new developers",
                "Difficulty locating implementation details",
                "Time-consuming repository navigation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              What We Provide
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              One AI assistant for enterprise knowledge
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              The platform combines repository intelligence, document RAG,
              semantic search, persistent AI conversations, and source-aware
              responses.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="GitHub Repository Analysis"
              description="Connect repositories, index source code and ask questions about files, architecture and implementation."
            />

            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="AI Code Search"
              description="Search code semantically instead of relying only on filenames or exact keywords."
            />

            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Document Intelligence"
              description="Upload enterprise documents and interact with their knowledge through retrieval-augmented generation."
            />

            <FeatureCard
              icon={<Database className="h-6 w-6" />}
              title="Vector Search"
              description="Qdrant stores searchable embeddings for repository source code and uploaded document chunks."
            />

            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Authenticated Access"
              description="Protected workflows use JWT authentication and agent-scoped access."
            />

            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Context-Aware Answers"
              description="Relevant source chunks are retrieved first and supplied to the language model for grounded responses."
            />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Architecture
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            How Enterprise AI Copilot works
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {[
            {
              number: "01",
              title: "Connect",
              text: "Connect GitHub repositories or upload documents.",
            },
            {
              number: "02",
              title: "Parse",
              text: "Extract and split source content into manageable chunks.",
            },
            {
              number: "03",
              title: "Embed",
              text: "Convert chunks into vector embeddings using FastEmbed.",
            },
            {
              number: "04",
              title: "Retrieve",
              text: "Search Qdrant for the most relevant knowledge.",
            },
            {
              number: "05",
              title: "Answer",
              text: "Generate contextual answers using Gemini.",
            },
          ].map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="text-sm font-bold text-blue-600">
                {step.number}
              </span>

              <h3 className="mt-3 font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Technology
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Built with a modern AI stack
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "FastAPI",
              "Python",
              "MongoDB Atlas",
              "Qdrant Cloud",
              "FastEmbed",
              "Gemini",
              "JWT",
              "GitHub",
              "Vercel",
              "Render",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2 text-sm font-medium text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-blue-600 px-8 py-14 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-white">
            Explore your codebase with AI
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Connect a repository, index your knowledge and start asking
            questions using Enterprise AI Copilot.
          </p>

          <Link
            href="/github"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}