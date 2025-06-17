import React from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Avatar } from "@sovoli/ui/components/avatar";
import type {
  OrgInstance,
  ScoringDimension,
} from "~/modules/organisations/types";
import type { Program } from "~/modules/academics/types";
import { Chip } from "@sovoli/ui/components/chip";
import { StarIcon } from "lucide-react";

interface PrivateSchoolListItemProps {
  orgInstance: OrgInstance;
}

export function PrivateSchoolListItem({
  orgInstance: { org, scoringModule, academicModule },
}: PrivateSchoolListItemProps) {
  // Map orgInstance to the School interface used in SovoliCard
  const school = {
    logo: org.logo,
    name: org.name,
    location: { city: org.locations[0]?.address.city ?? "Unknown" },
    score: { total: scoringModule?.totalScore ?? 0 },
    programs: (academicModule?.programs ?? []).map((p: Program) => p.name),
    distance: 0, // Not available, hardcoded
    tuition: "N/A", // Not available, hardcoded
    specialty: undefined, // Not available
    website: org.socialLinks?.find((link) => link.platform === "website")?.url,
    verified: org.isVerified ?? false,
    slug: org.username,
  };

  const truncatePrograms = (programs: string[]) => {
    if (programs.length <= 5) return programs.join(" · ");
    return `${programs.slice(0, 5).join(" · ")} +${programs.length - 5} more`;
  };

  return (
    <Card className="w-full">
      <CardBody className="gap-2">
        <div className="flex items-center gap-3">
          {/* <Badge
            isOneChar
            color={school.verified ? "success" : "default"}
            content={school.verified ? <StarIcon className="w-4 h-4" /> : null}
          > */}
          <Avatar src={school.logo} name={school.name} size="md" />
          {/* </Badge> */}
          <div className="flex-grow">
            <h2 className="text-md font-bold line-clamp-1">{school.name}</h2>
            <p className="text-xs text-default-500">{school.location.city}</p>
          </div>
        </div>

        <p className="text-xs text-default-500">
          Programs: {truncatePrograms(school.programs)}
        </p>

        {/* Scoring Section */}
        <div className="mt-2 p-3 bg-default-100 rounded-lg">
          <div className="flex items-center mb-2 gap-2">
            <span className="font-semibold text-sm">
              Score: {school.score.total}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {["digitalScore", "academicScore"].map((key) => {
              const labelMap: Record<string, string> = {
                digitalScore: "Digital Readiness",
                academicScore: "Academic Strength",
              };
              const label = labelMap[key] ?? key;
              const dim = scoringModule?.[key as keyof typeof scoringModule] as
                | ScoringDimension
                | undefined;
              const score = dim?.score ?? 0;
              const maxScore = dim?.maxScore ?? 0;
              const percent = maxScore ? (score / maxScore) * 100 : 0;
              const color =
                percent >= 80
                  ? "success"
                  : percent >= 50
                    ? "warning"
                    : "default";
              return (
                <Chip
                  key={key}
                  size="sm"
                  color={color}
                  variant="flat"
                  className="text-xs flex items-center gap-1"
                >
                  <span>{label}: </span>
                  <span>{score}</span>
                  <span className="text-[10px] text-default-400">/</span>
                  <span>{maxScore}</span>
                </Chip>
              );
            })}
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <Button
          color="primary"
          as="a"
          href={`/orgs/${school.slug}`}
          fullWidth
          size="sm"
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
