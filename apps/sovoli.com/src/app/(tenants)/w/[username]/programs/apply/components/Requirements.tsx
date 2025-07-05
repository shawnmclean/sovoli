import { Card, CardBody } from "@sovoli/ui/components/card";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { CheckCircleIcon, InfoIcon } from "lucide-react";

import type { ProgramRequirement } from "~/modules/academics/types";

const generalRequirements: ProgramRequirement[] = [
  { type: "document", name: "Copy of Birth Certificate" },
  { type: "document", name: "Two Passport-Sized Photographs" },
  { type: "document", name: "Proof of Address" },
  { type: "document", name: "Parent/Guardian National ID (Front & Back)" },
  { type: "document", name: "Medical Records" },
  { type: "document", name: "Clinic Card (Immunization/Vaccine Records)" },
  {
    type: "document",
    name: "Transportation Info (e.g., Student Transport ID)",
  },
  {
    type: "document",
    name: "Previous School Record",
    description: "Only required for transfer students.",
  },
];

function renderRequirement(req: ProgramRequirement, index: number) {
  let label = "";
  if (req.type === "document") {
    label = req.name;
  } else if (req.ageRange) {
    const { minAgeYears, minAgeMonths, maxAgeYears, maxAgeMonths } =
      req.ageRange;
    const ageRange =
      [
        minAgeYears !== undefined ? `${minAgeYears}y` : "",
        minAgeMonths !== undefined ? `${minAgeMonths}m` : "",
      ]
        .filter(Boolean)
        .join(" ") +
      " - " +
      [
        maxAgeYears !== undefined ? `${maxAgeYears}y` : "",
        maxAgeMonths !== undefined ? `${maxAgeMonths}m` : "",
      ]
        .filter(Boolean)
        .join(" ");
    label = `Age Range: ${ageRange}`;
  }

  return (
    <li key={index} className="flex items-start gap-2 text-foreground-600">
      <CheckCircleIcon className="mt-0.5 h-5 w-5 text-primary-500" />
      <span className="flex-1">{label}</span>
      {req.description && (
        <Tooltip content={req.description} showArrow>
          <span className="cursor-help">
            <InfoIcon className="h-5 w-5 text-default-400" />
          </span>
        </Tooltip>
      )}
    </li>
  );
}

export function Requirements() {
  return (
    <div className="space-y-6" id="requirements">
      <Card shadow="sm" className="overflow-visible">
        <CardBody className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-foreground">
            General Requirements
          </h3>
          <ul className="space-y-3">
            {generalRequirements.map((req, i) => renderRequirement(req, i))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
