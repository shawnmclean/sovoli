import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { Input } from "@sovoli/ui/components/input";

export function HeroSection() {
  return (
    <section className="z-20 flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
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
          <Icon icon="emojione:flag-for-guyana" width="14" />
          Guyana
        </span>{" "}
        and{" "}
        <span className="inline-flex items-center gap-1 font-medium text-default-600">
          <Icon icon="emojione:flag-for-jamaica" width="14" />
          Jamaica
        </span>{" "}
        to evolve how learning is recorded, shared, and continued — from early
        education into adulthood.
      </p>

      {/* Email form */}
      <form className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <Input
          type="email"
          placeholder="Your email"
          required
          className="h-10 w-full text-sm sm:w-[260px]"
        />
        <Button
          type="submit"
          className="h-10 w-full text-sm font-medium sm:w-[140px]"
        >
          Notify Me
        </Button>
      </form>
      <p className="mt-12 text-sm text-default-500">
        Built by engineers with global experience in education, cybersecurity,
        and AI <br />— guided by over 40 years of leadership in schools and
        teaching.
      </p>
    </section>
  );
}
