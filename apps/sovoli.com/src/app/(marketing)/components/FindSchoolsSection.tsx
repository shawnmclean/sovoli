"use client";

import React, { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";

const areas = [
  { name: "All Areas", key: "all" },
  { name: "Mon Repos", key: "mon-repos" },
  { name: "Georgetown", key: "georgetown" },
];

export function FindSchoolsSection() {
  const [selectedArea, setSelectedArea] = useState(areas[0]);

  const path =
    selectedArea?.key === "all"
      ? "/d/private-school/guyana"
      : `/d/private-school/guyana/${selectedArea?.key}`;

  return (
    <section className="z-20 w-full max-w-screen-lg mt-6 md:mt-8">
      <Card
        className="border-2 border-primary/30 bg-gradient-to-r from-primary-50/50 to-default-50 dark:from-primary-950/30 dark:to-default-100/10 shadow-lg hover:shadow-xl transition-shadow"
        radius="lg"
      >
        <CardBody className="p-4 md:p-5">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-foreground">
              Find Private Schools in Guyana
            </h2>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Dropdown */}
              <div className="flex-1">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      fullWidth
                      variant="bordered"
                      color="default"
                      endContent={<ChevronDownIcon className="h-4 w-4" />}
                      className="justify-between"
                    >
                      {selectedArea?.name}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Area selection"
                    onAction={(key) => {
                      const area = areas.find((a) => a.key === key);
                      if (area) setSelectedArea(area);
                    }}
                  >
                    {areas.map((area) => (
                      <DropdownItem key={area.key}>{area.name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>

              {/* Button */}
              <div className="w-full sm:w-auto shrink-0">
                <Button
                  as={Link}
                  href={path}
                  color="primary"
                  size="md"
                  endContent={<ArrowRightIcon className="h-4 w-4" />}
                  className="w-full sm:w-auto font-semibold"
                >
                  Explore 50+ Schools
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

