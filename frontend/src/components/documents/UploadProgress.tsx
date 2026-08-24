"use client";

import {
  CheckCircle2,
  Loader2,
  Clock3,
  FileText,
} from "lucide-react";

const uploads = [
  {
    id: 1,
    name: "Software_Requirements_Specification.pdf",
    progress: 100,
    status: "Completed",
  },
  {
    id: 2,
    name: "API_Documentation.docx",
    progress: 72,
    status: "Uploading",
  },
  {
    id: 3,
    name: "README.md",
    progress: 35,
    status: "Indexing",
  },
];

export default function UploadProgress() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Upload Progress
        </h2>

        <p className="mt-2 text-slate-500">
          Track document upload and AI indexing status.
        </p>

      </div>

      <div className="space-y-6">

        {uploads.map((file) => (

          <div
            key={file.id}
            className="rounded-2xl border p-5"
          >

            {/* File Info */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

                  <FileText
                    className="text-blue-600"
                    size={24}
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-slate-900">
                    {file.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {file.progress}% Completed
                  </p>

                </div>

              </div>

              {/* Status */}

              {file.status === "Completed" ? (

                <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700">

                  <CheckCircle2 size={18} />

                  Completed

                </div>

              ) : file.status === "Uploading" ? (

                <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">

                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Uploading

                </div>

              ) : (

                <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">

                  <Clock3 size={18} />

                  Indexing

                </div>

              )}

            </div>

            {/* Progress Bar */}

            <div className="mt-5">

              <div className="mb-2 flex justify-between text-sm">

                <span className="text-slate-500">
                  Progress
                </span>

                <span className="font-semibold text-blue-600">
                  {file.progress}%
                </span>

              </div>

              <div className="h-3 w-full rounded-full bg-slate-200">

                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    file.status === "Completed"
                      ? "bg-green-500"
                      : file.status === "Uploading"
                      ? "bg-blue-600"
                      : "bg-yellow-500"
                  }`}
                  style={{
                    width: `${file.progress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Overall Progress */}

      <div className="mt-10 rounded-2xl bg-slate-50 p-6">

        <div className="mb-3 flex items-center justify-between">

          <h3 className="font-semibold text-slate-900">
            Overall Progress
          </h3>

          <span className="font-bold text-blue-600">
            69%
          </span>

        </div>

        <div className="h-4 w-full rounded-full bg-slate-200">

          <div
            className="h-4 rounded-full bg-blue-600"
            style={{ width: "69%" }}
          />

        </div>

        <p className="mt-3 text-sm text-slate-500">
          2 of 3 documents are uploaded. AI indexing is still running.
        </p>

      </div>

    </div>
  );
}