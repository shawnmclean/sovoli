import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { displayAgeRange } from "../utils";
import { Image } from "@sovoli/ui/components/image";
import { InfoIcon, SendIcon } from "lucide-react";

export interface ProgramCardProps {
  orgInstance: OrgInstance;
  program: OrgProgram;
}

export function ProgramCard({ orgInstance, program }: ProgramCardProps) {
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  const whatsapp = orgInstance.org.locations
    .find((l) => l.isPrimary)
    ?.contacts.find((c) => c.type === "whatsapp")?.value;

  const ageReq =
    program.requirements?.find((r) => r.type === "age") ??
    program.standardProgramVersion?.requirements?.find((r) => r.type === "age");

  return (
    <Card className="overflow-hidden shadow-md transition hover:shadow-lg">
      {/* 🖼️ Image */}
      <Image
        src={
          program.image ?? program.standardProgramVersion?.program.image ?? ""
        }
        alt={programName}
        width={800}
        height={150}
        className="h-48 w-full object-cover"
      />

      <CardBody className="flex flex-col space-y-3">
        {/* 📛 Title + Description */}
        <div>
          <h3 className="text-2xl font-semibold text-primary-800">
            {programName}
          </h3>
          <p className="text-base leading-relaxed text-foreground-600">
            {program.description ??
              program.standardProgramVersion?.program.description ??
              "A great learning foundation in a nurturing space."}
          </p>
        </div>

        {/* 🎯 Age Range */}
        {ageReq?.ageRange && (
          <Chip color="default" variant="dot">
            Ages {displayAgeRange(ageReq.ageRange)}
          </Chip>
        )}
      </CardBody>

      {/* 🚨 Footer */}
      <CardFooter className="flex flex-col items-center gap-3 pt-4">
        <Button
          as={Link}
          href={`/programs/${program.slug}`}
          fullWidth
          color="primary"
          variant="solid"
          radius="md"
          size="lg"
          startContent={<InfoIcon />}
        >
          View Program Details
        </Button>

        <Button
          as={WhatsAppLink}
          phoneNumber={whatsapp}
          message={`Hi, I'm interested in ${programName}. Can you tell me more about pricing and availability?`}
          fullWidth
          color="default"
          variant="bordered"
          radius="md"
          size="md"
          startContent={<SendIcon />}
        >
          Ask About Pricing
        </Button>
      </CardFooter>
    </Card>
  );
}
