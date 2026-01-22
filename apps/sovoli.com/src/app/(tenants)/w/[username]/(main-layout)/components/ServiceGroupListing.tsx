"use client";

import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Link } from "@sovoli/ui/components/link";
import { ArrowRightIcon } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ServiceGroupListingProps {
  orgInstance: OrgInstance;
}

interface Service {
  name: string;
  description: string;
  price: string;
}

const HEALING_EMERALD_SERVICES: Service[] = [
  {
    name: "Swedish Massage",
    description:
      "A timeless, soothing massage designed to melt away tension and promote deep relaxation. Gentle, flowing strokes enhance circulation, calm the nervous system, and restore the body's natural balance—leaving you refreshed, renewed, and radiating peace.",
    price: "price varies",
  },
  {
    name: "Deep Cleansing Facial",
    description:
      "Purity & Balance Renewal, A refreshing, purifying treatment designed to restore balance to tired, congested, or stressed skin.",
    price: "price varies",
  },
  {
    name: "Microdermabrasion",
    description:
      "Diamond Radiance Facial, Experience gentle resurfacing that polishes away dead skin cells using fine crystals or a diamond tip. This therapy refines texture, reduces fine lines, and enhances natural luminosity. Beyond beauty, it's a mindful moment of self-renewal ,helping you shed not only surface dullness but also the weight of daily stress.",
    price: "price varies",
  },
  {
    name: "Micro needling",
    description:
      "Cellular Rejuvenation Therapy, a transformative treatment that stimulates collagen production and skin healing through micro-needling technology. This rejuvenation ritual restores firmness, refines pores, and softens scars while fostering inner balance. It's a mindful journey of renewal ,as your skin regenerates, so does your sense of self.",
    price: "price varies",
  },
];

const FITRIGHT_SERVICES: Service[] = [
  {
    name: "Alterations",
    description:
      "Professional alteration services to ensure your garments fit perfectly. We handle hemming, taking in or letting out seams, adjusting sleeves, and more to make your clothes look tailor-made for you.",
    price: "Price on request",
  },
  {
    name: "Dress",
    description:
      "Custom dressmaking services. From elegant evening wear to casual day dresses, we create beautiful, well-fitted garments tailored to your style and measurements.",
    price: "Price on request",
  },
];

export function ServiceGroupListing({ orgInstance }: ServiceGroupListingProps) {
  const username = orgInstance.org.username;
  let services: Service[] = [];
  let bookingUrl: string | undefined;

  // Check for healingemeraldwellness
  if (username === "healingemeraldwellness") {
    services = HEALING_EMERALD_SERVICES;
    // Extract Fresha URL from socialLinks
    const freshaLink = orgInstance.org.socialLinks?.find(
      (link) => link.platform === "other" && link.label === "Fresha",
    );
    bookingUrl = freshaLink?.url;
  }
  // Check for fitright
  else if (username === "fitright") {
    services = FITRIGHT_SERVICES;
    // Use website URL for FitRight
    const websiteLink = orgInstance.org.socialLinks?.find(
      (link) => link.platform === "website",
    );
    bookingUrl = websiteLink?.url;
  }
  // No services for other tenants
  else {
    return null;
  }

  if (!bookingUrl || services.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Featured Services
          </h2>
          <Link
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
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
              {services.map((service) => (
                <CarouselItem
                  key={service.name}
                  className="pl-2 basis-[216px] shrink-0"
                >
                  <Link
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Card className="overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-card h-full w-[200px] flex flex-col mr-4">
                      <div className="relative aspect-square w-full">
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <div className="text-4xl text-muted-foreground">
                            {username === "fitright" ? "✂️" : "💆"}
                          </div>
                        </div>
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
                          <div className="text-sm font-bold text-primary">
                            {service.price}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
