import { notFound } from "next/navigation";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { CheckCircleIcon, InfoIcon } from "lucide-react";

import type { Requirement } from "../../programsData";
import { programsData } from "../../programsData";
import { ApplyCard } from "./components/ApplyCard";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramsApplyPageProps {
  params: Promise<{ username: string }>;
}
export default async function ProgramsApplyPage({
  params,
}: ProgramsApplyPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);
  return (
    <section className="my-10 px-4">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
          Apply to Our Programs
        </h2>

        <div className="mb-8 space-y-6">
          <ApplyCard orgInstance={orgInstance} />
        </div>

        <Divider className="my-5" />

        <div className="space-y-6">
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

          {/* Program-Specific Requirements */}
          {programsData.map((program) => (
            <Card key={program.id} shadow="sm" className="overflow-visible">
              <CardBody className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {program.name} Requirements
                </h3>
                {program.requirements?.length ? (
                  <ul className="space-y-3">
                    {program.requirements.map((req, i) =>
                      renderRequirement(req, i),
                    )}
                  </ul>
                ) : (
                  <p className="text-default-500">
                    No specific requirements listed.
                  </p>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

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
