import Link from "next/link";
import {
  TrendingUpIcon,
  GraduationCapIcon,
  UsersIcon,
  ArrowRightIcon,
  TargetIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { Vertical } from "./components/VerticalCard";
import { VerticalCard } from "./components/VerticalCard";

export const metadata: Metadata = {
  title: "Sovoli for Business – Digital Solutions for Caribbean Schools",
  description:
    "Discover Sovoli's suite of digital solutions designed specifically for schools in the Caribbean. From growth systems to enrollment management.",
};

const verticals: Vertical[] = [
  {
    id: "growth-system",
    name: "Growth System",
    tagline: "Turn parent searches into enrollments",
    description:
      "A complete digital visibility and lead system built for small private schools. Get found on Google, Bing, and Sovoli's directory—automatically.",
    href: "/growth-system",
    icon: <TrendingUpIcon className="h-7 w-7" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    accentColor: "emerald",
    features: [
      "Google & Bing Business Setup",
      "AI-Powered School Profile",
      "Lead Capture & WhatsApp Alerts",
      "Parent Search Analytics",
    ],
    status: "live",
  },
  {
    id: "enrollment-hub",
    name: "Enrollment Hub",
    tagline: "Paperless admissions, delightful experience",
    description:
      "Streamline your entire enrollment process from inquiry to acceptance. Online applications, document collection, and fee management in one place.",
    href: "#",
    icon: <GraduationCapIcon className="h-7 w-7" />,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    accentColor: "violet",
    features: [
      "Online Applications",
      "Document Management",
      "Fee Collection",
      "Parent Portal",
    ],
    status: "coming-soon",
  },
  {
    id: "staff-connect",
    name: "Staff Connect",
    tagline: "Build your dream teaching team",
    description:
      "Attract, hire, and retain the best educators. Job postings, applicant tracking, and staff management designed for Caribbean schools.",
    href: "#",
    icon: <UsersIcon className="h-7 w-7" />,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    accentColor: "amber",
    features: [
      "Job Board Integration",
      "Applicant Tracking",
      "Staff Profiles",
      "Performance Tools",
    ],
    status: "coming-soon",
  },
];

export default function BusinessPage() {
  return (
    <main className="min-h-screen">
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

        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
              <TargetIcon className="h-4 w-4" />
              Built for Caribbean Schools
            </span>
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-foreground">Digital Solutions</span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              That Grow Your School
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-default-600 sm:text-xl">
            Everything you need to modernize your school—from attracting parents
            to managing enrollment. Pick the solutions that fit your needs.
          </p>

          {/* Stats */}
          <div className="mx-auto mb-16 grid max-w-3xl grid-cols-3 gap-4 rounded-2xl border border-default-200 bg-content1/50 p-6 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground sm:text-3xl">
                50+
              </div>
              <div className="text-xs text-default-500 sm:text-sm">
                Schools Onboarded
              </div>
            </div>
            <div className="text-center border-x border-default-200">
              <div className="text-2xl font-bold text-foreground sm:text-3xl">
                3x
              </div>
              <div className="text-xs text-default-500 sm:text-sm">
                More Parent Inquiries
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground sm:text-3xl">
                24hr
              </div>
              <div className="text-xs text-default-500 sm:text-sm">
                Setup Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Choose Your Growth Path
          </h2>
          <p className="text-default-500">
            Start with one product or bundle them together—your school, your
            choice.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((vertical) => (
            <VerticalCard key={vertical.id} vertical={vertical} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-default-200 bg-default-50/50 dark:bg-default-50/5">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Not sure where to start?
          </h2>
          <p className="mb-8 text-default-600">
            Most schools begin with the Growth System to get more parents
            finding them online. From there, everything else becomes easier.
          </p>
          <Link
            href="/growth-system"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Start with Growth System
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
