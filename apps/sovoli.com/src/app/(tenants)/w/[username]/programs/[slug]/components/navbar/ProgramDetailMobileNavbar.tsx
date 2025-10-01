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
import type { Program, ProgramGroup } from "~/modules/academics/types";
import { SubscribeProgramButton } from "../SubscribeProgramButton";

export interface ProgramDetailNavbarProps {
  orgInstance: OrgInstance;
  program: Program;
  group?: ProgramGroup;
}

export function ProgramDetailNavbar({
  orgInstance,
  program,
  group,
}: ProgramDetailNavbarProps) {
  const programName =
    program.name ??
    program.standardProgramVersion?.program.name ??
    group?.name ??
    "";

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
            href="/programs"
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
            title={programName}
            text={`Check out ${programName} on ${orgInstance.org.name}`}
            isIconOnly
          />
        </NavbarItem>
        <NavbarItem>
          <SubscribeProgramButton program={program} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
