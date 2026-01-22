"use client";

import { AwardIcon } from "lucide-react";
import Link from "next/link";
import type { Program } from "~/modules/academics/types";

interface CertificationSectionProps {
  program: Program;
}

export function CertificationSection({ program }: CertificationSectionProps) {
  const certification = program.certification;

  if (!certification) {
    return null;
  }

  // Show first 150 characters or full description if shorter
  const descriptionPreview =
    certification.description.length > 150
      ? `${certification.description.substring(0, 150)}...`
      : certification.description;

  return (
    <Link
      href={`/programs/${program.slug}/certification`}
      className="block my-6 border-b border-default-200 pb-6"
    >
      <section className="overflow-hidden">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <AwardIcon className="h-6 w-6 text-primary" />
          Your Certification
        </h2>
        <p className="text-foreground-700">{descriptionPreview}</p>
      </section>
    </Link>
  );
}
