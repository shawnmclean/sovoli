import { Card, CardBody } from "@sovoli/ui/components/card";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { InfoIcon } from "lucide-react";

import type { Requirement } from "../../programsData";
import { programsData } from "../../programsData";

// General org-wide requirements (not tied to any specific program)
const generalRequirements: Requirement[] = [
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

function renderRequirement(req: Requirement, index: number) {
  let label = "";
  if (req.type === "document") {
    label = req.name ?? "Required Document";
  } else if (req.type === "age") {
    const { minAgeYears, minAgeMonths, maxAgeYears, maxAgeMonths } =
      req.ageRange && {};
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
    <li key={index} className="flex items-start gap-2">
      <span className="text-foreground-700">{label}</span>
      {req.description && (
        <Tooltip content={req.description}>
          <InfoIcon className="mt-1 h-4 w-4 cursor-help text-foreground-400" />
        </Tooltip>
      )}
    </li>
  );
}

export default function RequirementsPage() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <h2 className="text-center text-3xl font-bold">
          Enrollment Requirements
        </h2>

        {/* General Requirements */}
        <Card className="border-none shadow-sm">
          <CardBody>
            <h3 className="mb-3 text-xl font-semibold">General Requirements</h3>
            <ul className="list-inside list-disc space-y-2">
              {generalRequirements.map((req, i) => renderRequirement(req, i))}
            </ul>
          </CardBody>
        </Card>

        {/* Program-Specific Requirements */}
        {programsData.map((program) => (
          <Card key={program.id} className="border-none shadow-sm">
            <CardBody>
              <h3 className="mb-3 text-xl font-semibold">
                {program.name} Requirements
              </h3>
              {program.requirements?.length ? (
                <ul className="list-inside list-disc space-y-2">
                  {program.requirements.map((req, i) =>
                    renderRequirement(req, i),
                  )}
                </ul>
              ) : (
                <p className="text-sm text-foreground-500">
                  No specific requirements listed.
                </p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
