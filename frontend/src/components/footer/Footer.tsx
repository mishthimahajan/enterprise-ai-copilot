import Link from "next/link";
import {
  Mail,
  FolderGit2
  
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Logo */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Enterprise AI
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              AI-powered Enterprise Operations Copilot that helps developers
              understand GitHub repositories using Retrieval-Augmented
              Generation (RAG) and Large Language Models.
            </p>
          </div>

          
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Navigation
            </h3>

            <ul className="space-y-3">

              <li>
                <Link href="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/documents"
                  className="hover:text-blue-400"
                >
                  Documents
                </Link>
              </li>

              <li>
                <Link
                  href="/github-agent"
                  className="hover:text-blue-400"
                >
                  GitHub Agent
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-blue-400">
                  About
                </Link>
              </li>

            </ul>
          </div>

          
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Features
            </h3>

            <ul className="space-y-3">

              <li>GitHub Repository Analysis</li>

              <li>AI Code Search</li>

              <li>Source References</li>

              <li>Vector Search</li>

              <li>RAG Pipeline</li>

            </ul>
          </div>

         
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@enterpriseai.com</span>
              </div>

              <div className="flex gap-4 pt-3">

                <a href="#" className="hover:text-blue-400">
                  <FolderGit2 />
                </a>

                <a href="#" className="hover:text-blue-400">
                  <span>LinkedIN</span>
                </a>

              </div>

            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Enterprise AI Operations Copilot.
          All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}