"use client";

import { useState, useEffect } from "react";
import { Chip } from "@sovoli/ui/components/chip";
import { BookOpenIcon, ChevronRightIcon, CheckIcon } from "lucide-react";
import Markdown from "react-markdown";
import type { Program, CourseUnit, Course } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@sovoli/ui/components/drawer";
import { SubscribeProgramButton } from "../SubscribeProgramButton";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";

interface CurriculumDetailsProps {
  program: Program;
}

type ViewState =
  | { type: "overview" }
  | { type: "unit"; unit: CourseUnit; course: Course };

export function CurriculumDetails({ program }: CurriculumDetailsProps) {
  const [viewState, setViewState] = useState<ViewState>({ type: "overview" });

  // Track analytics when component mounts
  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "curriculum",
    });
  }, [program]);

  const handleUnitClick = (unit: CourseUnit, course: Course) => {
    setViewState({ type: "unit", unit, course });
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "unit-detail",
      unitId: unit.id,
    });
  };

  const handleBack = () => {
    setViewState({ type: "overview" });
  };

  // Render overview (capabilities + courses)
  const renderOverview = (onClose: () => void) => (
    <>
      <DrawerHeader
        showBackButton
        onBackPress={onClose}
        endContent={
          <>
            <ShareButton
              title="Share"
              variant="light"
              text={`Check out ${program.name} curriculum.`}
            />
            <SubscribeProgramButton program={program} variant="light" />
          </>
        }
      />
      <DrawerBody>
        <div className="space-y-8 pb-8">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            What {program.audience === "parent" ? "Your Child" : "You"} Will
            Learn
          </h1>

          {/* Capabilities Section */}
          {program.capabilities && program.capabilities.length > 0 ? (
            <div className="space-y-6">
              {program.capabilities.map((capability) => (
                <div key={capability.outcome} className="space-y-3">
                  <div className="border-b border-default-200 pb-2">
                    <h3 className="text-lg font-semibold text-foreground prose prose-sm dark:prose-invert max-w-none">
                      <Markdown
                        components={{
                          p: ({ children }) => (
                            <span className="m-0">{children}</span>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-foreground">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {capability.outcome}
                      </Markdown>
                    </h3>
                    {capability.description && (
                      <p className="text-sm text-foreground-600 mt-1">
                        {capability.description}
                      </p>
                    )}
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-1">
                    {capability.competencies.map((competency) => (
                      <li
                        key={competency.statement}
                        className="flex items-start gap-2 text-foreground-700 bg-default-50 p-3 rounded-md"
                      >
                        <CheckIcon className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm">{competency.statement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : program.whatYouWillLearn &&
            program.whatYouWillLearn.length > 0 ? (
            // Fallback for legacy data if any remains
            <div className="space-y-6">
              {program.whatYouWillLearn.map((group) => (
                <div key={group.heading} className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground border-b border-default-200 pb-2">
                    {group.heading}
                  </h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start gap-2 text-foreground-700"
                      >
                        <CheckIcon className="h-5 w-5 text-primary shrink-0" />
                        <div>
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                          <p className="text-xs text-foreground-500">
                            {item.blurb}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          {/* Courses Section */}
          {program.courses && program.courses.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-default-200">
              <h2 className="text-xl font-semibold text-foreground">
                Course Structure
              </h2>
              {program.courses.map((course) => (
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
                            <button
                              key={unit.id ?? `${course.id}-${unitIndex}`}
                              type="button"
                              onClick={() => handleUnitClick(unit, course)}
                              className="w-full text-left p-2 sm:p-3 bg-background rounded border border-default-200 hover:bg-default-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-foreground text-sm">
                                  {unit.title}
                                </h5>
                                <ChevronRightIcon className="h-4 w-4 text-foreground-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!program.capabilities?.length &&
            !program.whatYouWillLearn?.length &&
            !program.courses?.length && (
              <div className="text-center text-foreground-600">
                <p>Curriculum information is not available for this program.</p>
              </div>
            )}
        </div>
      </DrawerBody>
    </>
  );

  // Render course unit detail view
  const renderUnitView = (unit: CourseUnit, course: Course) => {
    return (
      <>
        <DrawerHeader showBackButton onBackPress={handleBack} />
        <DrawerBody>
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-foreground-500">
              <span>{course.subject.name}</span>
              <ChevronRightIcon className="h-4 w-4" />
              <span className="text-foreground font-medium">{unit.title}</span>
            </div>

            {/* Unit Header */}
            <div>
              <Chip color="secondary" variant="flat" size="sm" className="mb-3">
                {course.subject.name}
              </Chip>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {unit.title}
              </h1>
              <p className="text-sm text-foreground-500">{course.title}</p>
            </div>

            {/* Topics */}
            {unit.topics.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground border-b border-default-200 pb-2">
                  Topics Covered
                </h2>
                <ul className="space-y-2">
                  {unit.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-2 text-foreground-600"
                    >
                      <span className="shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DrawerBody>
      </>
    );
  };

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          {viewState.type === "overview" && renderOverview(onClose)}
          {viewState.type === "unit" &&
            renderUnitView(viewState.unit, viewState.course)}
        </>
      )}
    </DrawerContent>
  );
}
