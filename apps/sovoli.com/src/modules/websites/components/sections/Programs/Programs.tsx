import Image from "next/image";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";

import type { PageSection } from "~/modules/websites/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";

export interface ProgramsProps {
  section: PageSection;
  orgInstance: OrgInstanceWithWebsite;
}

export function Programs({ section, orgInstance }: ProgramsProps) {
  const programs = orgInstance.academicModule?.programs ?? [];
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-3xl font-bold">{section.title}</h2>
          <p className="mx-auto max-w-2xl text-foreground-500">
            {section.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {programs.slice(0, 4).map((program, index) => (
            <Card key={index} className="border-none" shadow="sm">
              <CardBody className="p-0">
                <Image
                  alt={
                    program.name ??
                    program.standardProgramVersion?.program.name ??
                    ""
                  }
                  src={
                    program.image ??
                    program.standardProgramVersion?.program.image ??
                    ""
                  }
                  width={800}
                  height={400}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h3
                    className="mb-2 text-xl font-semibold line-clamp-2"
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
                  <p className="text-default-600 line-clamp-3">
                    {program.description}
                  </p>
                  <Button
                    color="primary"
                    variant="flat"
                    radius="sm"
                    className="mt-4"
                    as={Link}
                    href={`/academics/programs/${program.slug}`}
                  >
                    Learn More
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            color="default"
            variant="bordered"
            radius="sm"
            as={Link}
            href="/academics/programs"
          >
            View All {programs.length} Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
