import Link from "next/link";
import { BriefcaseIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sovoli for Services – Digital Solutions for Service Businesses",
  description:
    "Professional services, consultants, agencies, and service providers. Get your digital presence set up with Sovoli.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <BriefcaseIcon className="h-4 w-4" />
              For Service Businesses
            </span>
          </div>

          <h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-foreground">Digital Solutions for</span>
            <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Service Businesses
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-default-600 sm:text-xl">
            Professional services, consultants, agencies, and service providers.
          </p>

          <div className="flex justify-center">
            <Link
              href="/signup/business?industry=services"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
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

