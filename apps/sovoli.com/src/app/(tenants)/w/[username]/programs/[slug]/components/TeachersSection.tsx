"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  GraduationCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import type { WorkforceMember } from "~/modules/workforce/types";
import { useProgramCycleSelection } from "../context/ProgramCycleSelectionContext";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import type { Program } from "~/modules/academics/types";

interface TeachersSectionProps {
  defaultTeachers?: WorkforceMember[] | null;
  program: Program;
}

function getPrimaryRole(member: WorkforceMember) {
  return (
    member.roleAssignments.find((r) => r.isPrimary) ?? member.roleAssignments[0]
  );
}

function getPublicContact(member: WorkforceMember, type: "email" | "phone") {
  return (
    member.contacts?.find((c) => c.type === type && c.isPublic)?.value ?? ""
  );
}

// Component for single teacher display
function SingleTeacherSection({
  teacher,
  program,
}: {
  teacher: WorkforceMember;
  program: Program;
}) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const detailedView = (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar
          src={teacher.image}
          name={teacher.name}
          className="h-32 w-32"
          isBordered
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{teacher.name}</h2>
          {getPrimaryRole(teacher) && (
            <p className="text-lg text-foreground-600 mt-1">
              {getPrimaryRole(teacher)?.titleOverride ??
                getPrimaryRole(teacher)?.position.name}
            </p>
          )}
        </div>
      </div>

      {teacher.quote && (
        <div className="relative">
          <span className="absolute -left-2 -top-2 text-4xl text-default-300">
            "
          </span>
          <p className="text-lg italic text-foreground-600 pl-4">
            {teacher.quote}
          </p>
          <span className="absolute -right-2 -bottom-2 text-4xl text-default-300">
            "
          </span>
        </div>
      )}

      {teacher.bio && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">About</h3>
          <div className="text-foreground-600">
            <p className={isBioExpanded ? "" : "line-clamp-3"}>{teacher.bio}</p>
            {teacher.bio.length > 150 && (
              <button
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="flex items-center gap-1 hover:underline mt-2 text-sm font-bold"
              >
                {isBioExpanded ? (
                  <>
                    <ChevronUpIcon className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-4 w-4" />
                    Read More
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {(getPublicContact(teacher, "email") ||
        getPublicContact(teacher, "phone")) && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Contact
          </h3>
          <div className="space-y-2">
            {getPublicContact(teacher, "email") && (
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-foreground-500" />
                <a
                  href={`mailto:${getPublicContact(teacher, "email")}`}
                  className="text-primary hover:underline"
                >
                  {getPublicContact(teacher, "email")}
                </a>
              </div>
            )}
            {getPublicContact(teacher, "phone") && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-foreground-500" />
                <a
                  href={`tel:${getPublicContact(teacher, "phone")}`}
                  className="text-primary hover:underline"
                >
                  {getPublicContact(teacher, "phone")}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Education Section */}
      {teacher.education && teacher.education.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <GraduationCapIcon className="h-4 w-4 text-primary" />
            Education
          </h3>
          <div className="space-y-2">
            {teacher.education.map((edu, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-foreground">
                  {edu.level}
                  {edu.honors && (
                    <span className="ml-2 text-xs text-yellow-600">
                      ({edu.honors})
                    </span>
                  )}
                </div>
                {edu.field && (
                  <div className="text-foreground-600">{edu.field}</div>
                )}
                {edu.institution && (
                  <div className="text-foreground-500 text-xs">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                    {(edu.startDate ?? edu.endDate) && (
                      <span className="ml-2">
                        •{" "}
                        {edu.startDate && edu.endDate
                          ? `${edu.startDate} - ${edu.endDate}`
                          : (edu.startDate ?? edu.endDate)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const detailedViewTrigger = (onOpen: () => void) => (
    <Button
      variant="flat"
      color="default"
      onPress={onOpen}
      className="mt-2"
      fullWidth
    >
      Learn More
    </Button>
  );

  return (
    <ProgramSectionsWrapper
      program={program}
      section="teachers"
      detailedView={detailedView}
      detailedViewTrigger={detailedViewTrigger}
      detailedViewTitle={teacher.name}
    >
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
      </div>
    </ProgramSectionsWrapper>
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
  const [selectedTeacher, setSelectedTeacher] =
    useState<WorkforceMember | null>(null);

  const detailedView = selectedTeacher ? (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar
          src={selectedTeacher.image}
          name={selectedTeacher.name}
          className="h-32 w-32"
          isBordered
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {selectedTeacher.name}
          </h2>
          {getPrimaryRole(selectedTeacher) && (
            <p className="text-lg text-foreground-600 mt-1">
              {getPrimaryRole(selectedTeacher)?.titleOverride ??
                getPrimaryRole(selectedTeacher)?.position.name}
            </p>
          )}
        </div>
      </div>

      {selectedTeacher.quote && (
        <div className="relative">
          <span className="absolute -left-2 -top-2 text-4xl text-default-300">
            "
          </span>
          <p className="text-lg italic text-foreground-600 pl-4">
            {selectedTeacher.quote}
          </p>
          <span className="absolute -right-2 -bottom-2 text-4xl text-default-300">
            "
          </span>
        </div>
      )}

      {selectedTeacher.bio && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">About</h3>
          <p className="text-foreground-600">{selectedTeacher.bio}</p>
        </div>
      )}

      {/* Contact Information */}
      {(getPublicContact(selectedTeacher, "email") ||
        getPublicContact(selectedTeacher, "phone")) && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Contact
          </h3>
          <div className="space-y-2">
            {getPublicContact(selectedTeacher, "email") && (
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-foreground-500" />
                <a
                  href={`mailto:${getPublicContact(selectedTeacher, "email")}`}
                  className="text-primary hover:underline"
                >
                  {getPublicContact(selectedTeacher, "email")}
                </a>
              </div>
            )}
            {getPublicContact(selectedTeacher, "phone") && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-foreground-500" />
                <a
                  href={`tel:${getPublicContact(selectedTeacher, "phone")}`}
                  className="text-primary hover:underline"
                >
                  {getPublicContact(selectedTeacher, "phone")}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Education Section */}
      {selectedTeacher.education && selectedTeacher.education.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <GraduationCapIcon className="h-4 w-4 text-primary" />
            Education
          </h3>
          <div className="space-y-2">
            {selectedTeacher.education.map((edu, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-foreground">
                  {edu.level}
                  {edu.honors && (
                    <span className="ml-2 text-xs text-yellow-600">
                      ({edu.honors})
                    </span>
                  )}
                </div>
                {edu.field && (
                  <div className="text-foreground-600">{edu.field}</div>
                )}
                {edu.institution && (
                  <div className="text-foreground-500 text-xs">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                    {(edu.startDate ?? edu.endDate) && (
                      <span className="ml-2">
                        •{" "}
                        {edu.startDate && edu.endDate
                          ? `${edu.startDate} - ${edu.endDate}`
                          : (edu.startDate ?? edu.endDate)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="space-y-4">
      {teachers.map((teacher) => (
        <div
          key={teacher.id}
          className="p-4 bg-default-50 rounded-lg border border-default-200 cursor-pointer hover:border-primary-400 transition-colors"
          onClick={() => setSelectedTeacher(teacher)}
        >
          <div className="flex items-center gap-4">
            <Avatar
              src={teacher.image}
              name={teacher.name}
              className="h-16 w-16"
              isBordered
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">
                {teacher.name}
              </h3>
              {getPrimaryRole(teacher) && (
                <p className="text-foreground-600">
                  {getPrimaryRole(teacher)?.titleOverride ??
                    getPrimaryRole(teacher)?.position.name}
                </p>
              )}
              {teacher.quote && (
                <p className="text-sm text-foreground-600 mt-2 italic">
                  "{teacher.quote}"
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const detailedViewTrigger = (onOpen: () => void) => (
    <Button
      variant="flat"
      color="default"
      onPress={onOpen}
      className="mt-3"
      fullWidth
    >
      {selectedTeacher
        ? `Learn More About ${selectedTeacher.name}`
        : "View All Teachers"}
    </Button>
  );

  return (
    <ProgramSectionsWrapper
      program={program}
      section="teacher_highlights"
      detailedView={detailedView}
      detailedViewTrigger={detailedViewTrigger}
      detailedViewTitle="Meet Your Teachers"
    >
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
                    <div
                      className="flex flex-col items-center gap-3 p-4 bg-default-50 rounded-lg border border-default-200 hover:border-primary-400 transition-colors cursor-pointer h-full"
                      onClick={() => setSelectedTeacher(teacher)}
                    >
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
      </div>
    </ProgramSectionsWrapper>
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
