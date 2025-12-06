import Link from "next/link";
import { CircleEllipsisIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sovoli for Business – Digital Solutions for Any Organization",
  description:
    "Other businesses and organizations. Get your digital presence set up with Sovoli.",
};

export default function OtherPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300">
              <CircleEllipsisIcon className="h-4 w-4" />
              For Other Organizations
            </span>
          </div>

          <h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-foreground">Digital Solutions for</span>
            <span className="block bg-gradient-to-r from-slate-500 via-gray-500 to-zinc-500 bg-clip-text text-transparent">
              Any Organization
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-default-600 sm:text-xl">
            Don&apos;t see your industry? We can help you too.
          </p>

          <div className="flex justify-center">
            <Link
              href="/signup/business?industry=other"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-500 to-gray-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <div className="rounded-2xl border-2 border-dashed border-default-200 bg-default-50/50 p-12 text-center dark:bg-default-50/5">
          <p className="text-default-400 text-lg">
            More details coming soon. Sign up to get notified.
          </p>
        </div>
      </section>
    </main>
  );
}

