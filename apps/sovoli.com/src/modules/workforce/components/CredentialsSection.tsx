"use client";

import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@sovoli/ui/components/dialog";
import { AwardIcon, ChevronLeftIcon, ExternalLinkIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { startTransition, useEffect, useState } from "react";
import type { Media, VisualMediaType } from "~/modules/core/media/types";
import { filterVisualMedia } from "~/modules/core/media/types";
import type { Credential } from "~/modules/workforce/types";

interface CredentialsSectionProps {
  credentials: Credential[];
}

function getCredentialTypeLabel(type: Credential["type"]): string {
  switch (type) {
    case "certification":
      return "Certification";
    case "license":
      return "License";
    case "membership":
      return "Membership";
    case "award":
      return "Award";
    case "other":
      return "Credential";
    default:
      return "Credential";
  }
}

function getCredentialTypeColor(
  type: Credential["type"],
): "default" | "primary" | "secondary" | "success" | "warning" | "danger" {
  switch (type) {
    case "certification":
      return "primary";
    case "license":
      return "success";
    case "membership":
      return "secondary";
    case "award":
      return "warning";
    case "other":
      return "default";
    default:
      return "default";
  }
}

function isExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry < today;
}

function isExpiringSoon(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  return expiry >= today && expiry <= thirtyDaysFromNow;
}

export function CredentialsSection({ credentials }: CredentialsSectionProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMedia, setSelectedMedia] = useState<
    (Media & { type: VisualMediaType })[]
  >([]);
  const [initialIndex, setInitialIndex] = useState(0);

  if (credentials.length === 0) {
    return null;
  }

  const handleImageClick = (
    media: (Media & { type: VisualMediaType })[],
    index: number,
  ) => {
    setSelectedMedia(media);
    setInitialIndex(index);
    onOpen();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
        <AwardIcon className="h-4 w-4 text-primary" />
        Credentials
      </h3>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {credentials.map((credential) => {
            const expired = isExpired(credential.expiryDate);
            const expiringSoon = isExpiringSoon(credential.expiryDate);
            const key = `${credential.type}-${credential.name}-${credential.credentialId ?? credential.issueDate ?? ""}`;
            const visualMedia = credential.media
              ? filterVisualMedia(credential.media)
              : [];
            const firstImage = visualMedia[0];

            return (
              <CarouselItem
                key={key}
                className="pl-2 md:pl-4 basis-[85%] md:basis-[45%]"
              >
                <Card className="h-full">
                  <CardBody className="p-4">
                    {firstImage && firstImage.type === "image" && (
                      <button
                        type="button"
                        className="relative aspect-square w-full mb-3 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity p-0 border-0 bg-transparent"
                        onClick={() => handleImageClick(visualMedia, 0)}
                        aria-label={`View ${credential.name} certificate images`}
                      >
                        <CldImage
                          src={firstImage.publicId}
                          alt={
                            firstImage.alt ?? `${credential.name} certificate`
                          }
                          width={400}
                          height={400}
                          crop="fill"
                          sizes="(max-width: 768px) 85vw, 45vw"
                          quality="auto"
                          className="object-cover w-full h-full"
                        />
                      </button>
                    )}
                    <div className="text-sm">
                      <div className="flex items-start gap-2 mb-1">
                        <div className="font-medium text-foreground flex-1">
                          {credential.name}
                        </div>
                        <Badge
                          size="sm"
                          color={getCredentialTypeColor(credential.type)}
                          variant="flat"
                        >
                          {getCredentialTypeLabel(credential.type)}
                        </Badge>
                      </div>

                      {credential.issuingOrganization && (
                        <div className="text-foreground-600">
                          {credential.issuingOrganization}
                        </div>
                      )}

                      {credential.description && (
                        <div className="text-foreground-500 text-xs mt-1">
                          {credential.description}
                        </div>
                      )}

                      <div className="text-foreground-500 text-xs mt-1">
                        {credential.issueDate && (
                          <span>
                            Issued: {credential.issueDate}
                            {credential.expiryDate && " • "}
                          </span>
                        )}
                        {credential.expiryDate && (
                          <span
                            className={
                              expired
                                ? "text-danger"
                                : expiringSoon
                                  ? "text-warning"
                                  : ""
                            }
                          >
                            {expired
                              ? `Expired: ${credential.expiryDate}`
                              : `Expires: ${credential.expiryDate}`}
                          </span>
                        )}
                      </div>

                      {credential.credentialId && (
                        <div className="text-foreground-500 text-xs mt-1">
                          ID: {credential.credentialId}
                        </div>
                      )}

                      {credential.verificationUrl && (
                        <a
                          href={credential.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs mt-1 inline-flex items-center gap-1"
                        >
                          Verify credential
                          <ExternalLinkIcon className="h-3 w-3" />
                        </a>
                      )}

                      {credential.notes && (
                        <div className="text-foreground-500 text-xs mt-1 italic">
                          {credential.notes}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <FullScreenGallery
        photos={selectedMedia}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={initialIndex}
      />
    </div>
  );
}

function FullScreenGallery({
  photos,
  isOpen,
  onClose,
  initialIndex,
}: {
  photos: (Media & { type: VisualMediaType })[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (!api) {
      return;
    }

    startTransition(() => {
      setCurrent(api.selectedScrollSnap());
    });

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex);
    });
  }, [api]);

  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="full" hideCloseButton>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <Button variant="light" isIconOnly radius="full" onPress={onClose}>
            <ChevronLeftIcon />
          </Button>
          {photos.length > 1 && (
            <span className="text-sm">
              {current + 1} / {photos.length}
            </span>
          )}
        </ModalHeader>
        <ModalBody className="p-0 flex-1 overflow-hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              startIndex: initialIndex,
            }}
            setApi={setApi}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {photos.map((media, index) => (
                <CarouselItem
                  key={media.publicId}
                  className="basis-full pl-0 h-full"
                >
                  <div className="w-full h-full relative flex items-center justify-center">
                    {media.type === "video" ? (
                      <video
                        src={media.url}
                        className="object-contain w-full h-full max-w-full max-h-full"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        poster={media.posterUrl}
                      />
                    ) : (
                      <CldImage
                        src={media.publicId}
                        alt={media.alt ?? `Certificate image ${index + 1}`}
                        width={media.width ?? 1200}
                        height={media.height ?? 1200}
                        sizes="100vw"
                        className="object-contain"
                        priority
                      />
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
