"use client";

import { useMemo, useState, useEffect } from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import {
  MailIcon,
  PhoneIcon,
  GraduationCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
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
import { CredentialsSection } from "./CredentialsSection";

interface TeachersDetailsProps {
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

// Component for single teacher detailed display
function SingleTeacherDetails({
  teacher,
  program,
}: {
  teacher: WorkforceMember;
  program: Program;
}) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

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
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  src={teacher.photo?.url}
                  name={teacher.name}
                  className="h-32 w-32"
                  isBordered
                />
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">
                    {teacher.name}
                  </h2>
                  {getPrimaryRole(teacher) && (
                    <p className="text-lg text-foreground-600 mt-1">
                      {getPrimaryRole(teacher)?.titleOverride ??
                        getPrimaryRole(teacher)?.position.name}
                    </p>
                  )}
                </div>
              </div>

              {teacher.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    About
                  </h3>
                  <div className="text-foreground-600">
                    <p className={isBioExpanded ? "" : "line-clamp-3"}>
                      {teacher.bio}
                    </p>
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

              {/* Credentials Section */}
              {teacher.credentials && teacher.credentials.length > 0 && (
                <CredentialsSection credentials={teacher.credentials} />
              )}
            </div>
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
                  <div
                    key={teacher.id}
                    className="p-4 bg-default-50 rounded-lg border border-default-200 cursor-pointer hover:border-primary-400 transition-colors"
                    onClick={() => setSelectedTeacher(teacher)}
                  >
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
                        {getPrimaryRole(teacher) && (
                          <p className="text-foreground-600">
                            {getPrimaryRole(teacher)?.titleOverride ??
                              getPrimaryRole(teacher)?.position.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
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
