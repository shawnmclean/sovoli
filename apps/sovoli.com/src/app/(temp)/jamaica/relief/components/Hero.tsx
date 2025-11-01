"use client";

import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Link } from "@sovoli/ui/components/link";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

interface TeamMember {
  name: string;
  company: string;
  role: string;
  whatsapp?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Shemiele Da'Briel",
    company: "Microsoft",
    role: "Seattle diaspora",
    whatsapp: "",
  },
  {
    name: "Alethea Lodge",
    company: "Ex-Microsoft",
    role: "On the ground",
    whatsapp: "",
  },
  {
    name: "Shawn Mclean",
    company: "Ex-Auth0",
    role: "On the ground",
    whatsapp: "18764354470",
  },
  {
    name: "Larren Peart",
    company: "BlueDot",
    role: "On the ground logistics and distribution",
    whatsapp: "",
  },
];

export function Hero() {
  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="text-center space-y-3 sm:space-y-4 px-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Rebuilding Jamaica
        </h1>
        <p className="text-sm sm:text-base text-default-500">
          Data capture for rebuilding Jamaica after the hurricane.
        </p>
      </div>

      <Accordion variant="bordered" className="border border-default-200">
        <AccordionItem
          key="team"
          aria-label="Who is behind this?"
          title="Who is behind this?"
        >
          {teamMembers.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="relative p-3 sm:p-4 rounded-lg bg-default-100 border border-default-200"
                  >
                    {member.whatsapp && member.whatsapp.trim() !== "" && (
                      <Link
                        href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-default-500 hover:text-primary transition-colors"
                        aria-label={`Contact ${member.name} on WhatsApp`}
                      >
                        <SiWhatsapp className="h-5 w-5" />
                      </Link>
                    )}
                    <div
                      className={
                        "flex flex-col gap-1 sm:gap-1.5 " +
                        (member.whatsapp && member.whatsapp.trim() !== ""
                          ? "pr-8 sm:pr-10"
                          : "")
                      }
                    >
                      <div className="flex flex-row items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm sm:text-base text-default-900 break-words">
                          {member.name}
                        </p>
                        <p className="text-xs sm:text-sm text-default-600 break-words">
                          {member.company}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-default-500 break-words leading-relaxed">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-default-700">
              This relief effort is organized by community members and
              volunteers committed to supporting Jamaica's recovery. Our mission
              is to coordinate resources and connect those in need with those
              who can help.
            </p>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
