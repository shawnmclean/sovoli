"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { BadgeCheckIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
// import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgInstance } from "~/modules/organisations/types";

export interface AdminSchoolHeaderProps {
  orgInstance: OrgInstance;
}

export function AdminSchoolHeader({ orgInstance }: AdminSchoolHeaderProps) {
  return (
    <div className="w-full md:w-1/3 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={orgInstance.org.logo}
            name={orgInstance.org.name}
            size="lg"
            className="h-16 w-16 flex-shrink-0"
            fallback={
              <span className="text-xs text-default-500">
                Logo Not Available
              </span>
            }
          />
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl">{orgInstance.org.name}</h1>
            {orgInstance.org.isVerified && (
              <BadgeCheckIcon className="text-success" size={20} />
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="faded"
            as={Link}
            href={`/orgs/${orgInstance.org.username}`}
          >
            Profile
          </Button>
          {!orgInstance.org.isVerified && (
            <Button
              color="warning"
              as={WhatsAppLink}
              message={`Hello, I'm the admin of ${orgInstance.org.name}. I'd like to claim this profile.`}
              intent="Claim School"
              role="admin"
              page="details"
              orgId={orgInstance.org.username}
              orgName={orgInstance.org.name}
              funnel="admin_claim"
              className="flex-1"
            >
              Claim
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
