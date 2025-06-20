"use client";

import React, { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import { Link } from "@sovoli/ui/components/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";

const areas = [
  { name: "All Areas", key: "all" },
  { name: "Mon Repos", key: "mon-repos" },
  { name: "Georgetown", key: "georgetown" },
];

export function CTASection() {
  const [selectedArea, setSelectedArea] = useState(areas[0]);

  const path =
    selectedArea?.key === "all"
      ? "/d/private-school/guyana"
      : `/d/private-school/guyana/${selectedArea?.key}`;

  return (
    <section className="mt-6 flex flex-col items-center">
      <div className="w-full max-w-xl animate-neonPulse rounded-xl border-2 border-purple-500 p-6 shadow-lg backdrop-blur-md space-y-4">
        <Dropdown>
          <DropdownTrigger>
            <Button
              fullWidth
              variant="bordered"
              color="default"
              endContent={<ChevronDownIcon className="h-4 w-4" />}
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

        <Button
          as={Link}
          fullWidth
          color="primary"
          endContent={<ArrowRightIcon className="h-4 w-4" />}
          href={path}
        >
          Explore Schools
        </Button>
      </div>
    </section>
  );
}
