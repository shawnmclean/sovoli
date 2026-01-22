"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { ChevronRight, UserIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { Program } from "~/modules/academics/types";
import type { WorkforceMember } from "~/modules/workforce/types";
import { getMemberDisplayTitle } from "~/modules/workforce/utils";
import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";

interface TeachersSectionProps {
  defaultTeachers?: WorkforceMember[] | null;
  program: Program;
}

// Component for single teacher display
function SingleTeacherSection({
  teacher,
  program,
}: {
  teacher: WorkforceMember;
  program: Program;
}) {
  const displayTitle = getMemberDisplayTitle(teacher);

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="pb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-primary" />
          Meet Your Teacher
        </h2>
      </div>
      <Link href={`/programs/${program.slug}/teachers`} className="block">
        <Card className="hover:border-primary-400 transition-colors cursor-pointer relative">
          <CardBody className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar
                src={teacher.photo?.url}
                name={teacher.name}
                className="h-24 w-24"
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {teacher.name}
                </h3>
                {teacher.quickfacts && teacher.quickfacts.length > 0 ? (
                  <p className="text-sm text-foreground-500 mt-1">
                    {teacher.quickfacts.map((fact, index) => (
                      <span key={fact}>
                        <span className="inline-block whitespace-nowrap">
                          {fact}
                        </span>
                        {index < (teacher.quickfacts?.length ?? 0) - 1 && (
                          <span className="mx-1">•</span>
                        )}
                      </span>
                    ))}
                  </p>
                ) : (
                  displayTitle && (
                    <p className="text-sm text-foreground-600 mt-1">
                      {displayTitle}
                    </p>
                  )
                )}
              </div>
            </div>
            {teacher.highlights && teacher.highlights.length > 0 && (
              <div className="mt-4">
                <ul className="text-sm text-foreground-600 space-y-1 list-disc list-inside">
                  {teacher.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center justify-center mt-4">
              <span className="text-sm font-medium">View Full Portfolio</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardBody>
        </Card>
      </Link>
    </section>
  );
}

// Component for multiple teachers display
function MultipleTeachersSection({
  teachers,
  program,
}: {
  teachers: WorkforceMember[];
  program: Program;
}) {
  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="pb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-primary" />
          Meet Your Teachers
        </h2>
      </div>
      <div>
        <div className="w-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {teachers.map((teacher) => {
                return (
                  <CarouselItem key={teacher.id} className="basis-[200px]">
                    <Link
                      href={`/programs/${program.slug}/teachers`}
                      className="block h-full"
                    >
                      <Card className="hover:border-primary-400 transition-colors cursor-pointer h-full">
                        <CardBody className="p-6">
                          <div className="flex flex-col items-center gap-3">
                            <Avatar
                              src={teacher.photo?.url}
                              name={teacher.name}
                              className="h-16 w-16"
                              isBordered
                            />
                            <div className="text-center flex-1">
                              <h3 className="font-semibold text-foreground text-sm">
                                {teacher.name}
                              </h3>

                              {teacher.quote && (
                                <p className="text-xs text-foreground-600 mt-2 line-clamp-2">
                                  "{teacher.quote}"
                                </p>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export function TeachersSection({
  defaultTeachers,
  program,
}: TeachersSectionProps) {
  const { selectedCycle } = useProgramCycleSelection();

  // Get teachers for the current level and cycle
  const teachers = useMemo(() => {
    // If we have a selected cycle, use the dynamic teachers
    if (selectedCycle) {
      return selectedCycle.teachers ?? [];
    }

    // Otherwise, use defaultTeachers if available
    return defaultTeachers ?? [];
  }, [selectedCycle, defaultTeachers]);

  if (teachers.length === 0) {
    return null;
  }

  // If only one teacher, show single teacher section
  if (teachers.length === 1) {
    const teacher = teachers[0];
    if (!teacher) return null;
    return <SingleTeacherSection teacher={teacher} program={program} />;
  }

  // If multiple teachers, show multiple teachers section
  return <MultipleTeachersSection teachers={teachers} program={program} />;
}
