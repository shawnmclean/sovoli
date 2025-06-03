import Image from "next/image";
import { notFound } from "next/navigation";

import { programsData } from "../../programsData";
import { displayAgeRange } from "../utils";

export function generateStaticParams() {
  return programsData.map((program) => ({
    slug: program.slug,
  }));
}

export default async function ProgramDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const program = getProgramBySlug(slug);

  if (!program) {
    return notFound();
  }
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Program Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Image
            src={program.image}
            alt={program.name}
            width={800}
            height={400}
            className="rounded-lg object-cover"
          />
          <h1 className="text-4xl font-bold text-primary-700">
            {program.name}
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

function getProgramBySlug(slug: string) {
  return programsData.find((program) => program.slug === slug);
}
