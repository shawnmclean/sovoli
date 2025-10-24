"use client";

import { useState } from "react";
import { Tabs, Tab } from "@sovoli/ui/components/tabs";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import {
  BarChart3Icon,
  SearchIcon,
  TargetIcon,
  GlobeIcon,
  MessageCircleIcon,
} from "lucide-react";

const features = {
  diagnostics: {
    title: "Digital Readiness Diagnostics",
    icon: BarChart3Icon,
    content: {
      headline: "Understand Your School's Digital Health",
      description:
        "Get a comprehensive assessment of your school's online presence and digital marketing readiness.",
      features: [
        "Website performance analysis",
        "Social media presence audit",
        "Google Business Profile optimization",
        "Online reputation assessment",
        "Competitive positioning analysis",
      ],
    },
  },
  discovery: {
    title: "Parent Discovery Engine",
    icon: SearchIcon,
    content: {
      headline: "Be Found When Parents Search",
      description:
        "Optimize your school's visibility so parents find you first when looking for education options.",
      features: [
        "Local SEO optimization",
        "Google Business Profile setup",
        "Online directory listings",
        "Review management system",
        "Search ranking monitoring",
      ],
    },
  },
  ads: {
    title: "Smart Advertising Platform",
    icon: TargetIcon,
    content: {
      headline: "Facebook & Google Ads That Actually Convert",
      description:
        "Run cost-effective advertising campaigns that target the right parents at the right time.",
      features: [
        "Facebook CAPI integration",
        "Automated ad optimization",
        "Parent persona targeting",
        "Cost-per-lead tracking",
        "A/B testing campaigns",
      ],
    },
  },
  website: {
    title: "Mobile-First School Website",
    icon: GlobeIcon,
    content: {
      headline: "Professional Website Built for Mobile",
      description:
        "Get a fast, beautiful website that works perfectly on phones and converts visitors into leads.",
      features: [
        "Mobile-optimized design",
        "Fast loading speeds",
        "Parent-friendly navigation",
        "Program showcase pages",
        "Contact form integration",
      ],
    },
  },
  leadCapture: {
    title: "WhatsApp Lead Capture",
    icon: MessageCircleIcon,
    content: {
      headline: "Convert Visitors Into Conversations",
      description:
        "Seamlessly connect website visitors with your school through WhatsApp integration.",
      features: [
        "One-click WhatsApp chat",
        "Automated lead qualification",
        "Parent inquiry management",
        "Follow-up reminders",
        "Lead tracking dashboard",
      ],
    },
  },
};

export function Features() {
  const [selectedTab, setSelectedTab] = useState("diagnostics");

  return (
    <section className="py-8 px-4 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Complete Growth System
          </h2>
          <p className="text-base sm:text-lg text-default-600 max-w-2xl mx-auto px-4">
            Five integrated tools that work together to grow your school's
            enrollment systematically.
          </p>
        </div>

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
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
                <Card className="bg-background mt-6">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
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
