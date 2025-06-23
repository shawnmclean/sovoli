import React from "react";
import { Link } from "@sovoli/ui/components/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import type { OrgInstanceWithWebsite } from "../lib/types";
import type { FooterLink, FooterSection } from "~/modules/websites/types";
import { SocialLink } from "./SocialLink";
import { LogoSVG } from "~/components/Logo/LogoSVG";
import { countryCodeToName } from "~/utils/countryUtils";

// Define a Program type (should match your academicModule programs)
interface Program {
  id: string;
  name: string;
  slug: string;
}

interface FooterProps {
  orgInstance: OrgInstanceWithWebsite;
}

export const Footer = ({ orgInstance }: FooterProps) => {
  const {
    websiteModule: { website },
    academicModule,
  } = orgInstance;

  const programs = academicModule?.programs as Program[] | undefined;
  const footerConfig = website.footer;
  const sections = footerConfig?.sections ?? [];

  return (
    <footer className="bg-content2 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div
          className={`grid grid-cols-1 gap-8 md:grid-cols-${Math.min(
            sections.length,
            4,
          )}`}
        >
          {sections.map((section) => {
            switch (section.key) {
              case "social":
                return (
                  <FooterSocialSection
                    orgInstance={orgInstance}
                    section={section}
                    key={section.key}
                  />
                );
              case "academics":
                return (
                  <FooterAcademicsSection
                    programs={programs}
                    section={section}
                    key={section.key}
                  />
                );
              case "contact":
                return (
                  <FooterContactSection
                    orgInstance={orgInstance}
                    key={section.key}
                  />
                );
              default:
                return (
                  <FooterLinksSection section={section} key={section.key} />
                );
            }
          })}
        </div>

        <div className="mt-8 border-t border-divider pt-8 text-sm text-foreground-500">
          <div className="flex items-center justify-between">
            <p>
              &copy; {new Date().getFullYear()} {website.siteName}.
            </p>
            <NetworkBadge referer={orgInstance.org.username} />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterSocialSection = ({
  orgInstance,
  section,
}: {
  orgInstance: OrgInstanceWithWebsite;
  section: FooterSection;
}) => (
  <div>
    <div className="mb-4 flex items-center">
      <span className="text-lg font-bold">
        {orgInstance.websiteModule.website.siteName}
      </span>
    </div>
    <p className="mb-4 text-sm text-foreground-500">{section.description}</p>
    <div className="flex gap-4">
      {orgInstance.org.socialLinks?.map((socialLink) => (
        <SocialLink socialLink={socialLink} key={socialLink.platform} />
      ))}
    </div>
  </div>
);

const FooterAcademicsSection = ({
  programs,
  section,
}: {
  programs?: Program[];
  section: FooterSection;
}) => {
  return (
    <div>
      <h3 className="mb-4 font-semibold">{section.title}</h3>
      <ul className="space-y-2">
        {programs?.slice(0, 5).map((program) => (
          <li key={program.id}>
            <Link
              className="text-sm text-foreground-500 hover:text-primary"
              href={`/academics/programs/${program.slug}`}
            >
              {program.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            className="text-sm text-foreground-500 hover:text-primary"
            href="/academics/programs"
          >
            More...
          </Link>
        </li>
      </ul>
    </div>
  );
};

const FooterLinksSection = ({ section }: { section: FooterSection }) => (
  <div>
    <h3 className="mb-4 font-semibold">{section.title}</h3>
    {section.description && (
      <p className="mb-4 text-sm text-foreground-500">{section.description}</p>
    )}
    {section.links && (
      <ul className="space-y-2">
        {section.links.map((link: FooterLink) => (
          <li key={link.label}>
            <Link
              className="text-sm text-foreground-500 hover:text-primary"
              href={link.url}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const FooterContactSection = ({ orgInstance }: FooterProps) => {
  const {
    org: { locations },
  } = orgInstance;

  const primaryLocation = locations.find((location) => location.isPrimary);

  // Format address as a string
  const address = primaryLocation?.address
    ? [
        primaryLocation.address.line1,
        primaryLocation.address.line2,
        primaryLocation.address.line3,
        [primaryLocation.address.city, primaryLocation.address.state]
          .filter(Boolean)
          .join(", "),
        primaryLocation.address.postalCode,
        countryCodeToName(primaryLocation.address.countryCode),
      ]
        .filter(Boolean)
        .join("\n")
    : undefined;

  // Find phone and email contacts
  const phoneContact = primaryLocation?.contacts.find(
    (c) => c.type === "phone",
  );
  const emailContact = primaryLocation?.contacts.find(
    (c) => c.type === "email",
  );

  return (
    <div>
      <h3 className="mb-4 font-semibold">Contact</h3>
      <address className="not-italic">
        <div className="mb-2 flex items-start gap-2">
          <MapPinIcon className="mt-1 text-foreground-500" />
          <span className="whitespace-pre-line text-sm text-foreground-500">
            {address}
          </span>
        </div>
        {phoneContact && (
          <div className="mb-2 flex items-center gap-2">
            <PhoneIcon className="text-foreground-500" />
            <Link
              className="text-sm text-foreground-500 hover:text-primary"
              href={`tel:${phoneContact.value}`}
            >
              {phoneContact.value}
            </Link>
          </div>
        )}
        {emailContact && (
          <div className="flex items-center gap-2">
            <MailIcon className="text-foreground-500" />
            <Link
              className="text-sm text-foreground-500 hover:text-primary"
              href={`mailto:${emailContact.value}`}
            >
              {emailContact.value}
            </Link>
          </div>
        )}
      </address>
    </div>
  );
};

interface NetworkBadgeProps {
  referer: string;
}

function NetworkBadge({ referer }: NetworkBadgeProps) {
  const referralUrl = `https://www.sovoli.com?ref=${referer}`;

  return (
    <Link
      href={referralUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1 text-foreground-400 hover:text-foreground-600 transition-colors whitespace-nowrap"
    >
      <span>Powered by</span>
      <LogoSVG
        width={18}
        height={18}
        className="grayscale group-hover:grayscale-0 transition duration-300"
      />
    </Link>
  );
}
