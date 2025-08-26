"use client";

import { useMemo } from "react";
import { Chip } from "@sovoli/ui/components/chip";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { BookOpenIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";

interface CurriculumSectionProps {
  program: Program;
}

// Component for traditional course-based curriculum
function CourseCurriculumSection({ program }: CurriculumSectionProps) {
  const {
    isOpen: isSubjectsOpen,
    onOpen: onSubjectsOpen,
    onOpenChange: onSubjectsOpenChange,
  } = useDisclosure();

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
    <ProgramSectionsWrapper program={program} section="curriculum">
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
            <Button
              variant="flat"
              color="default"
              onPress={onSubjectsOpen}
              className="mt-3"
              fullWidth
            >
              Explore the full curriculum
            </Button>
          </div>
        </div>
      </div>

      {/* Drawer for detailed curriculum */}
      <Drawer
        isOpen={isSubjectsOpen}
        size="full"
        placement="bottom"
        backdrop="opaque"
        onOpenChange={onSubjectsOpenChange}
        hideCloseButton
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
              },
            },
            exit: {
              y: 100,
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            },
          },
        }}
      >
        <DrawerContent>
          <DrawerHeader
            title="Curriculum Breakdown"
            showBackButton
            onBackPress={onSubjectsOpenChange}
          />
          <DrawerBody className="mt-4">
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </ProgramSectionsWrapper>
  );
}

// Component for whatYouWillLearn-based curriculum
function WhatWillYouLearnSection({ program }: CurriculumSectionProps) {
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onOpenChange: onDetailsOpenChange,
  } = useDisclosure();

  if (!program.whatYouWillLearn || program.whatYouWillLearn.length === 0) {
    return null;
  }

  // Show first 6 learning items across all groups
  const allLearningItems = program.whatYouWillLearn.flatMap(
    (group) => group.items,
  );
  const firstSixItems = allLearningItems.slice(0, 6);
  const hasMoreItems = allLearningItems.length > 6;

  return (
    <ProgramSectionsWrapper program={program} section="curriculum">
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
              {firstSixItems.map((item) => (
                <Chip key={item.id} color="secondary" variant="flat" size="sm">
                  {item.title}
                </Chip>
              ))}
              {hasMoreItems && (
                <Chip color="secondary" variant="flat" size="sm">
                  +{allLearningItems.length - 6} more
                </Chip>
              )}
            </div>
            <Button
              variant="flat"
              color="default"
              onPress={onDetailsOpen}
              className="mt-3"
              fullWidth
            >
              Explore what you'll learn
            </Button>
          </div>
        </div>
      </div>

      {/* Drawer for detailed learning breakdown */}
      <Drawer
        isOpen={isDetailsOpen}
        size="full"
        placement="bottom"
        backdrop="opaque"
        onOpenChange={onDetailsOpenChange}
        hideCloseButton
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
              },
            },
            exit: {
              y: 100,
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            },
          },
        }}
      >
        <DrawerContent>
          <DrawerHeader
            title="What You'll Learn"
            showBackButton
            onBackPress={onDetailsOpenChange}
          />
          <DrawerBody className="mt-4">
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
                        <p className="text-sm text-foreground-600">
                          {item.blurb}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
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
