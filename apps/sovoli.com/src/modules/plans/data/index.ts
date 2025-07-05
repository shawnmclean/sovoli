import type { PlanDefinition } from "../types";
import { growthPlan } from "./growth";

export const plans: PlanDefinition[] = [
  growthPlan,
  {
    key: "enrollment",
    title: "Enrollment Package",
    subtitle: "Smooth out your application process and increase conversions.",
    description:
      "We create an enrollment form, connect it to WhatsApp or email, and help parents complete applications easily.",
    features: {},
    pricingPackage: {
      pricingItems: [],
    },
  },
  {
    key: "sis",
    title: "Student Management (SIS)",
    subtitle: "Upgrade to a full student information system.",
    description:
      "We help you digitize attendance, grades, student records, and parent communication with a secure portal.",
    features: {},
    pricingPackage: {
      pricingItems: [],
    },
  },
];
