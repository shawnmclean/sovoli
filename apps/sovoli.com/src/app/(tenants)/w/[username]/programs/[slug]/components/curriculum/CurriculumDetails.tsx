"use client";

import { useState, useMemo, useEffect } from "react";
import { Chip } from "@sovoli/ui/components/chip";
import { Button } from "@sovoli/ui/components/button";
import { BookOpenIcon, ChevronRightIcon, ArrowLeftIcon } from "lucide-react";
import type {
  Program,
  Competency,
  CompetencyGroup,
  CourseUnit,
  Course,
} from "~/modules/academics/types";
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
  | { type: "groups" }
  | { type: "competency"; competency: Competency; groupHeading: string }
  | { type: "unit"; unit: CourseUnit; course: Course };

export function CurriculumDetails({ program }: CurriculumDetailsProps) {
  const [viewState, setViewState] = useState<ViewState>({ type: "groups" });

  // Track analytics when component mounts
  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "curriculum",
    });
  }, [program]);

  // Build a map of unit IDs to their CourseUnit + Course for navigation
  const unitMap = useMemo(() => {
    const map = new Map<string, { unit: CourseUnit; course: Course }>();
    program.courses?.forEach((course) => {
      course.units?.forEach((unit) => {
        if (unit.id) {
          map.set(unit.id, { unit, course });
        }
      });
    });
    return map;
  }, [program.courses]);

  // Get linked units for a competency
  const getLinkedUnits = (competency: Competency) => {
    if (!competency.unitIds) return [];
    return competency.unitIds
      .map((id) => unitMap.get(id))
      .filter(
        (item): item is { unit: CourseUnit; course: Course } =>
          item !== undefined,
      );
  };

  // Use competencies if available, otherwise convert legacy WYL
  const competencyGroups: CompetencyGroup[] = useMemo(() => {
    if (program.competencies && program.competencies.length > 0) {
      return program.competencies;
    }
    // Convert legacy whatYouWillLearn to CompetencyGroup format
    if (program.whatYouWillLearn && program.whatYouWillLearn.length > 0) {
      return program.whatYouWillLearn.map((group) => ({
        heading: group.heading,
        competencies: group.items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.blurb,
          tag: item.tag,
        })),
      }));
    }
    return [];
  }, [program.competencies, program.whatYouWillLearn]);

  const handleCompetencyClick = (
    competency: Competency,
    groupHeading: string,
  ) => {
    setViewState({ type: "competency", competency, groupHeading });
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "competency-detail",
      competencyId: competency.id,
    });
  };

  const handleUnitClick = (unit: CourseUnit, course: Course) => {
    setViewState({ type: "unit", unit, course });
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "unit-detail",
      unitId: unit.id,
    });
  };

  const handleBack = () => {
    if (viewState.type === "unit") {
      // Go back to competency view if we came from there
      setViewState({ type: "groups" });
    } else {
      setViewState({ type: "groups" });
    }
  };

  // Render competency groups list (default view)
  const renderGroupsView = (onClose: () => void) => (
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
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            What {program.audience === "parent" ? "Your Child" : "You"} Will
            Learn
          </h1>

          {competencyGroups.length > 0 ? (
            <div className="space-y-6">
              {competencyGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-default-200 pb-2">
                    {group.heading}
                  </h3>
                  <div className="space-y-3">
                    {group.competencies.map((competency) => (
                      <button
                        key={competency.id}
                        onClick={() =>
                          handleCompetencyClick(competency, group.heading)
                        }
                        className="w-full text-left p-4 bg-default-50 rounded-lg border border-default-200 hover:bg-default-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground text-sm">
                            {competency.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {competency.tag && (
                              <Chip color="primary" variant="flat" size="sm">
                                {competency.tag}
                              </Chip>
                            )}
                            <ChevronRightIcon className="h-4 w-4 text-foreground-400" />
                          </div>
                        </div>
                        <p className="text-sm text-foreground-600 line-clamp-2">
                          {competency.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : program.courses && program.courses.length > 0 ? (
            // Fallback to course view if no competencies
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
                            <button
                              key={unitIndex}
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
          ) : (
            <div className="text-center text-foreground-600">
              <p>Curriculum information is not available for this program.</p>
            </div>
          )}
        </div>
      </DrawerBody>
    </>
  );

  // Render competency detail view
  const renderCompetencyView = (
    competency: Competency,
    groupHeading: string,
  ) => {
    const linkedUnits = getLinkedUnits(competency);

    return (
      <>
        <DrawerHeader showBackButton onBackPress={handleBack} />
        <DrawerBody>
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-foreground-500">
              <span>{groupHeading}</span>
              <ChevronRightIcon className="h-4 w-4" />
              <span className="text-foreground font-medium">
                {competency.title}
              </span>
            </div>

            {/* Competency Header */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  {competency.title}
                </h1>
                {competency.tag && (
                  <Chip color="primary" variant="flat" size="sm">
                    {competency.tag}
                  </Chip>
                )}
              </div>
              <p className="text-foreground-600">{competency.description}</p>
            </div>

            {/* Linked Course Units */}
            {linkedUnits.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground border-b border-default-200 pb-2">
                  Course Units
                </h2>
                <p className="text-sm text-foreground-500">
                  This competency is taught in the following course units:
                </p>
                <div className="space-y-3">
                  {linkedUnits.map(({ unit, course }) => (
                    <button
                      key={unit.id}
                      onClick={() => handleUnitClick(unit, course)}
                      className="w-full text-left p-4 bg-default-50 rounded-lg border border-default-200 hover:bg-default-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Chip
                            color="secondary"
                            variant="flat"
                            size="sm"
                            className="mb-2"
                          >
                            {course.subject.name}
                          </Chip>
                          <h4 className="font-semibold text-foreground text-sm">
                            {unit.title}
                          </h4>
                          <p className="text-xs text-foreground-500 mt-1">
                            {course.title}
                          </p>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-foreground-400 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {linkedUnits.length === 0 && (
              <div className="p-4 bg-default-50 rounded-lg border border-default-200">
                <p className="text-sm text-foreground-500 text-center">
                  Course unit information will be available soon.
                </p>
              </div>
            )}
          </div>
        </DrawerBody>
      </>
    );
  };

  // Render course unit detail view
  const renderUnitView = (unit: CourseUnit, course: Course) => {
    // Get competencies linked to this unit
    const linkedCompetencies: Competency[] = [];
    competencyGroups.forEach((group) => {
      group.competencies.forEach((comp) => {
        if (unit.id && comp.unitIds?.includes(unit.id)) {
          linkedCompetencies.push(comp);
        }
      });
    });

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
                  {unit.topics.map((topic, topicIndex) => (
                    <li
                      key={topicIndex}
                      className="flex items-start gap-2 text-foreground-600"
                    >
                      <span className="shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Linked Competencies */}
            {linkedCompetencies.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground border-b border-default-200 pb-2">
                  Competencies Developed
                </h2>
                <div className="space-y-3">
                  {linkedCompetencies.map((competency) => (
                    <div
                      key={competency.id}
                      className="p-4 bg-default-50 rounded-lg border border-default-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground text-sm">
                          {competency.title}
                        </h4>
                        {competency.tag && (
                          <Chip color="primary" variant="flat" size="sm">
                            {competency.tag}
                          </Chip>
                        )}
                      </div>
                      <p className="text-sm text-foreground-600">
                        {competency.description}
                      </p>
                    </div>
                  ))}
                </div>
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
          {viewState.type === "groups" && renderGroupsView(onClose)}
          {viewState.type === "competency" &&
            renderCompetencyView(viewState.competency, viewState.groupHeading)}
          {viewState.type === "unit" &&
            renderUnitView(viewState.unit, viewState.course)}
        </>
      )}
    </DrawerContent>
  );
}
