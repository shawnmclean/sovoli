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

export function CurriculumSection({ program }: CurriculumSectionProps) {
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
    <ProgramSectionsWrapper program={program}>
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
