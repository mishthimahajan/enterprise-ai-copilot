"use client";

import { motion } from "framer-motion";
import {
  
  FolderGit2,
  Database,
  MessageSquare,
} from "lucide-react";

const workflow = [
  // {
  //   icon: Github,
  //   title: "Connect Repository",
  //   description:
  //     "Connect your GitHub repository securely using the GitHub API.",
  // },
  {
    icon: FolderGit2,
    title: "Analyze & Index",
    description:
      "The AI agent analyzes folders, files, classes, functions, and documentation.",
  },
  {
    icon: Database,
    title: "Generate Embeddings",
    description:
      "Code and documentation are converted into vector embeddings and stored for semantic search.",
  },
  {
    icon: MessageSquare,
    title: "Ask Questions",
    description:
      "Ask questions in natural language and receive AI-generated answers with source references.",
  },
];

export default function Workflow() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Workflow
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            How Enterprise AI Copilot Works
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            From connecting your repository to receiving AI-powered answers in
            just a few steps.
          </p>
        </motion.div>

        {/* Workflow Cards */}
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                }}
                viewport={{ once: true }}
                className="relative rounded-3xl bg-white p-8 shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-4 text-slate-600 leading-7">
                  {step.description}
                </p>

                {/* Arrow */}
                {index !== workflow.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-8 -translate-y-1/2 text-blue-400 text-3xl font-bold">
                    →
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}