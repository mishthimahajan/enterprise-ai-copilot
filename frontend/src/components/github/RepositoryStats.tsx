"use client";

import {
  Boxes,
  Code2,
  FileCode2,
  
  SearchCheck,
} from "lucide-react";


interface RepositoryStatsProps {
  total: number;
  indexed: number;
  files: number;
  chunks: number;
}


export default function RepositoryStats({
  total,
  indexed,
  files,
  chunks,
}: RepositoryStatsProps) {

  return (
    <div>

      <h2 className="text-xl font-semibold text-slate-900">
        Repository Knowledge
      </h2>


      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


        <StatCard
          title="Repositories"
          value={
            total
          }
          icon={
            <Code2
              size={22}
            />
          }
        />


        <StatCard
          title="Indexed"
          value={
            indexed
          }
          icon={
            <SearchCheck
              size={22}
            />
          }
        />


        <StatCard
          title="Source Files"
          value={
            files
          }
          icon={
            <FileCode2
              size={22}
            />
          }
        />


        <StatCard
          title="Code Chunks"
          value={
            chunks
          }
          icon={
            <Boxes
              size={22}
            />
          }
        />

      </div>

    </div>
  );
}


function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>


          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

        </div>


        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          {icon}
        </div>

      </div>

    </div>
  );
}