"use client";

import {
  MessageSquare,
  Clock3,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const chats = [
  {
    id: 1,
    title: "Authentication Flow",
    time: "5 min ago",
    active: true,
  },
  {
    id: 2,
    title: "Repository Structure",
    time: "20 min ago",
    active: false,
  },
  {
    id: 3,
    title: "Database Schema",
    time: "Yesterday",
    active: false,
  },
  {
    id: 4,
    title: "JWT Implementation",
    time: "2 days ago",
    active: false,
  },
];

export default function ChatSidebar() {
  return (
    <aside className="flex h-full w-full flex-col rounded-3xl border bg-white shadow-sm">

      

      <div className="border-b p-6">

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">

          <Plus size={18} />

          New Chat

        </button>

      </div>

      

      <div className="border-b p-6">

        <div className="flex items-center rounded-xl border bg-slate-50 px-4">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-transparent px-3 py-3 outline-none"
          />

        </div>

      </div>

     

      <div className="flex-1 overflow-y-auto p-4">

        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Recent Chats
        </h3>

        <div className="space-y-3">

          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                chat.active
                  ? "border-blue-200 bg-blue-50"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between">

                <div className="flex gap-3">

                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">

                    <MessageSquare
                      size={18}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <h4 className="font-medium text-slate-900">
                      {chat.title}
                    </h4>

                    <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">

                      <Clock3 size={14} />

                      {chat.time}

                    </div>

                  </div>

                </div>

                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500">

                  <Trash2 size={16} />

                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

      

      <div className="border-t p-5">

        <div className="rounded-xl bg-slate-100 p-4">

          <p className="text-sm font-medium text-slate-700">
            Enterprise AI Copilot
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Ask questions about your connected GitHub repositories.
          </p>

        </div>

      </div>

    </aside>
  );
}