import Image from "next/image";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";

import { programsData } from "../programsData";

export function ProgramsSection() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-3xl font-bold">Our Programs</h2>
          <p className="mx-auto max-w-2xl text-foreground-500">
            Our programs are designed to provide a nurturing environment that
            fosters academic excellence, character development, and lifelong
            learning.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {programsData.slice(0, 4).map((program, index) => (
            <Card key={index} className="border-none" shadow="sm">
              <CardBody className="p-0">
                <Image
                  alt={program.name}
                  src={program.image}
                  width={800}
                  height={400}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">{program.name}</h3>
                  <p className="text-default-600">{program.description}</p>
                  <Button
                    color="primary"
                    variant="flat"
                    radius="sm"
                    className="mt-4"
                    as={Link}
                    href={`/programs/${program.slug}`}
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
            href="/programs"
          >
            View All {programsData.length} Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
