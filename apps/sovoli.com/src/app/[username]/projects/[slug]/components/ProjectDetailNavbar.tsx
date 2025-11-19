"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { Button } from "@sovoli/ui/components/button";
import type { OrgInstance } from "~/modules/organisations/types";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";
import type { Project } from "~/modules/projects/types";

export interface ProjectDetailNavbarProps {
  orgInstance: OrgInstance;
  project: Project;
  backHref: string;
}

export function ProjectDetailNavbar({
  orgInstance,
  project,
  backHref,
}: ProjectDetailNavbarProps) {
  return (
    <Navbar
      maxWidth="full"
      className="absolute top-0 left-0 right-0 bg-transparent"
      isBordered={false}
      isBlurred={false}
      classNames={{
        wrapper: "px-4",
      }}
    >
      <NavbarContent justify="start">
        <NavbarItem>
          <Button
            as={Link}
            href={backHref}
            variant="solid"
            isIconOnly
            radius="full"
          >
            <ChevronLeftIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ShareButton
            variant="solid"
            title={project.title}
            text={`Check out ${project.title} on ${orgInstance.org.name}`}
            isIconOnly
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
