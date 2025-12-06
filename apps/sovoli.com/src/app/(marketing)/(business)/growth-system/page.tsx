import { Overview } from "./components/Overview";
import { Customers } from "./components/Customers";
import { Features } from "./components/Features";
// import { Answers } from "./components/Answers";
import { Pricing } from "./components/Pricing";
import { Diagnostics } from "./components/Diagnostics";
import { CTA } from "./components/CTA";
import type { TrackingEventProperties } from "./components/Tracking";
import { Tracking } from "./components/Tracking";
// import { Roadmap } from "./components/Roadmap";
// import { Compare } from "./components/Compare";

export const metadata = {
  title: "Growth System – Sovoli",
  description:
    "A complete digital visibility and lead system built for small private schools in Guyana. Turn parent searches into enrollment conversations automatically.",
};

export default function GrowthSystemPage() {
  const trackingProperties: TrackingEventProperties = {
    content_name: "Growth System",
    content_type: "product",
    content_ids: ["growth-system"],
    value: 80000,
    currency: "GYD",
    predicted_ltv: 1200000,
    audience: "school-admin",
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <Tracking trackingEventProperties={trackingProperties} />
      <Overview />
      <Customers />
      <Features />
      {/* <Answers /> */}
      <Pricing />
      <CTA trackingEventProperties={trackingProperties} />
      <Diagnostics />
      {/* <Roadmap /> */}
      {/* <Compare /> */}
    </div>
  );
}
