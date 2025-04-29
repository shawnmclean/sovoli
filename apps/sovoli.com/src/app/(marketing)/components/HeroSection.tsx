import React from "react";

import { WaitlistForm } from "./WaitlistForm";

export function HeroSection() {
  return (
    <section className="z-20 flex flex-col items-center justify-center gap-6 px-4 py-8 text-center">
      {/* Headline */}
      <h1 className="text-[clamp(32px,8vw,38px)] font-bold leading-tight tracking-tight sm:text-[64px]">
        <span className="bg-hero-section-title bg-clip-text text-transparent">
          A lifelong knowledge system <br className="hidden sm:block" />
          starts here.
        </span>
      </h1>

      {/* Description */}
      <div className="max-w-2xl space-y-4 text-base leading-relaxed text-default-500 sm:text-lg">
        <p>
          We're building Sovoli with{" "}
          <strong className="font-semibold text-default-600">
            private schools
          </strong>{" "}
          in <strong className="font-semibold text-default-600">Guyana</strong>{" "}
          and{" "}
          <strong className="font-semibold text-default-600">Jamaica</strong> to
          replace paper logbooks and disorganized files with a secure, digital
          system that grows with the student.
        </p>

        <p className="font-medium text-default-600">
          Cut admin work by 70%. Track student growth from nursery to graduation
          — all in one place.
        </p>
      </div>

      {/* Outcome Framing */}
      <p className="text-sm text-default-500 sm:text-base">
        Find out if Sovoli’s a fit — and how to join early.
      </p>

      {/* CTA Form */}
      <WaitlistForm />

      {/* Credibility Footer */}
      <p className="mt-12 max-w-xl text-sm text-default-500">
        Built by engineers with global experience in Education, Cybersecurity,
        and Artificial Intelligence —<br />
        guided by over 40 years of leadership in schools and teaching.
      </p>
    </section>
  );
}
