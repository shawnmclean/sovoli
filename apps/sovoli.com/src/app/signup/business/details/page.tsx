import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "~/components/footer/Footer";
import { MarketingNavbar } from "../../../(marketing)/components/navbar/MarketingNavbar";

export const metadata: Metadata = {
  title: "Business Details – Sovoli Business Setup",
  description: "Tell us about your business to get started with Sovoli.",
};

export default function SignupBusinessDetailsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-950/20" />
          </div>

          <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
            {/* Back link */}
            <div className="mb-8">
              <Link
                href="/signup/business"
                className="inline-flex items-center gap-2 text-sm text-default-500 hover:text-foreground transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </Link>
            </div>

            {/* Main headline */}
            <h1 className="mb-6 text-center text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              <span className="text-foreground">Business Details</span>
            </h1>

            {/* Placeholder */}
            <div className="rounded-2xl border-2 border-dashed border-default-200 bg-default-50/50 p-12 text-center dark:bg-default-50/5">
              <p className="text-default-400 mb-4">
                Business details form will appear here
              </p>
              <p className="text-default-300 text-sm">
                This is a placeholder page for the multi-step signup flow.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

