"use client";

import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";

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

interface CurriculumSectionProps {
  program: Program;
}

export function CurriculumSection({ program }: CurriculumSectionProps) {
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

  // Extract unique subjects and activities from the current level
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

  const activities = useMemo(() => {
    return program.activities ?? [];
  }, [program]);

  // Show first 5 of each
  const firstFiveSubjects = subjects.slice(0, 5);
  const firstFiveActivities = activities.slice(0, 5);
  const hasMoreSubjects = subjects.length > 5;
  const hasMoreActivities = activities.length > 5;

  return (
    <section className="flex flex-col gap-6">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            What {program.audience === "parent" ? "Your Child" : "You"} Will
            Learn
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
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
                    <Chip key={index} color="primary" variant="flat" size="sm">
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
        </CardBody>
      </Card>

      <Divider className="mx-auto max-w-2xl" />

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
              Activities & Celebrations
            </h3>
          </DrawerHeader>
          <DrawerBody className="mt-4">
            {activities.length > 0 && (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 bg-default-50 rounded-lg border border-default-200"
                  >
                    <h4 className="font-semibold text-foreground mb-2">
                      {activity.title}
                    </h4>
                    {activity.description && (
                      <p className="text-sm text-foreground-600">
                        {activity.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </section>
  );
}
