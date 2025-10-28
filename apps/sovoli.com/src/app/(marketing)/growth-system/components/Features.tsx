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
  ArrowRight,
} from "lucide-react";
import bingResultImage from "./bing-result.png";
import googleResultImage from "./google-maps.png";
import type { StaticImageData } from "next/image";

type FeatureKey = "discovery" | "ads" | "diagnostics" | "leadCapture";

const features: Record<
  FeatureKey,
  {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    images?: StaticImageData[];
    content: {
      headline: string;
      description: string;
      features: string[];
      footnote?: string;
    };
  }
> = {
  discovery: {
    title: "Discovery",
    icon: SearchIcon,
    images: [bingResultImage, googleResultImage],
    content: {
      headline: "Parents are searching for schools right now.",
      description:
        "A mother opens her phone and types 'best schools near me.' We put your school in front of her.",
      features: [
        "Show up when parents search online for schools",
        "Appear on Google and Bing maps with directions",
        "Be listed in Sovoli's trusted school directory",
      ],
    },
  },
  ads: {
    title: "Ads",
    icon: TargetIcon,
    content: {
      headline: "Intelligent Advertising",
      description:
        "Run cost-effective advertising campaigns that target the right parents at the right time.",
      features: [
        "Create and run ads on Facebook and Instagram",
        "Learns your audience and targets them with the right ads",
        "Ad performance reports (how much did you spend? how many leads did you get? how much did you earn?)",
      ],
    },
  },
  diagnostics: {
    title: "Website",
    icon: GlobeIcon,
    content: {
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
    },
  },

  leadCapture: {
    title: "WhatsApp",
    icon: MessageCircleIcon,
    content: {
      headline: "Convert Visitors Into Conversations",
      description:
        "Guyanese parents prefer to communicate via WhatsApp. So we send high quality leads to your WhatsApp number.",
      features: ["One-click WhatsApp chat", "Follow-up reminders"],
    },
  },
};

function FeatureImageCarousel({
  images,
  alt,
}: {
  images: StaticImageData[];
  alt: string;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="mt-6 rounded-lg overflow-hidden relative">
      <Carousel
        opts={{
          align: "start",
          loop: images.length > 1,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {images.map((image, index) => (
            <CarouselItem key={index} className="basis-full pl-0">
              <div className="w-full relative">
                <Image
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: Math.min(5, images.length) }, (_, i) => {
            let slideIndex;
            if (images.length <= 5) {
              // If 5 or fewer images, show all dots
              slideIndex = i;
            } else if (current < 2) {
              // Near the beginning, show first 5
              slideIndex = i;
            } else if (current >= images.length - 2) {
              // Near the end, show last 5
              slideIndex = images.length - 5 + i;
            } else {
              // In the middle, show dots around current position
              slideIndex = current - 2 + i;
            }

            return (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  current === slideIndex
                    ? "bg-white scale-120 shadow-lg"
                    : "bg-white/60"
                }`}
                aria-label={`Slide ${slideIndex + 1} of ${images.length}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Features() {
  const [selectedTab, setSelectedTab] = useState<FeatureKey>("discovery");

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
                          {feature.content.headline}
                        </h3>
                        <p className="text-default-600">
                          {feature.content.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <ul className="space-y-3">
                      {feature.content.features.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                          <span className="text-default-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {feature.images && feature.images.length > 0 && (
                      <>
                        <FeatureImageCarousel
                          images={feature.images}
                          alt={feature.content.headline}
                        />
                        <div className="mt-4">
                          <a
                            href="https://www.google.com/search?q=private+schools+in+guyana"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 underline inline-flex items-center gap-1"
                          >
                            see it yourself
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </>
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
