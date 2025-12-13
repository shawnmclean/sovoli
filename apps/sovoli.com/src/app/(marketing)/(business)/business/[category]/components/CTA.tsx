"use client";

import { Button } from "@sovoli/ui/components/button";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import type { TrackingEventProperties } from "./Tracking";
import type { GrowthSystemContent } from "../../categories";

interface CTAProps {
  content: GrowthSystemContent["cta"];
  phoneNumber?: string;
  trackingEventProperties: TrackingEventProperties;
}

export function CTA({
  content,
  phoneNumber,
  trackingEventProperties,
}: CTAProps) {
  return (
    <section className="py-6 px-4 sm:py-12 relative">
      <div className="mx-auto max-w-4xl text-center relative">
        <div className="relative p-[3px] rounded-2xl overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] animate-shine-border shine-border-gradient" />
          <div className="relative bg-background rounded-2xl shadow-xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              {content.title}
            </h2>
            <p className="text-lg sm:text-xl text-default-600 mb-8 max-w-2xl mx-auto">
              {content.description}
            </p>
            <Button
              as={WhatsAppLink}
              phoneNumber={phoneNumber}
              message={content.message}
              size="lg"
              color="primary"
              variant="solid"
              className="font-semibold"
              event="Contact"
              eventProperties={trackingEventProperties}
            >
              <SiWhatsapp className="mr-2 h-5 w-5" />
              Message Us on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

