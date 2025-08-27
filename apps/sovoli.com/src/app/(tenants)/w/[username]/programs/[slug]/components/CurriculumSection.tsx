"use client";

import { useMemo } from "react";
import { Chip } from "@sovoli/ui/components/chip";
import { BookOpenIcon, CheckIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import { Button } from "@sovoli/ui/components/button";

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

  const detailedView = (
    <div className="space-y-4">
      {program.courses && program.courses.length > 0 && (
        <div className="space-y-4">
          {program.courses.map((course) => (
            <div
              key={course.id}
              className="p-3 sm:p-4 bg-default-50 rounded-lg border border-default-200 mb-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Chip color="secondary" variant="flat" size="sm">
                    {course.subject.name}
                  </Chip>
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {course.title}
                </h4>
                {course.description && (
                  <p className="text-sm text-foreground-600 mb-3">
                    {course.description}
                  </p>
                )}
                {course.units && course.units.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-xs font-medium text-foreground-500 uppercase tracking-wide">
                      Course Units
                    </p>
                    <div className="space-y-2">
                      {course.units.map((unit, unitIndex) => (
                        <div
                          key={unitIndex}
                          className="p-2 sm:p-3 bg-background rounded border border-default-200"
                        >
                          <h5 className="font-medium text-foreground text-sm mb-1">
                            {unit.title}
                          </h5>
                          {unit.topics.length > 0 && (
                            <ul className="space-y-1">
                              {unit.topics.map((topic, topicIndex) => (
                                <li
                                  key={topicIndex}
                                  className="text-xs text-foreground-600 flex items-start gap-2"
                                >
                                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const detailedViewTrigger = (onOpen: () => void) => (
    <Button
      variant="flat"
      color="default"
      className="mt-3"
      fullWidth
      onPress={onOpen}
    >
      Explore the full curriculum
    </Button>
  );

  return (
    <ProgramSectionsWrapper
      program={program}
      section="curriculum"
      detailedView={detailedView}
      detailedViewTrigger={detailedViewTrigger}
      detailedViewTitle="Curriculum Breakdown"
    >
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
        </div>
      </div>
    </ProgramSectionsWrapper>
  );
}

// Component for whatYouWillLearn-based curriculum
function WhatWillYouLearnSection({ program }: CurriculumSectionProps) {
  if (!program.whatYouWillLearn || program.whatYouWillLearn.length === 0) {
    return null;
  }

  const detailedView = (
    <div className="space-y-6">
      {program.whatYouWillLearn.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-default-200 pb-2">
            {group.heading}
          </h3>
          <div className="space-y-3">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-default-50 rounded-lg border border-default-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground text-sm">
                    {item.title}
                  </h4>
                  {item.tag && (
                    <Chip color="primary" variant="flat" size="sm">
                      {item.tag}
                    </Chip>
                  )}
                </div>
                <p className="text-sm text-foreground-600">{item.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const detailedViewTrigger = (onOpen: () => void) => (
    <Button
      variant="flat"
      color="default"
      className="mt-3"
      fullWidth
      onPress={onOpen}
    >
      Explore Curriculum
    </Button>
  );

  return (
    <ProgramSectionsWrapper
      program={program}
      section="curriculum"
      detailedView={detailedView}
      detailedViewTrigger={detailedViewTrigger}
      detailedViewTitle="What You'll Learn"
    >
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
        </div>
      </div>
    </ProgramSectionsWrapper>
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
