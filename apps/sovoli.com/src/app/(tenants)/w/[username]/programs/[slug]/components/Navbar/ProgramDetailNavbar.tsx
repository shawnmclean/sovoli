import Link from "next/link";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { Button } from "@sovoli/ui/components/button";
import type { OrgInstance } from "~/modules/organisations/types";
import { WhatsAppLink } from "~/components/WhatsAppLink";
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

  const whatsappNumber = orgInstance.org.locations
    .find((location) => location.isPrimary)
    ?.contacts.find((contact) => contact.type === "whatsapp")?.value;

  return (
    <Navbar maxWidth="full">
      <NavbarContent justify="start">
        <NavbarItem>
          <Button
            as={Link}
            href="/programs"
            variant="flat"
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
            title={programName}
            text={`Check out ${programName} on ${orgInstance.org.name}`}
          />
        </NavbarItem>
        <NavbarItem>
          <Button
            variant="flat"
            isIconOnly
            as={WhatsAppLink}
            phoneNumber={whatsappNumber}
            message={`I'd like to add ${programName} to my wishlist`}
            radius="full"
            intent="Add to Wishlist"
            role="parent"
            page="details"
            orgId={orgInstance.org.username}
            orgName={orgInstance.org.name}
            funnel="discovery"
          >
            <HeartIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
