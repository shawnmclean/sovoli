"use client";

import { useMemo } from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { UserIcon } from "lucide-react";
import type { WorkforceMember } from "~/modules/workforce/types";
import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";
import type { Program } from "~/modules/academics/types";
import Link from "next/link";

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
  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="pb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-primary" />
          Meet Your Teacher
        </h2>
      </div>
      <div>
        <div className="flex flex-col items-center gap-4">
          <Avatar
            src={teacher.image}
            name={teacher.name}
            className="h-24 w-24"
            isBordered
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {teacher.name}
            </h3>
            {teacher.quote && (
              <div className="mt-3 relative">
                <span className="absolute -left-2 -top-2 text-2xl text-default-300">
                  "
                </span>
                <p className="text-sm italic text-foreground-600 pl-4">
                  {teacher.quote}
                </p>
                <span className="absolute -right-2 -bottom-2 text-2xl text-default-300">
                  "
                </span>
              </div>
            )}
            {teacher.bio && (
              <p className="text-sm text-foreground-600 mt-3 line-clamp-2">
                {teacher.bio}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            variant="flat"
            color="default"
            className="mt-2"
            fullWidth
            href={`/programs/${program.slug}/teachers`}
            as={Link}
          >
            Learn More
          </Button>
        </div>
      </div>
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
                    <div className="flex flex-col items-center gap-3 p-4 bg-default-50 rounded-lg border border-default-200 hover:border-primary-400 transition-colors h-full">
                      <Avatar
                        src={teacher.image}
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
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            variant="flat"
            color="default"
            className="mt-3"
            fullWidth
            href={`/programs/${program.slug}/teachers`}
            as={Link}
          >
            View All Teachers
          </Button>
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
