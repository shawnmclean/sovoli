import React from "react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { MailIcon, MapIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import type { OrgInstance } from "~/modules/organisations/types";

interface ContactMethodsProps {
  orgInstance: OrgInstance;
}

export function ContactMethods({ orgInstance }: ContactMethodsProps) {
  const { org } = orgInstance;

  const phoneContacts = org.locations.flatMap((loc) =>
    loc.contacts
      .filter((c) => c.type === "phone")
      .map((c) => ({ ...c, location: loc })),
  );
  const whatsappContacts = org.locations.flatMap((loc) =>
    loc.contacts
      .filter((c) => c.type === "whatsapp")
      .map((c) => ({ ...c, location: loc })),
  );
  const emailContacts = org.locations.flatMap((loc) =>
    loc.contacts
      .filter((c) => c.type === "email")
      .map((c) => ({ ...c, location: loc })),
  );

  const firstLocation = org.locations[0];

  const defaultExpandedKey = React.useMemo(() => {
    if (whatsappContacts.length > 0) return "whatsapp";
    if (phoneContacts.length > 0) return "phone";
    if (emailContacts.length > 0) return "email";
    if (org.locations.length > 0) return "address";
    return undefined;
  }, [
    whatsappContacts.length,
    phoneContacts.length,
    emailContacts.length,
    org.locations.length,
  ]);

  return (
    <div className="space-y-6">
      <Accordion
        variant="splitted"
        selectionMode="multiple"
        defaultExpandedKeys={
          defaultExpandedKey ? [defaultExpandedKey] : undefined
        }
        className="px-0"
      >
        {phoneContacts.length > 0 ? (
          <AccordionItem
            key="phone"
            aria-label="Phone Contact"
            title={
              <div className="flex items-center gap-2">
                <PhoneIcon className="text-lg text-primary" />
                <span>Phone Contact</span>
              </div>
            }
          >
            <div className="space-y-3 px-2">
              {phoneContacts.map((contact, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <PhoneIcon className="text-default-500" />
                  <div>
                    {contact.label && (
                      <p className="font-medium">{contact.label}</p>
                    )}
                    <Link
                      href={`tel:${contact.value}`}
                      className="text-primary hover:underline"
                    >
                      {contact.value}
                    </Link>
                  </div>
                </div>
              ))}
              <p className="mt-2 text-small text-default-400">
                Available during business hours
              </p>
            </div>
          </AccordionItem>
        ) : null}

        {whatsappContacts.length > 0 ? (
          <AccordionItem
            key="whatsapp"
            aria-label="WhatsApp"
            title={
              <div className="flex items-center gap-2">
                <SiWhatsapp className="text-lg text-primary" />
                <span>WhatsApp</span>
              </div>
            }
          >
            <div className="space-y-3 px-2">
              {whatsappContacts.map((contact, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <SiWhatsapp className="text-default-500" />
                  <div>
                    {contact.label && (
                      <p className="font-medium">{contact.label}</p>
                    )}
                    <Link
                      href={`https://wa.me/${contact.value.replace(/[^\d]/g, "")}`}
                      className="text-primary hover:underline"
                    >
                      {contact.value}
                    </Link>
                  </div>
                </div>
              ))}
              <p className="mt-2 text-small text-default-400">
                Quick responses during business hours. Send us a message
                anytime!
              </p>
              {whatsappContacts[0] && (
                <Button
                  color="success"
                  startContent={<SiWhatsapp />}
                  className="mt-2"
                  as="a"
                  href={`https://wa.me/${whatsappContacts[0].value.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </Button>
              )}
            </div>
          </AccordionItem>
        ) : null}

        {emailContacts.length > 0 ? (
          <AccordionItem
            key="email"
            aria-label="Email"
            title={
              <div className="flex items-center gap-2">
                <MailIcon className="text-lg text-primary" />
                <span>Email</span>
              </div>
            }
          >
            <div className="space-y-3 px-2">
              {emailContacts.map((contact, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <MailIcon className="text-default-500" />
                  <div>
                    {contact.label && (
                      <p className="font-medium">{contact.label}</p>
                    )}
                    <Link
                      href={`mailto:${contact.value}`}
                      className="text-primary hover:underline"
                    >
                      {contact.value}
                    </Link>
                  </div>
                </div>
              ))}
              <p className="mt-2 text-small text-default-400">
                We typically respond to emails within 24-48 hours.
              </p>
            </div>
          </AccordionItem>
        ) : null}

        {org.locations.length > 0 ? (
          <AccordionItem
            key="address"
            aria-label="Physical Addresses"
            title={
              <div className="flex items-center gap-2">
                <MapPinIcon className="text-lg text-primary" />
                <span>Locations</span>
              </div>
            }
          >
            <div className="space-y-4 px-2">
              {org.locations.map((loc, idx) => {
                const address = [
                  loc.address.line1,
                  loc.address.line2,
                  loc.address.line3,
                  [loc.address.city, loc.address.state]
                    .filter(Boolean)
                    .join(", "),
                  loc.address.postalCode,
                  loc.address.country,
                ]
                  .filter(Boolean)
                  .join("\n");
                return (
                  <div key={idx} className="space-y-2">
                    {loc.label && <p className="font-medium">{loc.label}</p>}
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="mt-1 text-default-500" />
                      <address className="not-italic text-default-600 whitespace-pre-line">
                        {address}
                      </address>
                    </div>
                  </div>
                );
              })}
              {firstLocation?.coordinates ? (
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<MapIcon />}
                  as="a"
                  href={`https://maps.google.com/?q=${firstLocation.coordinates.lat},${firstLocation.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Map
                </Button>
              ) : null}
            </div>
          </AccordionItem>
        ) : null}
      </Accordion>
    </div>
  );
}
