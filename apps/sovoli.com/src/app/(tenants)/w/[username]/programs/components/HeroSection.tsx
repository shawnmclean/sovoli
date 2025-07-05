import { Button } from "@sovoli/ui/components/button";
import { ClipboardEditIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgInstance } from "~/modules/organisations/types";

export interface HeroSectionProps {
  orgInstance: OrgInstance;
}

export function HeroSection({ orgInstance }: HeroSectionProps) {
  const whatsappNumber = orgInstance.org.locations
    .find((location) => location.isPrimary)
    ?.contacts.find((contact) => contact.type === "whatsapp")?.value;

  return (
    <section className="w-full bg-background text-foreground py-10 md:py-16 lg:py-20 px-4 text-center">
      <h1 className="mb-3 text-4xl font-bold md:text-5xl leading-tight">
        Affordable, Caring Education for Ages 2–16
      </h1>

      <p className="mb-4 text-lg md:text-xl text-muted-foreground">
        Find the perfect program for your child's growth and success.
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning text-warning-foreground font-semibold rounded-full text-sm mb-8 shadow-sm animate-pulse">
        <span>📅</span>
        <span>Limited Spots Available</span>
      </div>

      <div className="flex justify-center">
        <Button
          as={WhatsAppLink}
          phoneNumber={whatsappNumber}
          message="Hi, I'm interested in applying for one of your programs."
          color="primary"
          variant="solid"
          radius="md"
          size="lg"
          className="px-6 py-3 text-base font-semibold"
          startContent={<ClipboardEditIcon />}
        >
          Apply Now
        </Button>
      </div>
    </section>
  );
}
