"use client";

import { motion } from "framer-motion";
import {
  FolderGit2,
  Search,
  FileCode2,
} from "lucide-react";

const features = [
  {
    icon: FolderGit2,
    title: "GitHub Repository Analysis",
    description:
      "Connect your GitHub repository and let AI analyze the project structure, folders, files, and architecture automatically.",
  },
  {
    icon: Search,
    title: "AI Code Search",
    description:
      "Ask questions in natural language and instantly find relevant code, APIs, classes, and business logic.",
  },
  {
    icon: FileCode2,
    title: "Source References",
    description:
      "Every AI response includes file paths and source references, making answers reliable and easy to verify.",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Features
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Everything You Need to Understand Any Repository
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Enterprise AI Operations Copilot helps interns and developers
            understand large codebases quickly using AI-powered repository
            analysis and intelligent code search.
          </p>
        </motion.div>

        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                }}
                viewport={{ once: true }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}