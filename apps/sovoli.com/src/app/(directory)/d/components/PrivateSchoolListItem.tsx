import React from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { Avatar } from "@sovoli/ui/components/avatar";
import type { OrgInstance } from "~/modules/organisations/types";
import { Program } from "~/modules/academics/types";
import { Badge } from "@sovoli/ui/components/badge";
import { CheckCheckIcon, StarIcon } from "lucide-react";

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
    if (programs.length <= 3) return programs.join(" · ");
    return `${programs.slice(0, 3).join(" · ")} +${programs.length - 3} more`;
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
            <p className="text-xs text-default-500">
              {school.location.city} · Score {school.score.total}
            </p>
          </div>
        </div>

        <p className="text-xs text-default-500">
          Programs: {truncatePrograms(school.programs)}
        </p>

        <div className="flex flex-wrap gap-1">
          {/* {school.verified && (
            <Chip size="sm" color="success" variant="flat" className="text-xs">
              Verified
            </Chip>
          )} */}
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
