"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { ProgramSearchContent } from "../components/search/ProgramSearchContent";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="relative p-0 w-auto h-auto min-w-0 min-h-0 before:absolute before:inset-0 before:-m-3 before:rounded-full before:bg-transparent before:content-[''] before:z-10 bg-transparent border-none cursor-pointer flex items-center justify-center rounded-full text-current"
            aria-label="Go back"
          >
            <ChevronLeftIcon size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Find Programs</h1>
        </div>
        <p className="text-default-600">
          Search for programs that match your child&apos;s age
        </p>
      </div>
      <ProgramSearchContent />
    </div>
  );
}
