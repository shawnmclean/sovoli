"use client";

import { useParams } from "next/navigation";
import { AwardIcon, ExternalLinkIcon } from "lucide-react";
import type { Credential } from "~/modules/workforce/types";
import { GalleryCarousel } from "~/components/GalleryCarousel";
import { Badge } from "@sovoli/ui/components/badge";

interface CredentialsSectionProps {
  credentials: Credential[];
}

function getCredentialTypeLabel(type: Credential["type"]): string {
  switch (type) {
    case "certification":
      return "Certification";
    case "license":
      return "License";
    case "membership":
      return "Membership";
    case "award":
      return "Award";
    case "other":
      return "Credential";
    default:
      return "Credential";
  }
}

function getCredentialTypeColor(type: Credential["type"]): "default" | "primary" | "secondary" | "success" | "warning" | "danger" {
  switch (type) {
    case "certification":
      return "primary";
    case "license":
      return "success";
    case "membership":
      return "secondary";
    case "award":
      return "warning";
    case "other":
      return "default";
    default:
      return "default";
  }
}

function isExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry < today;
}

function isExpiringSoon(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  return expiry >= today && expiry <= thirtyDaysFromNow;
}

export function CredentialsSection({ credentials }: CredentialsSectionProps) {
  const params = useParams();
  const username = params?.username as string;

  if (!credentials || credentials.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
        <AwardIcon className="h-4 w-4 text-primary" />
        Credentials
      </h3>
      <div className="space-y-4">
        {credentials.map((credential, index) => {
          const expired = isExpired(credential.expiryDate);
          const expiringSoon = isExpiringSoon(credential.expiryDate);

          return (
            <div key={index} className="text-sm">
              <div className="flex items-start gap-2 mb-1">
                <div className="font-medium text-foreground flex-1">
                  {credential.name}
                </div>
                <Badge
                  size="sm"
                  color={getCredentialTypeColor(credential.type)}
                  variant="flat"
                >
                  {getCredentialTypeLabel(credential.type)}
                </Badge>
              </div>

              {credential.issuingOrganization && (
                <div className="text-foreground-600">
                  {credential.issuingOrganization}
                </div>
              )}

              {credential.description && (
                <div className="text-foreground-500 text-xs mt-1">
                  {credential.description}
                </div>
              )}

              <div className="text-foreground-500 text-xs mt-1">
                {credential.issueDate && (
                  <span>
                    Issued: {credential.issueDate}
                    {credential.expiryDate && " • "}
                  </span>
                )}
                {credential.expiryDate && (
                  <span
                    className={
                      expired
                        ? "text-danger"
                        : expiringSoon
                          ? "text-warning"
                          : ""
                    }
                  >
                    {expired
                      ? `Expired: ${credential.expiryDate}`
                      : `Expires: ${credential.expiryDate}`}
                  </span>
                )}
              </div>

              {credential.credentialId && (
                <div className="text-foreground-500 text-xs mt-1">
                  ID: {credential.credentialId}
                </div>
              )}

              {credential.verificationUrl && (
                <a
                  href={credential.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs mt-1 inline-flex items-center gap-1"
                >
                  Verify credential
                  <ExternalLinkIcon className="h-3 w-3" />
                </a>
              )}

              {credential.notes && (
                <div className="text-foreground-500 text-xs mt-1 italic">
                  {credential.notes}
                </div>
              )}

              {credential.media && credential.media.length > 0 && (
                <div className="mt-3">
                  <GalleryCarousel
                    media={credential.media}
                    title={`${credential.name} - Credential Media`}
                    type="program"
                    id={`credential-${index}`}
                    username={username}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
