import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { UserIcon } from "lucide-react";
import { displayAgeRange } from "../../../(main-layout)/programs/utils";
import type { Program, ProgramRequirement } from "~/modules/academics/types";

interface RequirementsSectionProps {
  program: Program;
}

export function RequirementsSection({ program }: RequirementsSectionProps) {
  const requirements =
    program.requirements ?? program.standardProgramVersion?.requirements ?? [];

  if (requirements.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-primary" />
          Requirements
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {requirements.map(
            (requirement: ProgramRequirement, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-default-50 rounded-lg"
              >
                <Chip color="secondary" variant="flat" size="sm">
                  {requirement.type === "age" ? "Age" : "Document"}
                </Chip>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {requirement.description ?? requirement.name}
                  </p>
                  {requirement.type === "age" && requirement.ageRange && (
                    <p className="text-xs text-foreground-500">
                      {displayAgeRange(requirement.ageRange)}
                    </p>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </CardBody>
    </Card>
  );
}
