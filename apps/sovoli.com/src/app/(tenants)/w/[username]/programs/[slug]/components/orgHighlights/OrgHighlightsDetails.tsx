"use client";

import { useEffect, useMemo } from "react";
import { BadgeCheckIcon, GiftIcon, AwardIcon } from "lucide-react";
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

interface OrgHighlightsDetailsProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function OrgHighlightsDetails({
  orgInstance,
  program,
}: OrgHighlightsDetailsProps) {
  const org = orgInstance.org;

  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "org_highlights",
    });
  }, [program]);

  // Get the latest business_registration document
  const latestBusinessRegistration = useMemo(() => {
    if (!org.verification?.documents) return null;

    const businessDocs = org.verification.documents.filter(
      (doc) => doc.type === "business_registration",
    );

    if (businessDocs.length === 0) return null;

    // Sort by issuedDate (newest first) and return the latest
    return businessDocs.sort((a, b) => {
      const dateA = a.issuedDate ? new Date(a.issuedDate) : new Date(0);
      const dateB = b.issuedDate ? new Date(b.issuedDate) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })[0];
  }, [org.verification]);

  const highlights = useMemo(
    () => [
      {
        title: "Award-Winning",
        description:
          org.username === "magy"
            ? "Acknowledged by the Ministry of Education"
            : "Acknowledged by the Ministry of Education",
        icon: <AwardIcon size={16} className="text-yellow-500" />,
      },
      {
        title: "Community Sponsorship",
        description:
          org.username === "magy"
            ? "15+ books donated by FitRight Academy"
            : "15+ books donated to Modern Academy",
        icon: <GiftIcon size={16} className="text-pink-500" />,
      },
    ],
    [org.username],
  );

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
                  text={`Check out ${program.name} school highlights.`}
                />
                <SubscribeProgramButton program={program} variant="light" />
              </>
            }
          />
          <DrawerBody>
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-foreground">
                Your School
              </h1>

              <div className="space-y-4">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="pt-1">{h.icon}</div>
                    <div>
                      <div className="text-sm font-semibold">{h.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {h.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Registration Details Section - Only show if verified */}
              {org.isVerified && org.verification && (
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-6">
                    <BadgeCheckIcon size={20} className="text-success" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Verified Registration Details
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Key Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {org.verification.incorporationDate && (
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Incorporation Date
                          </div>
                          <div className="text-sm font-semibold text-foreground">
                            {new Date(
                              org.verification.incorporationDate,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      )}

                      {org.verification.verifiedAt && (
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Verification Date
                          </div>
                          <div className="text-sm font-semibold text-foreground">
                            {new Date(
                              org.verification.verifiedAt,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Latest Business Registration Document */}
                    {latestBusinessRegistration && (
                      <div>
                        <h4 className="text-base font-medium text-foreground mb-4">
                          Latest Business Registration
                        </h4>
                        <div className="bg-card border border-border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              {latestBusinessRegistration.name && (
                                <div className="text-sm font-medium text-foreground">
                                  {latestBusinessRegistration.name}
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <span>Business Registration:</span>
                                {latestBusinessRegistration.referenceNumber && (
                                  <span>
                                    {latestBusinessRegistration.referenceNumber}
                                  </span>
                                )}
                              </div>

                              {latestBusinessRegistration.issuingAuthority && (
                                <div className="text-xs text-muted-foreground">
                                  Issued by{" "}
                                  {latestBusinessRegistration.issuingAuthority}
                                </div>
                              )}

                              {latestBusinessRegistration.issuedDate && (
                                <div className="text-xs text-muted-foreground">
                                  Issued:{" "}
                                  {new Date(
                                    latestBusinessRegistration.issuedDate,
                                  ).toLocaleDateString()}
                                </div>
                              )}

                              {latestBusinessRegistration.expiryDate && (
                                <div className="text-xs text-muted-foreground">
                                  Expires:{" "}
                                  {new Date(
                                    latestBusinessRegistration.expiryDate,
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DrawerBody>
        </>
      )}
    </DrawerContent>
  );
}
