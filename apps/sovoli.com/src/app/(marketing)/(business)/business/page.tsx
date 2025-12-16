import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, Globe, MapPin, Megaphone } from "lucide-react";
import type { Metadata } from "next";
import { BusinessCard } from "./components/BusinessCard";
import type { CapabilityCardData } from "./components/CapabilityCard";
import { CapabilityCard } from "./components/CapabilityCard";
import { DynamicHeadline } from "./components/DynamicHeadline";
import { BUSINESS_CATEGORIES, businessCategoryHref } from "./categories";

export const metadata: Metadata = {
  title: "Sovoli Business – Digitize Your Organization",
  description:
    "Websites, Google visibility, programs, services, products, and projects — all in one place. Digital solutions for Caribbean businesses.",
};

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
  const headlineLabels = BUSINESS_CATEGORIES.map(
    (category) => category.headlineLabel,
  );

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-950/20" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16 md:py-20 lg:px-12 lg:py-24">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8 lg:gap-12">
            {/* Text content */}
            <div className="md:flex-1">
              <DynamicHeadline headlineLabels={headlineLabels} />

              {/* Subheadline */}
              <p className="text-lg text-default-600 md:text-xl md:max-w-md lg:max-w-lg mb-6 sm:mb-8">
                We don’t just build websites — we run data-driven ads within a
                connected growth system that turns interest in your programs
                into real leads and customers.
              </p>

              {/* CTA Button */}
              <Link
                href="/signup/business"
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-primary/90"
              >
                Get Started
              </Link>
            </div>

            {/* Hero image - mobile app mockup */}
            <div className="mt-10 md:mt-0 md:w-[180px] lg:w-[220px] xl:w-[260px] flex-shrink-0 self-center md:self-start">
              <div className="relative aspect-[9/16] w-[200px] mx-auto md:w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl ring-1 ring-black/5">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                  alt="Sovoli mobile app"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growth System by Business Type */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
            One platform for schools and training programs
          </h2>
          <p className="mx-auto max-w-2xl text-default-500">
            Everything you need to get your programs discovered and filled.
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
