import React from "react";
import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Button } from "@sovoli/ui/components/button";
import {
  MailIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  PhoneIncomingIcon,
} from "lucide-react";

export function ContactMethods() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Contact Modern Academy</h2>
      <p className="text-default-500">
        We're here to help with your application process. Choose your preferred
        method to contact us.
      </p>

      <Accordion
        variant="splitted"
        selectionMode="multiple"
        defaultExpandedKeys={["whatsapp"]}
      >
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
            <div className="flex items-center gap-3">
              <PhoneIcon className="text-default-500" />
              <div>
                <p className="font-medium">Main Office</p>
                <a
                  href="tel:+15551234567"
                  className="text-primary hover:underline"
                >
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="text-default-500" />
              <div>
                <p className="font-medium">Admissions</p>
                <a
                  href="tel:+15551234568"
                  className="text-primary hover:underline"
                >
                  +1 (555) 123-4568
                </a>
              </div>
            </div>
            <p className="mt-2 text-small text-default-400">
              Available Monday-Friday, 8:00 AM - 5:00 PM
            </p>
          </div>
        </AccordionItem>

        <AccordionItem
          key="whatsapp"
          aria-label="WhatsApp"
          title={
            <div className="flex items-center gap-2">
              <PhoneIncomingIcon className="text-lg" />
              <span>WhatsApp</span>
            </div>
          }
        >
          <div className="space-y-3 px-2">
            <div className="flex items-center gap-3">
              <PhoneIncomingIcon />
              <div>
                <p className="font-medium">Admissions Support</p>
                <a
                  href="https://wa.me/15551234569"
                  className="text-primary hover:underline"
                >
                  +1 (555) 123-4569
                </a>
              </div>
            </div>
            <p className="mt-2 text-small text-default-400">
              Quick responses during business hours. Send us a message anytime!
            </p>
            <Button
              color="success"
              startContent={<PhoneIncomingIcon />}
              className="mt-2"
              as="a"
              href="https://wa.me/15551234569"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </AccordionItem>

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
            <div className="flex items-center gap-3">
              <MailIcon className="text-default-500" />
              <div>
                <p className="font-medium">General Inquiries</p>
                <a
                  href="mailto:info@brightwoodacademy.edu"
                  className="text-primary hover:underline"
                >
                  info@brightwoodacademy.edu
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MailIcon className="text-default-500" />
              <div>
                <p className="font-medium">Admissions</p>
                <a
                  href="mailto:admissions@brightwoodacademy.edu"
                  className="text-primary hover:underline"
                >
                  admissions@brightwoodacademy.edu
                </a>
              </div>
            </div>
            <p className="mt-2 text-small text-default-400">
              We typically respond to emails within 24-48 hours.
            </p>
          </div>
        </AccordionItem>

        <AccordionItem
          key="address"
          aria-label="Physical Addresses"
          title={
            <div className="flex items-center gap-2">
              <MapPinIcon className="text-lg text-primary" />
              <span>Campus Locations</span>
            </div>
          }
        >
          <div className="space-y-4 px-2">
            <div className="space-y-2">
              <p className="font-medium">Main Campus</p>
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-1 text-default-500" />
                <address className="not-italic text-default-600">
                  123 Education Avenue
                  <br />
                  Springfield, ST 12345
                  <br />
                  United States
                </address>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Downtown Campus</p>
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-1 text-default-500" />
                <address className="not-italic text-default-600">
                  456 Learning Street
                  <br />
                  Springfield, ST 12346
                  <br />
                  United States
                </address>
              </div>
            </div>

            <p className="mt-2 text-small text-default-400">
              Admissions office hours: Monday-Friday, 9:00 AM - 4:00 PM
            </p>

            <Button
              color="primary"
              variant="flat"
              startContent={<MapIcon />}
              as="a"
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Map
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
