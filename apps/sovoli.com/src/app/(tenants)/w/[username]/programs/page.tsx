import Image from "next/image";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";

import { displayAgeRange } from "./utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramsPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProgramsPageProps): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: "Programs",
    description: `Explore our academic programs at ${website.siteName}.`,
    keywords: ["academic programs", "courses", "education", website.siteName],
    openGraph: {
      title: `Programs | ${website.siteName}`,
      description: `Explore our academic programs at ${website.siteName}.`,
      type: "website",
    },
  };
}

export default async function ProgramsPage({ params }: ProgramsPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);
  const programs = orgInstance.academicModule?.programs ?? [];

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
          {programs.map((program, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-md transition hover:shadow-lg"
            >
              <Image
                src={
                  program.image ??
                  program.standardProgramVersion?.program.image ??
                  ""
                }
                alt={
                  program.name ??
                  program.standardProgramVersion?.program.name ??
                  ""
                }
                width={800}
                height={400}
                className="h-48 w-full object-cover"
              />
              <CardBody className="flex flex-col">
                <h3
                  className="text-2xl font-semibold text-primary-800"
                  title={
                    program.name ??
                    program.standardProgramVersion?.program.name ??
                    ""
                  }
                >
                  {program.name ??
                    program.standardProgramVersion?.program.name ??
                    ""}
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
                  href={`/programs/${program.slug}`}
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
