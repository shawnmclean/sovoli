"use client";

import { useEffect, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { BookOpenIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import type { OrgProgram, ProgramLevel } from "~/modules/academics/types";
import { useProgramSelection } from "../context/ProgramSelectionContext";

interface CurriculumSectionProps {
  program: OrgProgram;
  defaultLevel?: ProgramLevel | null;
}

export function CurriculumSection({
  program,
  defaultLevel,
}: CurriculumSectionProps) {
  const { selectedCycle, selectedLevel, setSelectedLevel } =
    useProgramSelection();
  const {
    isOpen: isSubjectsOpen,
    onOpen: onSubjectsOpen,
    onOpenChange: onSubjectsOpenChange,
  } = useDisclosure();
  const {
    isOpen: isActivitiesOpen,
    onOpen: onActivitiesOpen,
    onOpenChange: onActivitiesOpenChange,
  } = useDisclosure();

  const levels = useMemo(
    () => program.levels ?? program.standardProgramVersion?.levels ?? [],
    [program.levels, program.standardProgramVersion?.levels],
  );

  // Set default level on mount or when levels change
  useEffect(() => {
    if (levels.length > 0 && !selectedLevel) {
      if (levels[0]) {
        setSelectedLevel(levels[0]);
      }
    }
  }, [levels, selectedLevel, setSelectedLevel]);

  // Use defaultLevel for SSR, fallback to selectedLevel for client
  const displayLevel = selectedLevel ?? defaultLevel;

  // Extract unique subjects and activities from the current level
  const subjects = useMemo(() => {
    const courses = displayLevel?.courses;
    if (!courses) return [];
    const uniqueSubjects = new Set<string>();
    courses.forEach((course) => {
      if (course.subject.name) {
        uniqueSubjects.add(course.subject.name);
      }
    });
    return Array.from(uniqueSubjects);
  }, [displayLevel]);

  const activities = useMemo(() => {
    return displayLevel?.activities ?? [];
  }, [displayLevel]);

  // Show first 5 of each
  const firstFiveSubjects = subjects.slice(0, 5);
  const firstFiveActivities = activities.slice(0, 5);
  const hasMoreSubjects = subjects.length > 5;
  const hasMoreActivities = activities.length > 5;

  if (levels.length === 0) {
    return null;
  }

  // If only one level, don't show selector
  const showLevelSelector = levels.length > 1;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            What Your Child Will Learn
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Level Selector */}
          {showLevelSelector && (
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {levels.map((level, _levelIndex) => {
                  const isSelected = displayLevel?.id === level.id;

                  return (
                    <CarouselItem key={level.id} className="pl-2 basis-auto">
                      <button
                        onClick={() => setSelectedLevel(level)}
                        className={`block rounded-xl border transition-colors cursor-pointer p-4 min-w-[200px]
                            ${isSelected ? "border-green-600 bg-green-900/90 text-white" : "border-default-200 bg-default-50 hover:border-primary-400"}
                            flex flex-col gap-2 relative group
                          `}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            color={isSelected ? "primary" : "secondary"}
                            variant="flat"
                            size="sm"
                          >
                            {isSelected ? "Selected" : "Level"}
                          </Badge>
                          <span className="text-base font-medium">
                            {level.label}
                          </span>
                        </div>
                        {level.ageRange && (
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span>Ages:</span>
                              <span className="font-medium">
                                {level.ageRange.min}-{level.ageRange.max} years
                              </span>
                            </div>
                          </div>
                        )}
                        {/* Enrollment numbers */}
                        {selectedCycle &&
                          (() => {
                            const levelCycle = selectedCycle.levelCycles?.find(
                              (lc) => lc.level.id === level.id,
                            );

                            if (
                              levelCycle &&
                              (levelCycle.capacity ?? levelCycle.enrolled)
                            ) {
                              return (
                                <div className="text-sm">
                                  <div className="flex justify-between">
                                    <span>Enrollment:</span>
                                    <span className="font-medium">
                                      {levelCycle.enrolled ?? 0}
                                      {levelCycle.capacity &&
                                        ` / ${levelCycle.capacity}`}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        {/* Custom radio indicator */}
                        <span
                          className={`absolute right-4 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                              ${isSelected ? "border-white bg-green-700" : "border-gray-400 bg-white group-hover:border-primary-400"}
                            `}
                          aria-hidden="true"
                        >
                          {isSelected && (
                            <span className="block w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </span>
                      </button>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          )}

          {/* Level Content - Simplified */}
          {displayLevel && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {levels.findIndex((l) => l.id === displayLevel.id) + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {displayLevel.label}
                    </h3>
                    {displayLevel.ageRange && (
                      <p className="text-sm text-foreground-600 mt-1">
                        Ages {displayLevel.ageRange.min}-
                        {displayLevel.ageRange.max} years
                      </p>
                    )}
                  </div>
                </div>

                {/* Enrollment numbers */}
                {selectedCycle &&
                  (() => {
                    const levelCycle = selectedCycle.levelCycles?.find(
                      (lc) => lc.level.id === displayLevel.id,
                    );

                    if (
                      levelCycle &&
                      (levelCycle.capacity ?? levelCycle.enrolled)
                    ) {
                      return (
                        <div className="flex items-center gap-2 text-sm">
                          {levelCycle.enrolled !== undefined && (
                            <span className="text-foreground-600">
                              {levelCycle.enrolled}
                            </span>
                          )}
                          {levelCycle.capacity && (
                            <span className="text-foreground-500">
                              / {levelCycle.capacity} capacity
                            </span>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
              </div>

              {/* Simplified Lists */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Core Learning Areas:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {firstFiveSubjects.length > 0 ? (
                      firstFiveSubjects.map((subject, index) => (
                        <Chip
                          key={index}
                          color="secondary"
                          variant="flat"
                          size="sm"
                        >
                          {subject}
                        </Chip>
                      ))
                    ) : (
                      <span className="text-sm text-foreground-500">
                        No subjects available
                      </span>
                    )}
                  </div>
                  {hasMoreSubjects && (
                    <Button
                      variant="flat"
                      color="default"
                      onPress={onSubjectsOpen}
                      className="w-full mt-3"
                    >
                      Explore the full curriculum
                    </Button>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Joyful Activities & Celebrations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {firstFiveActivities.length > 0 ? (
                      firstFiveActivities.map((activity, index) => (
                        <Chip
                          key={index}
                          color="primary"
                          variant="flat"
                          size="sm"
                        >
                          {activity.title}
                        </Chip>
                      ))
                    ) : (
                      <span className="text-sm text-foreground-500">
                        No activities available
                      </span>
                    )}
                  </div>
                  {hasMoreActivities && (
                    <Button
                      variant="flat"
                      color="default"
                      onPress={onActivitiesOpen}
                      className="w-full mt-3"
                    >
                      See all {activities.length} activities
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Drawer for detailed curriculum */}
      <Drawer
        isOpen={isSubjectsOpen}
        size="full"
        placement="bottom"
        backdrop="opaque"
        onOpenChange={onSubjectsOpenChange}
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
          <DrawerHeader className="border-b border-divider">
            <h3 className="text-lg font-semibold text-foreground">
              Curriculum Breakdown
            </h3>
          </DrawerHeader>
          <DrawerBody className="mt-4">
            {displayLevel?.courses && displayLevel.courses.length > 0 && (
              <div className="space-y-4">
                {displayLevel.courses.map((course) => (
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
                                className="bg-default-100 rounded-lg p-2 sm:p-3"
                              >
                                <h5 className="font-medium text-foreground text-sm mb-2">
                                  {unitIndex + 1}. {unit.title}
                                </h5>
                                {unit.topics.length > 0 && (
                                  <ul className="space-y-1">
                                    {unit.topics.map((topic, topicIndex) => (
                                      <li
                                        key={topicIndex}
                                        className="text-sm text-foreground-600 flex items-start gap-2"
                                      >
                                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
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

      {/* Drawer for activities */}
      <Drawer
        isOpen={isActivitiesOpen}
        size="full"
        placement="bottom"
        backdrop="opaque"
        onOpenChange={onActivitiesOpenChange}
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
          <DrawerHeader className="border-b border-divider">
            <h3 className="text-lg font-semibold text-foreground">
              All Activities
            </h3>
          </DrawerHeader>
          <DrawerBody className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-default-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {activity.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
