import { ArrowRightIcon, Globe, MapPin, Megaphone } from "lucide-react";
import Link from "next/link";
import { BUSINESS_CATEGORIES, businessCategoryHref } from "./categories";
import { BusinessCard } from "./components/BusinessCard";
import { BusinessHeroSection } from "./components/BusinessHeroSection";
import type { CapabilityCardData } from "./components/CapabilityCard";
import { CapabilityCard } from "./components/CapabilityCard";

const capabilities: CapabilityCardData[] = [
  {
    title: "Conversion-Focused Website",
    description:
      "Get a clean, fast website that brings you customers. Built for mobile devices. Add photos, videos, programs, services and more.",
    icon: Globe,
  },
  {
    title: "Google Business Profile",
    description:
      "Show up on Google and Google Maps with information that stays accurate. We centralize your listing so everything stays in sync automatically.",
    icon: MapPin,
  },
  {
    title: "Facebook & Instagram Ads",
    description:
      "We run and continuously optimize your ads so the right customers reach you—without wasting budget.",
    icon: Megaphone,
  },
];

export default function BusinessPage() {
  const headlineLabels = BUSINESS_CATEGORIES.map((category) => category.label);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <BusinessHeroSection headlineLabels={headlineLabels} />

      {/* Growth System by Business Type */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
            One platform for schools and training programs
          </h2>
          <p className="mx-auto max-w-2xl text-default-500">
            Everything you need to get your classes, programs, and workshops
            discovered and filled.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8">
          {BUSINESS_CATEGORIES.map((category) => (
            <BusinessCard
              key={category.id}
              industry={{
                id: category.id,
                goal: category.label,
                description: category.shortDescription,
                href: businessCategoryHref(category.id),
                image: category.image,
                gradient: category.gradient,
              }}
            />
          ))}
        </div>
      </section>

      {/* Technologies Section */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">
              See how Sovoli helps your business get more customers online.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, index) => (
              <CapabilityCard key={index} capability={capability} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-default-200 bg-default-50/50 dark:bg-default-50/5">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mb-8 text-default-600">
            Set up your digital presence in minutes. No technical skills
            required.
          </p>
          <Link
            href="/signup/business"
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
