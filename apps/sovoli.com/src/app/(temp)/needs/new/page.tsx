import type { Metadata } from "next";
import { ReliefForm } from "./components/ReliefForm";

export const metadata: Metadata = {
  title: "Jamaica School Needs Intake",
  description:
    "Share what your school or organisation needs after the hurricane so we can coordinate marketplace support.",
  openGraph: {
    title: "Jamaica School Needs Intake",
    description:
      "Document supplies and recovery needs from schools to coordinate community support.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jamaica School Needs Intake",
    description:
      "Share your campus needs so partners can mobilise supplies and assistance.",
  },
};

export default function JamaicaReliefPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ReliefForm />
    </main>
  );
}
