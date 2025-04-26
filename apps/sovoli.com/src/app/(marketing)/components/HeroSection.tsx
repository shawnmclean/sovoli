import React from "react";
import { Chip } from "@sovoli/ui/components/chip";

import { WaitlistForm } from "./WaitlistForm";

export function HeroSection() {
  return (
    <section className="z-20 flex flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      {/* Stealth label */}
      <Chip
        className="h-9 border border-default-100 bg-default-50 px-[18px] py-2 text-sm font-normal text-default-500"
        radius="full"
        variant="bordered"
        title="We are not yet ready for public use"
      >
        Currently in stealth
      </Chip>

      {/* Headline */}
      <h1 className="text-[clamp(40px,10vw,44px)] font-bold leading-tight tracking-tighter sm:text-[64px]">
        <span className="bg-hero-section-title bg-clip-text text-transparent">
          A lifelong knowledge system <br className="hidden sm:block" /> starts
          here.
        </span>
      </h1>

      {/* Description */}
      <p className="max-w-xl text-base font-normal leading-7 text-default-500 sm:text-lg">
        Sovoli is being built in collaboration with{" "}
        <strong className="inline-flex items-center gap-1 font-medium text-default-600">
          private schools
        </strong>{" "}
        in{" "}
        <span className="inline-flex items-center gap-1 font-medium text-default-600">
          Guyana
        </span>{" "}
        and{" "}
        <span className="inline-flex items-center gap-1 font-medium text-default-600">
          Jamaica
        </span>{" "}
        to evolve how learning is recorded, shared, and continued — from early
        education into adulthood.
      </p>

      <WaitlistForm />
      <p className="mt-12 text-sm text-default-500">
        Built by engineers with global experience in education, cybersecurity,
        and AI <br />— guided by over 40 years of leadership in schools and
        teaching.
      </p>
    </section>
  );
}
