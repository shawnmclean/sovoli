"use client";

import { useMemo } from "react";

import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import type { OrgInstance } from "~/modules/organisations/types";
import { Badge } from "@sovoli/ui/components/badge";
import { Avatar } from "@sovoli/ui/components/avatar";
import { BadgeCheckIcon, GiftIcon, AwardIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";

interface OrgHighlightsSectionProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function OrgHighlightsSection({
  orgInstance,
  program,
}: OrgHighlightsSectionProps) {
  const org = orgInstance.org;

  const highlights = useMemo(
    () => [
      {
        title: "Award-Winning",
        description: "Acknowledged by the Ministry of Education",
        icon: <AwardIcon size={16} className="text-yellow-500" />,
      },
      {
        title: "Community Sponsored",
        description: "20+ books donated by Fit Right Academy",
        icon: <GiftIcon size={16} className="text-pink-500" />,
      },
    ],
    [],
  );

  if (org.username !== "magy") {
    return null;
  }

  const detailedView = (
    <div className="space-y-4">
      {highlights.map((h, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="pt-1">{h.icon}</div>
          <div>
            <div className="text-sm font-semibold">{h.title}</div>
            <div className="text-sm text-muted-foreground">{h.description}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ProgramSectionsWrapper
      program={program}
      section="org_highlights"
      detailedView={detailedView}
      sectionClickable={true}
      detailedViewTitle="All Organization Highlights"
    >
      <div className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Your School
          </h2>
        </div>

        <div className="space-y-4">
          {/* School Identity */}
          <div className="flex flex-col items-center gap-4">
            <Badge
              isOneChar
              color="success"
              content={<BadgeCheckIcon />}
              placement="bottom-right"
              shape="circle"
            >
              <Avatar
                src={org.logo}
                name={org.name}
                size="lg"
                fallback={
                  <span className="text-xs text-default-500">
                    Logo Not Available
                  </span>
                }
              />
            </Badge>
            <div className="text-center">
              <h2 className="font-bold text-lg flex items-center justify-center gap-2">
                {org.name}
              </h2>
            </div>
          </div>

          {/* School Highlights List */}
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="pt-1">{h.icon}</div>
                <div>
                  <div className="text-sm font-semibold">{h.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {h.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 underline text-muted-foreground">Learn More</div>
        </div>
      </div>
    </ProgramSectionsWrapper>
  );
}
