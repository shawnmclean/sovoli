"use client";

import React from "react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { MailIcon, MapIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import type { OrgLocation } from "~/modules/organisations/types";
import { Divider } from "@sovoli/ui/components/divider";
import { countryCodeToName } from "~/utils/countryUtils";

interface ContactMethodsProps {
  location: OrgLocation;
}

export function ContactMethods({ location }: ContactMethodsProps) {
  const phoneContacts = location.contacts.filter((c) => c.type === "phone");
  const whatsappContacts = location.contacts.filter(
    (c) => c.type === "whatsapp",
  );
  const emailContacts = location.contacts.filter((c) => c.type === "email");

  const defaultExpandedKey = React.useMemo(() => {
    if (whatsappContacts.length > 0) return "whatsapp";
    if (phoneContacts.length > 0) return "phone";
    if (emailContacts.length > 0) return "email";
    return "address";
  }, [whatsappContacts.length, phoneContacts.length, emailContacts.length]);

  return (
    <div className="space-y-6">
      <Accordion
        variant="splitted"
        selectionMode="multiple"
        defaultExpandedKeys={[defaultExpandedKey]}
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
            <div className="space-y-4 px-2">
              {whatsappContacts.map((contact, idx) => (
                <div key={idx} className="space-y-1">
                  <Button
                    color="success"
                    startContent={<SiWhatsapp />}
                    as="a"
                    href={`https://wa.me/${contact.value.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`Message ${contact.label ?? contact.value} on WhatsApp`}
                  </Button>
                  <p className="text-small text-default-400">{contact.value}</p>
                </div>
              ))}
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
      </Accordion>

      <Divider className="my-4" />

      {(() => {
        const addressLines = [
          location.address.line1,
          location.address.line2,
          location.address.line3,
          [location.address.city, location.address.state]
            .filter(Boolean)
            .join(", "),
          location.address.postalCode,
          countryCodeToName(location.address.countryCode),
        ]
          .filter(Boolean)
          .join("\n");

        return (
          <div className="space-y-2">
            {location.label && <p className="font-medium">{location.label}</p>}
            <div className="flex items-start gap-3">
              <MapPinIcon className="mt-1 text-default-500" />
              <address className="not-italic text-default-600 whitespace-pre-line">
                {addressLines}
              </address>
            </div>
            {location.coordinates ? (
              <Button
                color="primary"
                variant="flat"
                startContent={<MapIcon />}
                as="a"
                href={
                  location.placeId
                    ? `https://www.google.com/maps/place/?q=place_id:${location.placeId}`
                    : `https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Map
              </Button>
            ) : null}
          </div>
        );
      })()}
    </div>
  );
}
