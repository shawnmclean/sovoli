"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import type { Service } from "~/modules/services/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { slugify } from "~/utils/slugify";

export interface ServiceCardProps {
  service: Service;
  orgInstance: OrgInstance;
}

export function ServiceCard({ service, orgInstance }: ServiceCardProps) {
  const serviceSlug = service.slug ?? slugify(service.name);
  const serviceUrl = `/services/${serviceSlug}`;

  return (
    <Card className="bg-content1">
      <CardHeader className="flex flex-col items-start gap-1">
        <div className="text-base font-semibold text-foreground">
          {service.name}
        </div>
        <div className="text-sm text-foreground-500">{service.description}</div>
      </CardHeader>
      <CardBody className="pt-0">
        <Button
          as={Link}
          href={serviceUrl}
          color="primary"
          variant="flat"
          radius="full"
          fullWidth
        >
          Learn more
        </Button>
      </CardBody>
    </Card>
  );
}
