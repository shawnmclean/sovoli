import React from "react";

export function HeroSection() {
  return (
    <section className="z-20 w-full max-w-screen-lg py-2 text-center">
      {/* Headline */}
      <h1 className="text-[clamp(32px,8vw,38px)] font-bold leading-tight tracking-tight sm:text-[64px]">
        <span className="bg-hero-section-title bg-clip-text text-transparent">
          A lifelong knowledge system <br className="hidden sm:block" />
          starts here.
        </span>
      </h1>

      {/* Description */}
      <div className="mx-auto mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-default-500 sm:text-lg">
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
      <p className="mt-4 text-sm text-default-400 sm:text-base">
        Find out if Sovoli’s a fit — and how to join early.
      </p>
    </section>
  );
}
