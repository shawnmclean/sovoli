import { Card, CardBody } from "@sovoli/ui/components/card";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { InfoIcon } from "lucide-react";

const feesData = [
  {
    title: "Registration Fee",
    amount: "$10,000 GYD",
    description: "One-time fee for new students.",
  },
  {
    title: "Tuition Fee - Primary School",
    amount: "$40,000 GYD per term",
    description: "Covers tuition, basic materials, and access to facilities.",
  },
  {
    title: "Tuition Fee - Secondary School",
    amount: "$50,000 GYD per term",
    description:
      "Covers advanced subjects, extracurricular activities, and access to facilities.",
  },
  {
    title: "Uniform Fee",
    amount: "$6,000 GYD per set",
    description: "Mandatory for all students.",
  },
  {
    title: "Activity Fee",
    amount: "$4,000 GYD per term",
    description:
      "Covers school events, field trips, and extracurricular activities.",
  },
];

export default function FeesPage() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">School Fees</h2>
        <div className="space-y-4">
          {feesData.map((fee, index) => (
            <Card
              key={index}
              className="overflow-visible border-none"
              shadow="sm"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{fee.title}</h3>
                  <Tooltip content={fee.description} placement="top">
                    <InfoIcon className="h-5 w-5 cursor-help text-foreground-400" />
                  </Tooltip>
                </div>
                <p className="mt-2 text-lg font-semibold">{fee.amount}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
