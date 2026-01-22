"use client";

import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import type { ComponentProps, ReactNode } from "react";

interface DeviceTabsProps
  extends Omit<ComponentProps<typeof Tabs>, "children"> {
  iosContent: ReactNode;
  androidContent: ReactNode;
}

export function DeviceTabs({
  iosContent,
  androidContent,
  ...props
}: DeviceTabsProps) {
  return (
    <Tabs aria-label="Device type" {...props}>
      <Tab key="ios" title="iOS">
        {iosContent}
      </Tab>
      <Tab key="android" title="Android">
        {androidContent}
      </Tab>
    </Tabs>
  );
}
