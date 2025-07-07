import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { displayAgeRange } from "../utils";
import { Image } from "@sovoli/ui/components/image";

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
              "A great learning foundation in a nurturing space."}
          </p>
        </div>

        {/* 🎯 Age Range */}
        {ageReq?.ageRange && (
          <Chip color="default" variant="dot">
            Ages {displayAgeRange(ageReq.ageRange)}
          </Chip>
        )}

        {/* 💰 Fees */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Registration:</span>
            <span>
              <span className="line-through text-red-400 mr-1">GYD NA</span>
              <span className="font-semibold text-white">GYD NA</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Per Term:</span>
            <span>
              <span className="line-through text-red-400 mr-1">GYD NA</span>
              <span className="font-semibold text-white">GYD NA</span>
            </span>
          </div>
        </div>
      </CardBody>

      {/* 🚨 Footer */}
      <CardFooter className="flex items-center justify-between pt-4">
        <Chip color="warning" variant="light" radius="sm">
          Pricing Coming Soon
        </Chip>

        <Button
          as={WhatsAppLink}
          phoneNumber={whatsapp}
          message={`Hi, I'm interested in ${programName}`}
          color="primary"
          variant="solid"
          radius="sm"
          size="sm"
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}
