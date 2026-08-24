
"use client";

import Link from "next/link";
import { FolderGit2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        
        <Link href="/" className="flex items-center gap-2">
          <FolderGit2 className="h-7 w-7 text-blue-600" />
          <span className="text-lg font-bold text-slate-800">
            Enterprise AI Copilot
          </span>
        </Link>

        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link href="/documents" className="hover:text-blue-600">
            documents
          </Link>

          <Link href="/github-agent" className="hover:text-blue-600">
            GitHub Agent
          </Link>

          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
        </div>

        
        <div className="hidden md:flex items-center gap-3">

          <Link href="/login">
            <Button variant="outline">
              Sign In
            </Button>
          </Link>

          <Button className="bg-blue-600 hover:bg-blue-700">
            Connect Repository
          </Button>

        </div>

        
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>
      </div>

      
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="flex flex-col gap-4 p-6">

            <Link href="/">Home</Link>

            <Link href="/documents">
              Documents
            </Link>

            <Link href="/github-agent">
              GitHub Agent
            </Link>

            <Link href="/about">
              About
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                className="w-full"
              >
                Sign In
              </Button>
            </Link>

            <Button className="bg-blue-600 hover:bg-blue-700 w-full">
              Connect Repository
            </Button>

          </div>
        </div>
      )}
    </nav>
  );
}