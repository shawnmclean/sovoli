"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import { PhoneIcon, SendIcon } from "lucide-react";

import { ContactMethods } from "../../../components/ContactMethods";
import type { OrgInstance } from "~/modules/organisations/types";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { Divider } from "@sovoli/ui/components/divider";

interface ApplyCardProps {
  orgInstance: OrgInstance;
}

export function ApplyCard({ orgInstance }: ApplyCardProps) {
  const [selected, setSelected] = useState("contact");
  const { org } = orgInstance;
  const locations = org.locations;
  const [selectedLocationKey, setSelectedLocationKey] = useState<string | null>(
    locations[0]?.key ?? null,
  );
  const selectedLocation = locations.find(
    (loc) => loc.key === selectedLocationKey,
  );

  return (
    <Card shadow="sm" className="overflow-visible">
      {locations.length > 1 ? (
        <>
          <CardHeader>
            <Select
              label="Select Location"
              selectedKeys={[selectedLocationKey ?? ""]}
              onSelectionChange={(keys) =>
                setSelectedLocationKey(keys.currentKey ?? null)
              }
              className="max-w-xs"
            >
              {locations.map((loc, idx) => (
                <SelectItem key={loc.key}>
                  {loc.label ?? `Location ${idx + 1}`}
                </SelectItem>
              ))}
            </Select>
          </CardHeader>
          <Divider />
        </>
      ) : null}
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
            <div className="px-2 py-6">
              {selectedLocation ? (
                <ContactMethods location={selectedLocation} />
              ) : null}
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
            <div className="px-2 py-6">Coming Soon</div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
