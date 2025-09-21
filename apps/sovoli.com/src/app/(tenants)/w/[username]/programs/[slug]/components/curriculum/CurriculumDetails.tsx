"use client";

import { Chip } from "@sovoli/ui/components/chip";
import { BookOpenIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import { useEffect } from "react";

interface CurriculumDetailsProps {
  program: Program;
}

export function CurriculumDetails({ program }: CurriculumDetailsProps) {
  // Track analytics when component mounts
  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "curriculum",
    });
  }, [program]);

  // Check if program has whatYouWillLearn data
  if (program.whatYouWillLearn && program.whatYouWillLearn.length > 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <BookOpenIcon className="h-6 w-6 text-primary" />
          What {program.audience === "parent" ? "Your Child" : "You"} Will Learn
        </h1>

        <div className="space-y-6">
          {program.whatYouWillLearn.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-default-200 pb-2">
                {group.heading}
              </h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-default-50 rounded-lg border border-default-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground text-sm">
                        {item.title}
                      </h4>
                      {item.tag && (
                        <Chip color="primary" variant="flat" size="sm">
                          {item.tag}
                        </Chip>
                      )}
                    </div>
                    <p className="text-sm text-foreground-600">{item.blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fall back to traditional course-based curriculum
  if (program.courses && program.courses.length > 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <BookOpenIcon className="h-6 w-6 text-primary" />
          Curriculum Breakdown
        </h1>

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
                          className="p-2 sm:p-3 bg-background rounded border border-default-200"
                        >
                          <h5 className="font-medium text-foreground text-sm mb-1">
                            {unit.title}
                          </h5>
                          {unit.topics.length > 0 && (
                            <ul className="space-y-1">
                              {unit.topics.map((topic, topicIndex) => (
                                <li
                                  key={topicIndex}
                                  className="text-xs text-foreground-600 flex items-start gap-2"
                                >
                                  <span className="shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></span>
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
      </div>
    );
  }

  // If no curriculum data available
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <BookOpenIcon className="h-6 w-6 text-primary" />
        Curriculum
      </h1>

      <div className="text-center text-foreground-600">
        <p>Curriculum information is not available for this program.</p>
      </div>
    </div>
  );
}
