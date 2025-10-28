"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, Tab } from "@sovoli/ui/components/tabs";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  SearchIcon,
  TargetIcon,
  GlobeIcon,
  MessageCircleIcon,
  ChevronRightIcon,
} from "lucide-react";
import bingResultImage from "./bing-result.png";
import googleResultImage from "./google-maps.png";
import sovoliDirectoryImage from "./sovoli-directory.png";
import type { StaticImageData } from "next/image";
import { Button } from "@sovoli/ui/components/button";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalHeader,
} from "@sovoli/ui/components/dialog";
import { ChevronLeftIcon } from "lucide-react";

type FeatureKey = "discovery" | "ads" | "diagnostics" | "leadCapture";

interface Screenshot {
  image: StaticImageData;
  footnote?: string;
}

const features: Record<
  FeatureKey,
  {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    headline: string;
    description: string;
    features: string[];
    screenshots?: Screenshot[];
    nextFeature?: FeatureKey;
  }
> = {
  discovery: {
    title: "Discovery",
    icon: SearchIcon,
    headline: "Parents are searching.",
    description:
      "A mother opens her phone and types ‘best schools near me.’ Your school appears at the top.",
    features: [
      "Show up when parents search online",
      "Appear on Google and Bing maps",
      "Be listed in trusted school directories",
    ],
    screenshots: [
      {
        image: bingResultImage,
        footnote: "We rank on the first pages of Google and Bing.",
      },
      {
        image: googleResultImage,
        footnote: "Fully fleshed out Maps listing to show up for more parents.",
      },
      {
        image: sovoliDirectoryImage,
        footnote: "Rank up in our directory with over 500+ monthly visitors.",
      },
    ],
    nextFeature: "ads",
  },
  ads: {
    title: "Ads",
    icon: TargetIcon,
    headline: "Intelligent Advertising",
    description:
      "A mother nearby is scrolling through Facebook when she sees your ad. We put even more families in front of your school.",
    features: [
      "We run and manage Facebook + Instagram ads for you.",
      "Target the right parents in your local area automatically",
      "Ad performance reports (how much did you spend? how many leads did you get? how much did you earn?)",
    ],
    nextFeature: "diagnostics",
  },
  diagnostics: {
    title: "Website",
    icon: GlobeIcon,
    headline: "Professional Website Built for Mobile",
    description:
      "Majority of parents are using mobile devices to search for schools, so we build a website that works perfectly on mobile.",
    features: [
      "Program Finder page to showcase your programs",
      "Comprehensive program details page",
      "School Calendar to showcase your events and activities",
      "AI Chatbot to answer parent questions",
      "Enrollment and schedule visitation flows",
    ],
    nextFeature: "leadCapture",
  },
  leadCapture: {
    title: "WhatsApp",
    icon: MessageCircleIcon,
    headline: "Convert Visitors Into Conversations",
    description:
      "Guyanese parents prefer to communicate via WhatsApp. So we send high quality leads to your WhatsApp number.",
    features: ["One-click WhatsApp chat", "Follow-up reminders"],
  },
};

// Modal Component for full-screen image viewing
function FeatureImageModal({
  screenshots,
  alt,
  isOpen,
  onClose,
  initialIndex = 0,
}: {
  screenshots: Screenshot[];
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const currentScreenshot = screenshots[current];

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="full" hideCloseButton>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <Button variant="light" isIconOnly radius="full" onPress={onClose}>
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm">
            {current + 1} / {screenshots.length}
          </span>
        </ModalHeader>
        <ModalBody className="p-0 flex-1 overflow-hidden">
          <Carousel
            opts={{
              align: "start",
              loop: screenshots.length > 1,
              startIndex: initialIndex,
            }}
            setApi={setApi}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {screenshots.map((screenshot, index) => (
                <CarouselItem key={index} className="basis-full pl-0 h-full">
                  <div className="w-full h-full relative flex items-center justify-center bg-default-50">
                    <Image
                      src={screenshot.image}
                      alt={`${alt} ${index + 1}`}
                      className="object-contain max-w-full max-h-full"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Footnote in modal */}
          {currentScreenshot?.footnote && (
            <div className="p-4 bg-default-50 border-t border-default-200">
              <p className="text-sm text-default-600 text-center">
                {currentScreenshot.footnote}
              </p>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function FeatureImageCarousel({
  screenshots,
  alt,
  footnote,
}: {
  screenshots: Screenshot[];
  alt: string;
  footnote?: string;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const currentScreenshot = screenshots[current];

  return (
    <div className="mt-6">
      <Carousel
        opts={{
          align: "start",
          loop: screenshots.length > 1,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {screenshots.map((screenshot, index) => (
            <CarouselItem key={index} className="basis-full pl-0">
              <div className="w-full aspect-[12/9] relative border border-default-200 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <Image
                  src={screenshot.image}
                  alt={`${alt} ${index + 1}`}
                  className="w-full h-full object-cover object-top"
                  onClick={onOpen}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Dots Indicator */}
      {screenshots.length > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {Array.from({ length: Math.min(5, screenshots.length) }, (_, i) => {
            let slideIndex;
            if (screenshots.length <= 5) {
              // If 5 or fewer screenshots, show all dots
              slideIndex = i;
            } else if (current < 2) {
              // Near the beginning, show first 5
              slideIndex = i;
            } else if (current >= screenshots.length - 2) {
              // Near the end, show last 5
              slideIndex = screenshots.length - 5 + i;
            } else {
              // In the middle, show dots around current position
              slideIndex = current - 2 + i;
            }

            return (
              <div
                key={i}
                className={`h-1 rounded-sm transition-all duration-200 ${
                  current === slideIndex
                    ? "bg-primary-500 w-8"
                    : "bg-default-300 w-4"
                }`}
                aria-label={`Slide ${slideIndex + 1} of ${screenshots.length}`}
              />
            );
          })}
        </div>
      )}
      {/* Footnote - show screenshot-specific footnote or general footnote */}
      {(currentScreenshot?.footnote ?? footnote) && (
        <p className="mt-2 text-sm text-default-500 text-center">
          {currentScreenshot?.footnote ?? footnote}
        </p>
      )}
      {/* Full Screen Modal */}
      <FeatureImageModal
        screenshots={screenshots}
        alt={alt}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={current}
      />
    </div>
  );
}

export function Features() {
  const [selectedTab, setSelectedTab] = useState<FeatureKey>("discovery");

  const currentFeature = features[selectedTab];
  const nextFeatureKey = currentFeature.nextFeature ?? null;

  return (
    <section className="py-6 px-4 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Features</h2>
        </div>

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as FeatureKey)}
          className="w-full"
        >
          {Object.entries(features).map(([key, feature]) => {
            const IconComponent = feature.icon;
            const isCurrentTab = key === selectedTab;
            const currentNextKey = isCurrentTab ? nextFeatureKey : null;

            return (
              <Tab
                key={key}
                title={
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{feature.title}</span>
                    <span className="sm:hidden">
                      {feature.title.split(" ")[0]}
                    </span>
                  </div>
                }
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold">
                          {feature.headline}
                        </h3>
                        <p className="text-default-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <ul className="space-y-3">
                      {feature.features.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                          <span className="text-default-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {feature.screenshots && feature.screenshots.length > 0 && (
                      <FeatureImageCarousel
                        screenshots={feature.screenshots}
                        alt={feature.headline}
                      />
                    )}
                    {isCurrentTab && currentNextKey && (
                      <div className="mt-6 flex justify-end">
                        <Button
                          onPress={() => setSelectedTab(currentNextKey)}
                          className="gap-2"
                        >
                          Next: Learn about {features[currentNextKey].title}
                          <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Tab>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
