import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Image } from "@sovoli/ui/components/image";

import { AgeRange, programsData } from "../../programsData";

export default function ProgramsPage() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Programs</h2>
        <div className="space-y-6">
          {programsData.map((program, index) => (
            <Card
              key={index}
              className="overflow-visible border-none"
              shadow="sm"
            >
              <CardBody className="flex flex-col gap-6 p-4 md:flex-row">
                <Image
                  removeWrapper
                  alt={program.name}
                  className="h-48 w-full object-cover md:w-1/3"
                  src={program.image}
                />
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-semibold">{program.name}</h3>
                  <p className="text-default-600">{program.description}</p>

                  {program.requirements && program.requirements.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-lg font-semibold">Requirements</h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-default-600">
                        {program.requirements.map((requirement, index) => (
                          <li key={index}>
                            {requirement.description && (
                              <span>{requirement.description}</span>
                            )}
                            {requirement.type === "age" &&
                              requirement.ageRange && (
                                <span>
                                  {displayAgeRange(requirement.ageRange)}
                                </span>
                              )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    color="primary"
                    variant="flat"
                    radius="sm"
                    className="mt-4"
                  >
                    Learn More
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Utility function to display age range cleanly
function displayAgeRange(ageRange?: AgeRange): string {
  if (!ageRange) return "";

  const minAgeParts: string[] = [];
  const maxAgeParts: string[] = [];

  // Build minimum age string
  if (ageRange.minAgeYears !== undefined && ageRange.minAgeYears > 0) {
    minAgeParts.push(`${ageRange.minAgeYears} years`);
  }
  if (ageRange.minAgeMonths !== undefined && ageRange.minAgeMonths > 0) {
    minAgeParts.push(`${ageRange.minAgeMonths} months`);
  }

  // Build maximum age string
  if (ageRange.maxAgeYears !== undefined && ageRange.maxAgeYears > 0) {
    maxAgeParts.push(`${ageRange.maxAgeYears} years`);
  }
  if (ageRange.maxAgeMonths !== undefined && ageRange.maxAgeMonths > 0) {
    maxAgeParts.push(`${ageRange.maxAgeMonths} months`);
  }

  // Combine min and max age into a single display string
  const minAgeDisplay = minAgeParts.join(" ");
  const maxAgeDisplay = maxAgeParts.join(" ");

  if (minAgeDisplay && maxAgeDisplay) {
    return `${minAgeDisplay} - ${maxAgeDisplay}`;
  } else if (minAgeDisplay) {
    return minAgeDisplay;
  } else if (maxAgeDisplay) {
    return maxAgeDisplay;
  }

  return "";
}
