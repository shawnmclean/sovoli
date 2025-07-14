"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { BookOpenIcon } from "lucide-react";
import type { OrgProgram } from "~/modules/academics/types";
import { useProgramSelection } from "../context/ProgramSelectionContext";

interface CurriculumSectionProps {
  program: OrgProgram;
}

export function CurriculumSection({ program }: CurriculumSectionProps) {
  const { selectedCycle } = useProgramSelection();
  const levels = program.levels ?? program.standardProgramVersion?.levels ?? [];

  if (levels.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpenIcon className="h-6 w-6 text-primary" />
          Curriculum Overview
        </h2>
      </CardHeader>
      <CardBody className="space-y-6">
        {levels.map((level, levelIndex) => {
          // Find enrollment data for this level
          const levelCycle = selectedCycle?.levelCycles?.find(
            (lc) => lc.level.id === level.id,
          );

          return (
            <div key={level.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {levelIndex + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {level.label}
                    </h3>
                    {level.ageRange && (
                      <p className="text-sm text-foreground-600 mt-1">
                        Ages {level.ageRange.min}-{level.ageRange.max} years
                      </p>
                    )}
                  </div>
                </div>

                {/* Enrollment numbers */}
                {levelCycle && (levelCycle.capacity ?? levelCycle.enrolled) && (
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
                )}
              </div>

              {level.courses && level.courses.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  {level.courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-3 sm:p-4 bg-default-50 rounded-lg border border-default-200"
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
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
