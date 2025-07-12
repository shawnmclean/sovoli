import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { Button } from "@sovoli/ui/components/button";
import type { OrgInstance } from "~/modules/organisations/types";
import { ShareButton } from "~/app/orgs/[username]/(profile)/components/OrgNavbar/ShareButton";
import type { OrgProgram } from "~/modules/academics/types";

export interface ProgramDetailNavbarProps {
  orgInstance: OrgInstance;
  program: OrgProgram;
}

export function ProgramDetailNavbar({
  orgInstance,
  program,
}: ProgramDetailNavbarProps) {
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  return (
    <Navbar maxWidth="full" position="sticky">
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
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
