import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { ArrowRightIcon } from "lucide-react";

export function HurricaneMelissaSection() {
  return (
    <section className="z-20 w-full max-w-screen-lg mt-6 md:mt-8">
      <Card
        className="border-2 border-primary/30 bg-gradient-to-r from-primary-50/50 to-default-50 dark:from-primary-950/30 dark:to-default-100/10 shadow-lg hover:shadow-xl transition-shadow"
        radius="lg"
      >
        <CardBody className="p-4 md:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-foreground">
                  Hurricane Melissa Recovery Projects
                </h2>
                <Chip
                  color="primary"
                  variant="solid"
                  size="md"
                  className="shrink-0 font-bold animate-pulse shadow-lg"
                  classNames={{
                    base: "bg-primary text-primary-foreground",
                  }}
                >
                  New
                </Chip>
              </div>
              <p className="text-sm sm:text-base text-foreground/70 line-clamp-1">
                View damage assessment and recovery projects from schools affected by Hurricane Melissa.
              </p>
            </div>
            
            {/* Button */}
            <div className="w-full sm:w-auto shrink-0">
              <Button
                as={Link}
                href="/projects"
                color="primary"
                size="md"
                endContent={<ArrowRightIcon className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                View Projects
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

