import { Button } from "@sovoli/ui/components/button";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgInstance } from "~/modules/organisations/types";

export interface HeroSectionProps {
  orgInstance: OrgInstance;
}

export function HeroSection({ orgInstance }: HeroSectionProps) {
  return (
    <section className="w-full bg-black text-white py-8 px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold md:text-5xl">
        Affordable, Caring Education for Ages 3–12
      </h1>

      <p className="mb-4 text-lg md:text-xl">
        Find the perfect program for your child’s growth and success.
      </p>

      <p className="mb-8 text-yellow-400 font-medium text-base md:text-lg">
        📅 September Term Starts Soon – Limited Spots Available!
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          as={WhatsAppLink}
          phoneNumber={
            orgInstance.org.locations
              .find((location) => location.isPrimary)
              ?.contacts.find((contact) => contact.type === "whatsapp")?.value
          }
          message={`Hi, I'm interested in applying for one of your programs.`}
          color="primary"
          variant="solid"
          radius="sm"
        >
          Apply Now
        </Button>
      </div>
    </section>
  );
}
