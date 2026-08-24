"use client";

import {
  CheckCircle2,
  FileCode2,
  FileText,
  Loader2,
} from "lucide-react";

import {
  DocumentItem,
} from "@/lib/documents";

interface UploadedDocumentsProps {
  documents: DocumentItem[];
}

export default function UploadedDocuments({
  documents,
}: UploadedDocumentsProps) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Uploaded Documents
        </h2>

        <p className="mt-2 text-slate-500">
          Documents indexed for the currently selected AI agent.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b text-left">

              <th className="pb-4">
                Document
              </th>

              <th className="pb-4">
                Type
              </th>

              <th className="pb-4">
                Status
              </th>

              <th className="pb-4">
                Chunks
              </th>

              <th className="pb-4">
                Progress
              </th>

            </tr>
          </thead>

          <tbody>

            {documents.map(
              (doc) => (
                <tr
                  key={
                    doc.document_id ||
                    doc.id
                  }
                  className="border-b hover:bg-slate-50"
                >

                  <td className="py-5">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

                        {doc.type ===
                        "MARKDOWN" ? (
                          <FileCode2
                            className="text-blue-600"
                            size={22}
                          />
                        ) : (
                          <FileText
                            className="text-blue-600"
                            size={22}
                          />
                        )}

                      </div>

                      <p className="font-semibold text-slate-900">
                        {doc.name}
                      </p>

                    </div>

                  </td>

                  <td>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                      {doc.type}
                    </span>
                  </td>

                  <td>

                    {doc.status ===
                    "Indexed" ? (
                      <span className="flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-sm text-green-700">

                        <CheckCircle2
                          size={16}
                        />

                        Indexed

                      </span>
                    ) : (
                      <span className="flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-3 py-2 text-sm text-yellow-700">

                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        {doc.status}

                      </span>
                    )}

                  </td>

                  <td>
                    {doc.chunks}
                  </td>

                  <td>
                    {doc.progress}%
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

        {documents.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No documents available.
          </div>
        )}

      </div>

    </div>
  );
}