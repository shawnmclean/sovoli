import { Card, CardBody } from "@sovoli/ui/components/card";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { InfoIcon } from "lucide-react";

const requirementsData = [
  {
    title: "Primary School Enrollment",
    description:
      "Birth certificate, completed application form, recent passport photo, immunization record.",
  },
  {
    title: "Secondary School Enrollment",
    description:
      "Completed primary education certificate, application form, recent passport photo, parent/guardian ID.",
  },
  {
    title: "Transfer Students",
    description:
      "Previous school transcript, transfer form, completed application, parent/guardian ID.",
  },
  {
    title: "International Students",
    description:
      "Passport, visa, completed application form, proof of guardianship, health records.",
  },
];

export default function RequirementsPage() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Academic Requirements
        </h2>
        <div className="space-y-4">
          {requirementsData.map((requirement, index) => (
            <Card
              key={index}
              className="overflow-visible border-none"
              shadow="sm"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{requirement.title}</h3>
                  <Tooltip content={requirement.description} placement="top">
                    <InfoIcon className="h-5 w-5 cursor-help text-foreground-400" />
                  </Tooltip>
                </div>
                <p className="mt-2 text-sm text-foreground-600">
                  {requirement.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
