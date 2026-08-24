"use client";

import {
  FileCode2,
  Copy,
  ExternalLink,
  Star,
} from "lucide-react";
import { useState } from "react";

interface SourceReferenceProps {
  fileName: string;
  filePath: string;
  lines: string;
  relevance: number;
}

export default function SourceReference({
  fileName,
  filePath,
  lines,
  relevance,
}: SourceReferenceProps) {
  const [copied, setCopied] = useState(false);

  const copyPath = async () => {
    await navigator.clipboard.writeText(filePath);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">

      

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

            <FileCode2 className="h-6 w-6 text-blue-600" />

          </div>

          <div>

            <h3 className="font-semibold text-slate-900">
              {fileName}
            </h3>

            <p className="text-sm text-slate-500">
              {filePath}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1">

          <Star
            size={15}
            className="fill-yellow-500 text-yellow-500"
          />

          <span className="text-sm font-semibold text-yellow-700">
            {relevance}%
          </span>

        </div>

      </div>

      

      <div className="mt-5 grid gap-4 md:grid-cols-2">

        <div>

          <p className="text-sm text-slate-500">
            Line Numbers
          </p>

          <p className="mt-1 font-medium text-slate-800">
            {lines}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            File Type
          </p>

          <p className="mt-1 font-medium text-slate-800">
            Source Code
          </p>

        </div>

      </div>

      

      <div className="mt-6 flex flex-wrap gap-3">

        <button className="flex items-center gap-2 rounded-xl border px-4 py-2 transition hover:bg-slate-100">

          <ExternalLink size={18} />

          View File

        </button>

        <button
          onClick={copyPath}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 transition hover:bg-slate-100"
        >

          <Copy size={18} />

          {copied ? "Copied!" : "Copy Path"}

        </button>

      </div>

    </div>
  );
}