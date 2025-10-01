import React from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Avatar } from "@sovoli/ui/components/avatar";
import type { OrgInstance } from "~/modules/organisations/types";
import { BadgeCheckIcon, HeartIcon, EyeIcon } from "lucide-react";
import { Link } from "@sovoli/ui/components/link";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { Button } from "@sovoli/ui/components/button";
import { WhatsAppLink } from "~/components/WhatsAppLink";

import { OrgListItemBreakdown } from "./OrgListItemBreakdown";

interface PrivateSchoolListItemProps {
  orgInstance: OrgInstance;
}

export function PrivateSchoolListItem({
  orgInstance,
}: PrivateSchoolListItemProps) {
  const { org } = orgInstance;

  return (
    <Card className="w-full">
      <CardBody className="gap-2">
        <Link href={`/${org.username}`} color="foreground">
          <div className="flex items-center gap-3">
            <Avatar src={org.logo} name={org.name} size="md" />

            <div className="flex-grow">
              <div className="flex items-center gap-1">
                <h2 className="text-md font-bold line-clamp-2">{org.name}</h2>
                {org.isVerified && (
                  <Tooltip content="This school has been verified by Sovoli">
                    <BadgeCheckIcon className="text-success" size={16} />
                  </Tooltip>
                )}
              </div>

              <p className="text-xs text-default-500 capitalize">
                {org.locations[0]?.address.city}
              </p>
            </div>
          </div>
        </Link>

        <div className="my-1">
          <OrgListItemBreakdown
            orgInstance={orgInstance}
            category="private-school"
          />
        </div>
      </CardBody>

      <CardFooter className="border-t border-default-200 flex items-center justify-between px-3 py-2 gap-3">
        {/* Like Button */}
        <Button
          as={WhatsAppLink}
          variant="flat"
          color="primary"
          radius="md"
          className="flex-1 flex items-center justify-center gap-1 font-medium"
          message={`I'd like add ${org.name} to my favorites`}
          startContent={<HeartIcon size={16} fill="currentColor" />}
          intent="Add to Wishlist"
          role="parent"
          page="listing"
          orgId={org.username}
          orgName={org.name}
          funnel="discovery"
        >
          Add to favorites
        </Button>

        {/* View Count */}
        <div className="flex flex-col items-center gap-0 text-default-400 text-xs shrink-0 leading-none">
          <EyeIcon size={16} />
          <span>&lt;10</span>
        </div>
      </CardFooter>
    </Card>
  );
}
