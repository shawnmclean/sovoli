"use client";

import { ClipboardListIcon } from "lucide-react";
import type { Project } from "~/modules/projects/types";

interface ProjectDescriptionSectionProps {
  project: Project;
  updatedAt?: string;
}

export function ProjectDescriptionSection({
  project,
  updatedAt,
}: ProjectDescriptionSectionProps) {
  if (!project.description) {
    return null;
  }

  return (
    <section className="mb-6 sm:mb-8">
      <p className="text-base leading-relaxed text-default-600 sm:text-lg">
        {project.description}
      </p>
      {updatedAt && (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ClipboardListIcon className="h-4 w-4" />
            Updated {updatedAt}
          </span>
        </div>
      )}
    </section>
  );
}

