"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileCode2,
  Search,
  Bot,
} from "lucide-react";

const files = [
  {
    name: "src",
    type: "folder",
    expanded: true,
    children: [
      { name: "app.tsx", type: "file" },
      { name: "layout.tsx", type: "file" },
      { name: "page.tsx", type: "file" },
    ],
  },
  {
    name: "components",
    type: "folder",
    expanded: false,
    children: [
      { name: "Navbar.tsx", type: "file" },
      { name: "Sidebar.tsx", type: "file" },
    ],
  },
  {
    name: "package.json",
    type: "file",
  },
  {
    name: "README.md",
    type: "file",
  },
];

export default function FileExplorer() {
  const [search, setSearch] = useState("");

  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            File Explorer
          </h2>

          <p className="mt-2 text-slate-500">
            Browse indexed repository files.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">

          <Bot size={18} />

          Ask AI

        </button>

      </div>

      {/* Search */}

      <div className="mt-8">

        <div className="flex items-center rounded-xl border bg-slate-50 px-4">

          <Search className="text-slate-400" size={20} />

          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 py-4 outline-none"
          />

        </div>

      </div>

      {/* Files */}

      <div className="mt-8 space-y-3">

        {files.map((item) => (

          <div key={item.name}>

            {item.type === "folder" ? (

              <div>

                <div className="flex cursor-pointer items-center gap-3 rounded-xl p-3 hover:bg-slate-100">

                  {item.expanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}

                  <Folder className="text-yellow-500" size={20} />

                  <span className="font-medium">
                    {item.name}
                  </span>

                </div>

                {item.expanded && (

                  <div className="ml-10 mt-2 space-y-2">

                    {item.children?.map((file) => (

                      <div
                        key={file.name}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-100"
                      >

                        <FileCode2
                          className="text-blue-600"
                          size={18}
                        />

                        {file.name}

                      </div>

                    ))}

                  </div>

                )}

              </div>

            ) : (

              <div className="flex cursor-pointer items-center gap-3 rounded-xl p-3 hover:bg-slate-100">

                <FileCode2
                  className="text-blue-600"
                  size={20}
                />

                <span>{item.name}</span>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}