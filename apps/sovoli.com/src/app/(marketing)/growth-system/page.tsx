import { Overview } from "./components/Overview";
import { Customers } from "./components/Customers";
import { Features } from "./components/Features";
import { Answers } from "./components/Answers";
import { Pricing } from "./components/Pricing";
import { Compare } from "./components/Compare";

export const metadata = {
  title: "Growth System – Sovoli",
  description:
    "A complete digital visibility and lead system built for small private schools in Guyana. Turn parent searches into enrollment conversations automatically.",
};

export default function GrowthSystemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <Overview />
      <Customers />
      <Features />
      <Answers />
      <Pricing />
      <Compare />
    </div>
  );
}
