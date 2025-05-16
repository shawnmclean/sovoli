"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Image } from "@sovoli/ui/components/image";

import type { AgeRange } from "../../programsData";
import { programsData } from "../../programsData";

export default function ProgramsPage() {
  return (
    <div>
      {/* Main Content Section */}
      <div className="container mx-auto max-w-6xl space-y-16 px-6 py-16">
        {/* Introduction Section */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-4xl font-semibold">Our Programs</h1>
          <p className="text-lg leading-relaxed text-foreground-600">
            Explore our programs below to find the best fit.
          </p>
        </div>

        {/* Programs Listing */}
        <div className="grid gap-8 md:grid-cols-2">
          {programsData.map((program, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-md transition hover:shadow-lg"
            >
              <Image
                removeWrapper
                alt={program.name}
                className="h-48 w-full object-cover"
                src={program.image}
              />
              <CardBody className="flex flex-col">
                <h3 className="text-2xl font-semibold text-primary-800">
                  {program.name}
                </h3>
                <p className="text-base leading-relaxed text-foreground-600">
                  {program.description}
                </p>

                {program.requirements && program.requirements.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-lg font-semibold text-primary-700">
                      Requirements
                    </h4>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-default-600">
                      {program.requirements.map((requirement, index) => (
                        <li key={index}>
                          {requirement.description && (
                            <span>{requirement.description}</span>
                          )}
                          {requirement.type === "age" &&
                            requirement.ageRange && (
                              <span className="italic text-gray-600">
                                {displayAgeRange(requirement.ageRange)}
                              </span>
                            )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  variant="solid"
                  radius="sm"
                  className="mt-4 self-start"
                  as={Link}
                  href={`/academics/programs/${program.id}`}
                >
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
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
