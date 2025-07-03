import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { displayAgeRange } from "../utils";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import type { Metadata } from "next";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramDetailsPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProgramDetailsPageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const {
    websiteModule: { website },
    academicModule,
  } = await retrieveOrgInstance(username);

  const program = academicModule?.programs.find((p) => p.slug === slug);
  if (!program) return notFound();

  return {
    title: `${program.name ?? program.standardProgramVersion?.program.name ?? ""} | Program`,
    description: program.description,
    openGraph: {
      title: `${program.name ?? program.standardProgramVersion?.program.name ?? ""} | ${website.siteName}`,
      description: program.description,
      type: "website",
    },
  };
}

export default async function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const { username, slug } = await params;

  const orgInstance = await retrieveOrgInstance(username);
  const program = orgInstance.academicModule?.programs.find(
    (p) => p.slug === slug,
  );

  if (!program) {
    return notFound();
  }
  return (
    <section className="px-4">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="mb-6">
          <Button
            as={Link}
            href="/programs"
            variant="light"
            startContent={<ChevronLeft className="h-4 w-4" />}
          >
            Back to Programs
          </Button>
        </div>
        {/* Program Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Image
            src={
              program.image ??
              program.standardProgramVersion?.program.image ??
              ""
            }
            alt={
              program.name ?? program.standardProgramVersion?.program.name ?? ""
            }
            width={800}
            height={400}
            className="rounded-lg object-cover"
          />
          <h1
            className="text-4xl font-bold text-primary-700"
            title={
              program.name ?? program.standardProgramVersion?.program.name ?? ""
            }
          >
            {program.name ?? program.standardProgramVersion?.program.name ?? ""}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-foreground-600">
            {program.description}
          </p>
        </div>

        {/* Requirements Section */}
        {program.requirements && program.requirements.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-3xl font-semibold text-primary-700">
              Requirements
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-default-600">
              {program.requirements.map((requirement, index) => (
                <li key={index} className="flex flex-col">
                  {requirement.description && (
                    <span>{requirement.description}</span>
                  )}
                  {requirement.type === "age" && requirement.ageRange && (
                    <span className="italic text-gray-600">
                      {displayAgeRange(requirement.ageRange)}
                    </span>
                  )}
                  {requirement.type === "document" && requirement.name && (
                    <span className="italic text-gray-600">
                      Document Required: {requirement.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
