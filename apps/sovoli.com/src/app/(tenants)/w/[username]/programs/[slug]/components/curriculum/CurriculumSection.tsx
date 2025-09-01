"use client";

import { useMemo } from "react";
import { Chip } from "@sovoli/ui/components/chip";
import { Button } from "@sovoli/ui/components/button";
import { BookOpenIcon, CheckIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";
import Link from "next/link";

interface CurriculumSectionProps {
  program: Program;
}

// Component for traditional course-based curriculum
function CourseCurriculumSection({ program }: CurriculumSectionProps) {
  // Extract unique subjects from the current level
  const subjects = useMemo(() => {
    const courses = program.courses;
    if (!courses) return [];
    const uniqueSubjects = new Set<string>();
    courses.forEach((course) => {
      if (course.subject.name) {
        uniqueSubjects.add(course.subject.name);
      }
    });
    return Array.from(uniqueSubjects);
  }, [program]);

  // Show first 6 subjects
  const firstSixSubjects = subjects.slice(0, 6);
  const hasMoreSubjects = subjects.length > 6;

  if (subjects.length === 0) {
    return null;
  }

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            What {program.audience === "parent" ? "Your Child" : "You"} Will
            Learn
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap gap-2">
              {firstSixSubjects.map((subject, index) => (
                <Chip key={index} color="secondary" variant="flat" size="sm">
                  {subject}
                </Chip>
              ))}
              {hasMoreSubjects && (
                <Chip color="secondary" variant="flat" size="sm">
                  +{subjects.length - 6} more
                </Chip>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="flat"
              color="default"
              className="mt-3"
              fullWidth
              href={`/programs/${program.slug}/curriculum`}
              as={Link}
            >
              Explore the full curriculum
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Component for whatYouWillLearn-based curriculum
function WhatWillYouLearnSection({ program }: CurriculumSectionProps) {
  if (!program.whatYouWillLearn || program.whatYouWillLearn.length === 0) {
    return null;
  }

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            What {program.audience === "parent" ? "Your Child" : "You"} Will
            Learn
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <ul className="space-y-4">
              {program.whatYouWillLearn.map((group) => (
                <li key={group.heading} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-bold text-foreground">
                      {group.heading}
                    </span>
                  </div>
                  <ul className="ml-6 space-y-1">
                    {group.items.map((item) => (
                      <li key={item.id} className="text-sm text-foreground-600">
                        • {item.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <Button
              variant="flat"
              color="default"
              className="mt-3"
              fullWidth
              href={`/programs/${program.slug}/curriculum`}
              as={Link}
            >
              Explore Curriculum
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main component that decides which curriculum section to render
export function CurriculumSection({ program }: CurriculumSectionProps) {
  // Check if program has whatYouWillLearn data
  if (program.whatYouWillLearn && program.whatYouWillLearn.length > 0) {
    return <WhatWillYouLearnSection program={program} />;
  }

  // Fall back to traditional course-based curriculum
  return <CourseCurriculumSection program={program} />;
}
