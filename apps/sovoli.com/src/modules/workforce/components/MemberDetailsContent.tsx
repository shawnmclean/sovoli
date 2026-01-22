"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  GraduationCapIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { useState } from "react";
import type { WorkforceMember } from "~/modules/workforce/types";
import {
  getMemberDisplayTitle,
  getPublicContactValue,
} from "~/modules/workforce/utils";
import { CredentialsSection } from "./CredentialsSection";

export function MemberDetailsContent({ member }: { member: WorkforceMember }) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const displayTitle = getMemberDisplayTitle(member);
  const email = getPublicContactValue(member, "email") ?? "";
  const phone = getPublicContactValue(member, "phone") ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar
          src={member.photo?.url}
          name={member.name}
          className="h-32 w-32"
          isBordered
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{member.name}</h2>
          {displayTitle && (
            <p className="text-lg text-foreground-600 mt-1">{displayTitle}</p>
          )}
        </div>
      </div>

      {member.bio && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">About</h3>
          <div className="text-foreground-600">
            <p className={isBioExpanded ? "" : "line-clamp-3"}>{member.bio}</p>
            {member.bio.length > 150 && (
              <button
                type="button"
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="flex items-center gap-1 hover:underline mt-2 text-sm font-bold"
              >
                {isBioExpanded ? (
                  <>
                    <ChevronUpIcon className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-4 w-4" />
                    Read More
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {(email || phone) && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Contact
          </h3>
          <div className="space-y-2">
            {email && (
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-foreground-500" />
                <a
                  href={`mailto:${email}`}
                  className="text-primary hover:underline"
                >
                  {email}
                </a>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-foreground-500" />
                <a
                  href={`tel:${phone}`}
                  className="text-primary hover:underline"
                >
                  {phone}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {member.education && member.education.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <GraduationCapIcon className="h-4 w-4 text-primary" />
            Education
          </h3>
          <div className="space-y-2">
            {member.education.map((edu) => (
              <div
                key={[
                  edu.level,
                  edu.field,
                  edu.institution ?? "",
                  edu.startDate ?? "",
                  edu.endDate ?? "",
                ].join("|")}
                className="text-sm"
              >
                <div className="font-medium text-foreground">
                  {edu.level}
                  {edu.honors && (
                    <span className="ml-2 text-xs text-yellow-600">
                      ({edu.honors})
                    </span>
                  )}
                </div>
                {edu.field && (
                  <div className="text-foreground-600">{edu.field}</div>
                )}
                {edu.institution && (
                  <div className="text-foreground-500 text-xs">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                    {(edu.startDate ?? edu.endDate) && (
                      <span className="ml-2">
                        •{" "}
                        {edu.startDate && edu.endDate
                          ? `${edu.startDate} - ${edu.endDate}`
                          : (edu.startDate ?? edu.endDate)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {member.credentials && member.credentials.length > 0 && (
        <CredentialsSection credentials={member.credentials} />
      )}
    </div>
  );
}
