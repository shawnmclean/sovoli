import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import { Badge } from "@sovoli/ui/components/badge";
import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { displayAgeRange } from "../utils";
import { Image } from "@sovoli/ui/components/image";
import { ArrowRightIcon, UserIcon } from "lucide-react";
import { getProgramImageUrl } from "~/modules/academics/getProgramImage";

export interface ProgramCardProps {
  orgInstance: OrgInstance;
  program: Program;
}

export function ProgramCard({
  orgInstance: _orgInstance,
  program,
}: ProgramCardProps) {
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  const admission =
    program.admission ?? program.standardProgramVersion?.admission;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const ageReq = admission?.eligibility.find((r) => r.type === "age");

  return (
    <Card className="overflow-hidden shadow-md transition hover:shadow-lg">
      {/* 🖼️ Image */}
      <div className="relative">
        <Image
          src={getProgramImageUrl(program) ?? ""}
          alt={programName}
          width={800}
          height={150}
          className="h-52 w-full object-cover"
        />

        {/* Popular Badge */}
        {program.isPopular && (
          <div className="absolute top-3 left-3 z-20">
            <Badge color="warning" variant="flat" size="sm">
              🔥 Popular
            </Badge>
          </div>
        )}
      </div>

      <CardBody className="flex flex-col space-y-3">
        {/* 📛 Title + Description */}
        <div>
          <h3 className="text-xl font-semibold text-primary-800">
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
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-foreground-500" />
            <Chip color="default" variant="dot">
              Ages {displayAgeRange(ageReq.ageRange)}
            </Chip>
          </div>
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
          startContent={<ArrowRightIcon className="w-5 h-5" />}
        >
          Learn More
        </Button>

        <p className="text-xs text-foreground-500 text-center">
          📸 Real Classrooms &middot; 📚 Books &middot; 📖 Learning
        </p>
      </CardFooter>
    </Card>
  );
}
