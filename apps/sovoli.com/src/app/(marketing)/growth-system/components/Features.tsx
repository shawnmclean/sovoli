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
  discovery: {
    title: "Discovery",
    icon: SearchIcon,
    content: {
      headline: "Parents are searching for your school",
      description:
        "Get your school infront of the right parents when they search for schools in your area.",
      features: [
        "Optimize search on Google and Bing maps",
        "Get found on popular search engines such as Google and Bing",
        "Rank up in popular school directories",
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

export function Features() {
  const [selectedTab, setSelectedTab] = useState("diagnostics");

  return (
    <section className="py-6 px-2 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Features</h2>
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
