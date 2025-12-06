import Link from "next/link";
import {
  GraduationCapIcon,
  ArrowRightIcon,
  GlobeIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  BarChart3Icon,
  MessageCircleIcon,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sovoli for Education – Digital Solutions for Caribbean Schools",
  description:
    "Programs, enrollment, visits, websites, projects, Google Business Profiles, and more. The complete digital system for Caribbean schools.",
};

const benefits = [
  {
    icon: GlobeIcon,
    title: "Professional Website",
    description:
      "Get a beautiful, mobile-friendly website that showcases your school's programs and facilities.",
  },
  {
    icon: MapPinIcon,
    title: "Google Business Profile",
    description:
      "Appear on Google Maps and Search when parents look for schools in your area.",
  },
  {
    icon: CalendarIcon,
    title: "Program Management",
    description:
      "List your academic programs, extracurriculars, and special offerings for parents to explore.",
  },
  {
    icon: UsersIcon,
    title: "Enrollment Inquiries",
    description:
      "Capture parent inquiries and manage enrollment interest all in one place.",
  },
  {
    icon: BarChart3Icon,
    title: "Visitor Analytics",
    description:
      "Track how parents find and interact with your school's digital presence.",
  },
  {
    icon: MessageCircleIcon,
    title: "WhatsApp Integration",
    description:
      "Connect with parents instantly through WhatsApp for quick inquiries and updates.",
  },
];

export default function EducationPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-blue-950/20" />
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
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
              <GraduationCapIcon className="h-4 w-4" />
              For Schools & Academies
            </span>
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block text-foreground">The Complete Digital System</span>
            <span className="block bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              for Caribbean Schools
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-default-600 sm:text-xl">
            Programs, enrollment, visits, websites, projects, Google Business
            Profiles, and more.
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <Link
              href="/signup/business?industry=education"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Setup
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Everything Your School Needs
          </h2>
          <p className="text-default-500">
            A complete digital toolkit designed specifically for Caribbean
            educational institutions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-default-200 bg-content1 p-6"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm text-default-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Examples Section */}
      <section className="border-t border-default-200 bg-default-50/50 dark:bg-default-50/5">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
              Schools Using Sovoli
            </h2>
            <p className="text-default-500">
              Join dozens of Caribbean schools already digitizing with Sovoli.
            </p>
          </div>

          {/* Placeholder blocks for examples */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl border border-default-200 bg-content1 flex items-center justify-center"
              >
                <span className="text-default-400 text-sm">
                  Example School {i}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-default-200">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Ready to digitize your school?
          </h2>
          <p className="mb-8 text-default-600">
            Get your school online in minutes. We&apos;ll guide you through
            every step.
          </p>
          <Link
            href="/signup/business?industry=education"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Digitize Your School
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

