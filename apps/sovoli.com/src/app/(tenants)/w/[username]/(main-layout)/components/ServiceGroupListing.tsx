"use client";

import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Link } from "@sovoli/ui/components/link";
import { ArrowRightIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ServiceGroupListingProps {
  orgInstance: OrgInstance;
}

/**
 * Checks if a URL is external (starts with http:// or https://)
 */
function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Gets the appropriate link URL for a service
 * - If external URL (like Fresha), use that URL
 * - Otherwise, use the service URL as-is (should be a relative path like /services)
 */
function getServiceLinkUrl(serviceUrl: string): string {
  // If it's external, use it directly
  if (isExternalUrl(serviceUrl)) {
    return serviceUrl;
  }
  // Otherwise, it's a relative/internal path - use it as-is
  return serviceUrl;
}

export function ServiceGroupListing({ orgInstance }: ServiceGroupListingProps) {
  const services = orgInstance.serviceModule?.services ?? [];

  if (services.length === 0) {
    return null;
  }

  // Check if we have any external URLs - if so, use first external URL for "View all"
  // Otherwise, link to internal /services page
  const firstExternalUrl = services.find((s) => isExternalUrl(s.url))?.url;
  const viewAllUrl = firstExternalUrl ?? "/services";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Featured Services
          </h2>
          <Link
            href={viewAllUrl}
            target={isExternalUrl(viewAllUrl) ? "_blank" : undefined}
            rel={isExternalUrl(viewAllUrl) ? "noopener noreferrer" : undefined}
            className="text-sm text-foreground underline flex items-center gap-1"
          >
            View all
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {services.map((service) => {
                const linkUrl = getServiceLinkUrl(service.url);
                const isExternal = isExternalUrl(service.url);

                return (
                  <CarouselItem
                    key={service.name}
                    className="pl-2 basis-[216px] shrink-0"
                  >
                    <Link
                      href={linkUrl}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="block w-full"
                    >
                    <Card className="overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-card h-full w-[200px] flex flex-col mr-4">
                      <div className="relative aspect-square w-full">
                        {service.media && service.media.length > 0 && service.media[0]?.type === "image" ? (
                          <CldImage
                            src={service.media[0].publicId}
                            alt={service.media[0].alt ?? service.name}
                            width={200}
                            height={200}
                            crop="fill"
                            aspectRatio="1:1"
                            sizes="200px"
                            quality="auto"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <div className="text-4xl text-muted-foreground">
                              💆
                            </div>
                          </div>
                        )}
                      </div>
                      <CardBody className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                            {service.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
                            {service.description}
                          </p>
                        </div>
                        <div className="mt-auto">
                          {service.price && (
                            <div className="text-sm font-bold text-primary">
                              {service.price}
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </CarouselItem>
              );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
