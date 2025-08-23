"use client";

import { useMemo } from "react";

import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import type { OrgInstance } from "~/modules/organisations/types";
import { Avatar } from "@sovoli/ui/components/avatar";
import { BadgeCheckIcon, GiftIcon, AwardIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";
import { Badge } from "@sovoli/ui/components/badge";

interface OrgHighlightsSectionProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function OrgHighlightsSection({
  orgInstance,
  program,
}: OrgHighlightsSectionProps) {
  const org = orgInstance.org;

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

  const detailedView = (
    <div>
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
            <BadgeCheckIcon size={20} className="text-green-600" />
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
                    {new Date(org.verification.verifiedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Verification Documents */}
            {org.verification.documents.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-foreground mb-4">
                  Verification Documents
                </h4>
                <div className="space-y-3">
                  {org.verification.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          {doc.name && (
                            <div className="text-sm font-medium text-foreground">
                              {doc.name}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <span>{doc.type.replace("_", " ")}:</span>
                            {doc.referenceNumber && (
                              <span>{doc.referenceNumber}</span>
                            )}
                          </div>

                          {doc.issuingAuthority && (
                            <div className="text-xs text-muted-foreground">
                              Issued by {doc.issuingAuthority}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ProgramSectionsWrapper
      program={program}
      section="org_highlights"
      detailedView={detailedView}
      sectionClickable={true}
      detailedViewTitle="All Organization Highlights"
    >
      <div className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Your School
          </h2>
        </div>

        <div className="space-y-4">
          {/* School Identity */}
          <div className="flex flex-col items-center gap-4">
            <Badge
              isOneChar
              color="success"
              content={<BadgeCheckIcon />}
              placement="bottom-right"
              shape="circle"
            >
              <Avatar
                src={org.logo}
                name={org.name}
                size="lg"
                fallback={
                  <span className="text-xs text-default-500">
                    Logo Not Available
                  </span>
                }
              />
            </Badge>
            <div className="text-center">
              <h2 className="font-bold text-lg flex items-center justify-center gap-2">
                {org.name}
              </h2>
            </div>
          </div>

          {/* School Highlights List */}
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="pt-1">{h.icon}</div>
                <div>
                  <div className="text-sm font-semibold">{h.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {h.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 underline text-muted-foreground">Learn More</div>
        </div>
      </div>
    </ProgramSectionsWrapper>
  );
}
