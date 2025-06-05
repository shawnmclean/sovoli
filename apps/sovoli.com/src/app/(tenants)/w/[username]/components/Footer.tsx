import React from "react";
import { Link } from "@sovoli/ui/components/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import type { OrgInstanceWithWebsite } from "../lib/types";
import { programsData } from "../programsData";
import { SocialLink } from "./SocialLink";

interface FooterProps {
  orgInstance: OrgInstanceWithWebsite;
}

export const Footer = ({ orgInstance }: FooterProps) => {
  const {
    websiteModule: { website },
    academicModule,
  } = orgInstance;

  const programs = academicModule?.programs;
  return (
    <footer className="bg-content2 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center">
              <span className="text-lg font-bold">{website.siteName}</span>
            </div>
            <p className="mb-4 text-sm text-foreground-500">
              Empowering students to reach their full potential through
              innovative education.
            </p>
            <div className="flex gap-4">
              {orgInstance.org.socialLinks?.map((socialLink) => (
                <SocialLink socialLink={socialLink} key={socialLink.platform} />
              ))}
            </div>
          </div>

          {programs && (
            <div>
              <h3 className="mb-4 font-semibold">Programs</h3>
              <ul className="space-y-2">
                {programs.slice(0, 5).map((program) => (
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
          )}
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-sm text-foreground-500 hover:text-primary"
                  href="#"
                >
                  Account Portal
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-foreground-500 hover:text-primary"
                  href="#"
                >
                  Academic Calendar
                </Link>
              </li>
            </ul>
          </div>
          <FooterContact orgInstance={orgInstance} />
        </div>

        <div className="mt-8 border-t border-divider pt-8 text-center text-sm text-foreground-500">
          <p>
            &copy; {new Date().getFullYear()} {website.siteName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterContact = ({ orgInstance }: FooterProps) => {
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
        primaryLocation.address.country,
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
