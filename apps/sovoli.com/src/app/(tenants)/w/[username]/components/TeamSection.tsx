"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  AutoScroll,
} from "@sovoli/ui/components/carousel";

import type { OrgInstance } from "~/modules/organisations/types";

interface TeamSectionProps {
  orgInstance: OrgInstance;
}

export function TeamSection({ orgInstance }: TeamSectionProps) {
  const members = orgInstance.workforceModule?.members ?? [];

  return (
    <section className="bg-background2 py-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden">
        <div className="mb-12 text-center px-4">
          <h2 className="mb-6 text-3xl font-bold">Meet Our Team</h2>
          <p className="mx-auto max-w-2xl text-default-600">
            Our dedicated faculty and staff are committed to providing the
            highest quality education and support for all students.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            AutoScroll.default({
              playOnInit: true,
              stopOnInteraction: false,
              speed: 1,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {members.map((member) => (
              <CarouselItem
                key={member.slug}
                className="pl-4 basis-[160px] shrink-0"
              >
                <Link
                  href={`/workforce/people/${member.slug}`}
                  className="group flex w-[160px] flex-col items-center"
                >
                  <Avatar
                    src={member.photo?.url}
                    alt={member.name}
                    isBordered
                    className="h-28 w-28"
                    radius="full"
                  />
                  <div className="mt-3 text-center">
                    <h3 className="text-lg font-semibold leading-tight">
                      {member.name}
                    </h3>
                    <p className="max-w-full truncate text-sm text-default-600">
                      {member.roleAssignments
                        .map((role) => role.position.name)
                        .join(", ")}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            color="default"
            variant="bordered"
            radius="sm"
            as={Link}
            href="/workforce/people"
          >
            View All Team Members
          </Button>
        </div>
      </div>
    </section>
  );
}
