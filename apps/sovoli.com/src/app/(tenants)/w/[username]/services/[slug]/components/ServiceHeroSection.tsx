"use client";
import { DesktopGallery } from "~/components/DesktopGallery";
import { GalleryCarousel } from "~/components/GalleryCarousel";
import type { Service } from "~/modules/services/types";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ServiceHeroSectionProps {
  orgInstance: OrgInstance;
  service: Service;
  username: string;
}

export const ServiceHeroSection = ({
  orgInstance,
  service,
  username,
}: ServiceHeroSectionProps) => {
  const serviceName = service.name;

  return (
    <section className="border-b border-default-200 pb-6 md:border-b-0">
      {/* Mobile Gallery - Full Width */}
      <div className="md:hidden w-full">
        <GalleryCarousel
          media={service.media ?? []}
          title={serviceName}
          type="program"
          username={username}
          id={service.slug ?? service.name}
        />
      </div>

      {/* Desktop Gallery + Title Content - Inside Container */}
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-col-reverse gap-6">
          {/* Desktop Gallery Section */}
          <div className="hidden md:block w-full">
            <DesktopGallery
              media={service.media ?? []}
              title={serviceName}
              type="program"
              username={username}
              id={service.slug ?? service.name}
            />
          </div>

          {/* Title Content Section */}
          <div className="text-center">
            {/* Service Name */}
            <h1 className="text-2xl leading-tight tracking-tight my-4">
              {serviceName}
            </h1>

            <p className="text-sm text-foreground-500 max-w-3xl mx-auto">
              {service.description}
            </p>

            {/* Price */}
            {service.price && (
              <p className="text-sm text-foreground-500 mt-4">
                {service.price}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
