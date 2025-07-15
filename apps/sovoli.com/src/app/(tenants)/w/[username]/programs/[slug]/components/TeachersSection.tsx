"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { UserIcon, MailIcon, PhoneIcon } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import type { OrgProgram, ProgramLevel } from "~/modules/academics/types";
import type { WorkforceMember } from "~/modules/workforce/types";
import { useProgramSelection } from "../context/ProgramSelectionContext";

interface TeachersSectionProps {
  orgInstance: OrgInstance;
  program: OrgProgram;
  defaultLevel?: ProgramLevel | null;
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

export function TeachersSection({
  orgInstance: _orgInstance,
  program: _program,
  defaultLevel,
}: TeachersSectionProps) {
  const { selectedCycle, selectedLevel } = useProgramSelection();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTeacher, setSelectedTeacher] =
    useState<WorkforceMember | null>(null);

  // Use defaultLevel for SSR, fallback to selectedLevel for client
  const displayLevel = selectedLevel ?? defaultLevel;

  // Get teachers for the current level and cycle
  const teachers = useMemo(() => {
    if (!selectedCycle || !displayLevel) return [];

    const levelCycle = selectedCycle.levelCycles?.find(
      (lc) => lc.level.id === displayLevel.id,
    );

    return levelCycle?.teachers ?? [];
  }, [selectedCycle, displayLevel]);

  const handleTeacherClick = (teacher: WorkforceMember) => {
    setSelectedTeacher(teacher);
    onOpen();
  };

  if (teachers.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary" />
            Your Teachers
          </h2>
        </CardHeader>
        <CardBody>
          <div className="prose prose-sm max-w-none text-foreground-700">
            <p className="text-center text-foreground-600">
              Teacher information will be available soon.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // If only one teacher, show centered
  if (teachers.length === 1) {
    const teacher = teachers[0];
    if (!teacher) return null;

    const primaryRole = getPrimaryRole(teacher);
    const displayTitle =
      primaryRole?.titleOverride ?? primaryRole?.position.name;

    return (
      <>
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-primary" />
              Your Teacher
            </h2>
          </CardHeader>
          <CardBody>
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
              <Button
                variant="flat"
                color="primary"
                onPress={() => handleTeacherClick(teacher)}
                className="mt-2"
              >
                Learn More
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Teacher Details Drawer */}
        <Drawer
          isOpen={isOpen}
          size="full"
          placement="bottom"
          backdrop="opaque"
          onOpenChange={onOpenChange}
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
                {selectedTeacher?.name}
              </h3>
            </DrawerHeader>
            <DrawerBody className="mt-4">
              {selectedTeacher && (
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
                      {displayTitle && (
                        <p className="text-lg text-foreground-600 mt-1">
                          {displayTitle}
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
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        About
                      </h3>
                      <p className="text-foreground-600">
                        {selectedTeacher.bio}
                      </p>
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
                </div>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Multiple teachers - show grid
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary" />
            Your Teachers
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => {
              const primaryRole = getPrimaryRole(teacher);
              const displayTitle =
                primaryRole?.titleOverride ?? primaryRole?.position.name;

              return (
                <div
                  key={teacher.id}
                  className="flex flex-col items-center gap-3 p-4 bg-default-50 rounded-lg border border-default-200 hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => handleTeacherClick(teacher)}
                >
                  <Avatar
                    src={teacher.image}
                    name={teacher.name}
                    className="h-16 w-16"
                    isBordered
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground text-sm">
                      {teacher.name}
                    </h3>
                    {displayTitle && (
                      <p className="text-xs text-foreground-600 mt-1">
                        {displayTitle}
                      </p>
                    )}
                    {teacher.quote && (
                      <p className="text-xs text-foreground-600 mt-2 line-clamp-2">
                        "{teacher.quote}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Teacher Details Drawer */}
      <Drawer
        isOpen={isOpen}
        size="full"
        placement="bottom"
        backdrop="opaque"
        onOpenChange={onOpenChange}
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
              {selectedTeacher?.name}
            </h3>
          </DrawerHeader>
          <DrawerBody className="mt-4">
            {selectedTeacher && (
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
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      About
                    </h3>
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
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
