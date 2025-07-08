import { Button } from "@sovoli/ui/components/button";
import { ChevronDownIcon, ClipboardEditIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgInstance } from "~/modules/organisations/types";

export interface HeroSectionProps {
  orgInstance: OrgInstance;
}

export function HeroSection({ orgInstance }: HeroSectionProps) {
  const whatsappNumber = orgInstance.org.locations
    .find((location) => location.isPrimary)
    ?.contacts.find((contact) => contact.type === "whatsapp")?.value;

  const notices = [
    {
      icon: "📅",
      text: "Limited Spots Available",
      className: "bg-warning text-warning-foreground animate-pulse",
    },
    {
      icon: "💸",
      text: "Discounts Available",
      className: "bg-success-300 text-success-900",
    },
  ];

  return (
    <section className="w-full bg-background text-foreground px-4 py-10 md:py-16 text-center">
      {/* Headline & Subtext */}
      <div className="max-w-xl mx-auto space-y-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Affordable, Caring Education for Ages 2–16
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Find the perfect program for your child's growth and success.
        </p>
        <p className="text-sm text-muted-foreground">
          ✅ Trusted by 120+ families near Mon Repos, Guyana
        </p>
      </div>

      {/* Notices */}
      <div className="flex flex-col items-center gap-2 mb-10">
        {notices.map(({ icon, text, className }, i) => (
          <div
            key={i}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm shadow-sm ${className}`}
            aria-label={text}
          >
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center mb-12">
        <Button
          as={WhatsAppLink}
          phoneNumber={whatsappNumber}
          intent="Submit Application"
          role="parent"
          page="programs"
          orgId={orgInstance.org.username}
          orgName={orgInstance.org.name}
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

      {/* Scroll Indicator */}
      <div className="flex justify-center">
        <p className="text-sm text-muted-foreground flex items-center gap-1 animate-bounce">
          <ChevronDownIcon className="w-4 h-4" />
          View Programs Below
        </p>
      </div>
    </section>
  );
}
