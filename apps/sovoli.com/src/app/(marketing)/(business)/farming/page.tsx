import Link from "next/link";
import { TreesIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sovoli for Agriculture – Digital Solutions for Farms",
  description:
    "Farms, agricultural businesses, and food producers. Get your digital presence set up with Sovoli.",
};

export default function FarmingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-lime-50/50 via-background to-background dark:from-lime-950/20" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-2 text-sm font-medium text-lime-700 dark:border-lime-800 dark:bg-lime-950/50 dark:text-lime-300">
              <TreesIcon className="h-4 w-4" />
              For Farms & Agriculture
            </span>
          </div>

          <h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-foreground">Digital Solutions for</span>
            <span className="block bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500 bg-clip-text text-transparent">
              Farms & Agriculture
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-default-600 sm:text-xl">
            Farms, agricultural businesses, and food producers.
          </p>

          <div className="flex justify-center">
            <Link
              href="/signup/business?industry=farming"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-lime-500 to-green-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
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

