"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { ArrowRightIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import type { Service } from "~/modules/services/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { slugify } from "~/utils/slugify";

export interface ServiceCardProps {
  service: Service;
  orgInstance: OrgInstance;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const serviceSlug = service.slug ?? slugify(service.name);
  const serviceUrl = `/services/${serviceSlug}`;
  const serviceImage = service.media?.find((m) => m.type === "image");

  return (
    <Card className="overflow-hidden shadow-md transition hover:shadow-lg">
      {/* 🖼️ Image */}
      <div className="relative">
        {serviceImage ? (
          <CldImage
            src={serviceImage.publicId}
            alt={serviceImage.alt ?? service.name}
            width={800}
            height={200}
            crop="fill"
            sizes="(max-width: 768px) 100vw, 400px"
            quality="auto"
            className="h-32 w-full object-cover"
          />
        ) : (
          <div className="h-32 w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-4xl text-muted-foreground">💆</div>
          </div>
        )}
      </div>

      <CardBody className="flex flex-col space-y-3">
        {/* 📛 Title + Description */}
        <div>
          <h3 className="text-xl font-semibold text-primary-800">
            {service.name}
          </h3>
          <p className="text-base leading-relaxed text-foreground-600">
            {service.description}
          </p>
        </div>

        {/* 💰 Price */}
        {service.price && (
          <div className="text-lg font-bold text-primary">{service.price}</div>
        )}
      </CardBody>

      {/* 🚨 Footer */}
      <CardFooter className="flex flex-col items-center gap-3 pt-4">
        <Button
          as={Link}
          href={serviceUrl}
          fullWidth
          color="primary"
          variant="solid"
          radius="md"
          size="lg"
          startContent={<ArrowRightIcon className="w-5 h-5" />}
        >
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}
