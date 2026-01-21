"use client";

import { useEffect } from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Card, CardBody } from "@sovoli/ui/components/card";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@sovoli/ui/components/drawer";
import { SubscribeProgramButton } from "../SubscribeProgramButton";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";
import { getOrgCategoryDisplay } from "~/modules/organisations/getOrgCategoryDisplay";

interface OrgDetailsProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function OrgDetails({ orgInstance, program }: OrgDetailsProps) {
  const org = orgInstance.org;

  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "org_details",
    });
  }, [program]);

  const categoryText = getOrgCategoryDisplay(org);

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader
            showBackButton
            onBackPress={onClose}
            endContent={
              <>
                <ShareButton
                  title="Share"
                  variant="light"
                  text={`Check out ${org.name} organization details.`}
                />
                <SubscribeProgramButton program={program} variant="light" />
              </>
            }
          />
          <DrawerBody>
            <div className="space-y-6">
              <Card>
                <CardBody className="space-y-4">
                  {/* Centered Logo */}
                  <div className="flex justify-center">
                    <Avatar
                      src={org.logoPhoto?.url}
                      name={org.name}
                      size="lg"
                      fallback={
                        <span className="text-xs text-default-500">
                          Logo Not Available
                        </span>
                      }
                    />
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground">
                      {org.name}
                    </h1>
                  </div>

                  {/* Category */}
                  {categoryText ? (
                    <div className="text-center">
                      <span className="text-sm text-foreground-500">{categoryText}</span>
                    </div>
                  ) : null}
                </CardBody>
              </Card>

              {/* About Section - Plain, outside card */}
              {org.about ? (
                <p className="text-foreground-600 whitespace-pre-line">
                  {org.about}
                </p>
              ) : (
                <p className="text-foreground-500 italic">
                  No information available yet. This organization has not
                  provided an about section.
                </p>
              )}
            </div>
          </DrawerBody>
        </>
      )}
    </DrawerContent>
  );
}
