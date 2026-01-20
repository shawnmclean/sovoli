"use client";

import { useMemo, useState, useEffect } from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import type { WorkforceMember } from "~/modules/workforce/types";
import type { Program } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import { useProgramCycleSelection } from "../../context/ProgramCycleSelectionContext";
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@sovoli/ui/components/drawer";
import { SubscribeProgramButton } from "../SubscribeProgramButton";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";
import { MemberDetailsContent } from "~/modules/workforce/components/MemberDetailsContent";
import { getMemberDisplayTitle } from "~/modules/workforce/utils";

interface TeachersDetailsProps {
  defaultTeachers?: WorkforceMember[] | null;
  program: Program;
}

// Component for single teacher detailed display
function SingleTeacherDetails({
  teacher,
  program,
}: {
  teacher: WorkforceMember;
  program: Program;
}) {
  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader
            showBackButton
            onBackPress={onClose}
            endContent={
              <>
                <ShareButton
                  title="Share"
                  variant="light"
                  text={`Check out ${program.name} teachers.`}
                />
                <SubscribeProgramButton program={program} variant="light" />
              </>
            }
          />
          <DrawerBody>
            <MemberDetailsContent member={teacher} />
          </DrawerBody>
        </>
      )}
    </DrawerContent>
  );
}

// Component for multiple teachers detailed display
function MultipleTeachersDetails({
  teachers,
  program,
}: {
  teachers: WorkforceMember[];
  program: Program;
}) {
  const [selectedTeacher, setSelectedTeacher] =
    useState<WorkforceMember | null>(null);

  if (selectedTeacher) {
    return <SingleTeacherDetails teacher={selectedTeacher} program={program} />;
  }

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader
            showBackButton
            onBackPress={onClose}
            endContent={
              <>
                <ShareButton
                  title="Share"
                  variant="light"
                  text={`Check out ${program.name} teachers.`}
                />
                <SubscribeProgramButton program={program} variant="light" />
              </>
            }
          />
          <DrawerBody>
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-foreground">
                Meet Your Teachers
              </h1>

              <div className="space-y-4">
                {teachers.map((teacher) => (
                  <button
                    type="button"
                    key={teacher.id}
                    className="p-4 bg-default-50 rounded-lg border border-default-200 cursor-pointer hover:border-primary-400 transition-colors text-left w-full"
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    {(() => {
                      const displayTitle = getMemberDisplayTitle(teacher);
                      return (
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={teacher.photo?.url}
                        name={teacher.name}
                        className="h-16 w-16"
                        isBordered
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">
                          {teacher.name}
                        </h3>
                        {displayTitle ? (
                          <p className="text-foreground-600">{displayTitle}</p>
                        ) : null}
                      </div>
                    </div>
                      );
                    })()}
                  </button>
                ))}
              </div>
            </div>
          </DrawerBody>
        </>
      )}
    </DrawerContent>
  );
}

export function TeachersDetails({
  defaultTeachers,
  program,
}: TeachersDetailsProps) {
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

  // Track analytics when component mounts
  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "teachers",
    });
  }, [program]);

  if (teachers.length === 0) {
    return null;
  }

  // If only one teacher, show single teacher details
  if (teachers.length === 1) {
    const teacher = teachers[0];
    if (!teacher) return null;
    return <SingleTeacherDetails teacher={teacher} program={program} />;
  }

  // If multiple teachers, show multiple teachers details
  return <MultipleTeachersDetails teachers={teachers} program={program} />;
}
