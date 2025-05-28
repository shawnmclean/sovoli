"use client";

import { useState } from "react";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import { PhoneIcon, SendIcon } from "lucide-react";

import { ContactMethods } from "./ContactMethods";

export function ApplyCard() {
  const [selected, setSelected] = useState("contact");
  return (
    <Card shadow="sm" className="overflow-visible">
      <CardBody className="overflow-hidden p-0">
        <Tabs
          aria-label="Application options"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
          classNames={{
            base: "w-full",
            tabList: "bg-default-50 p-0",
            tab: "h-12",
            tabContent: "group-data-[selected=true]:text-primary",
          }}
          variant="underlined"
          color="primary"
        >
          <Tab
            key="contact"
            title={
              <div className="flex items-center gap-2">
                <PhoneIcon className="text-lg" />
                <span>Contact Us</span>
              </div>
            }
          >
            <div className="p-6">
              <ContactMethods />
            </div>
          </Tab>
          <Tab
            key="apply"
            title={
              <div className="flex items-center gap-2">
                <SendIcon className="text-lg" />
                <span>Apply Online</span>
              </div>
            }
          >
            <div className="p-6">Coming Soon</div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
