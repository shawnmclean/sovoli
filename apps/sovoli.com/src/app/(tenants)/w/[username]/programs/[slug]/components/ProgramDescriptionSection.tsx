"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";

interface ProgramDescriptionSectionProps {
  program: Program;
}

export function ProgramDescriptionSection({
  program,
}: ProgramDescriptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const programDescription =
    program.description ??
    program.standardProgramVersion?.program.description ??
    "";

  if (!programDescription) {
    return null;
  }

  const shouldShowReadMore = programDescription.length > 200;
  const displayText = isExpanded
    ? programDescription
    : programDescription.slice(0, 200) + (shouldShowReadMore ? "..." : "");

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground-600 leading-relaxed">{displayText}</p>
        </div>

        {shouldShowReadMore && (
          <Button
            variant="light"
            size="sm"
            onPress={() => setIsExpanded(!isExpanded)}
            endContent={
              isExpanded ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )
            }
          >
            {isExpanded ? "Read less" : "Read more"}
          </Button>
        )}
      </div>
    </section>
  );
}
