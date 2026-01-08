import type { Metadata } from "next";
import { QualificationWizard } from "./components/QualificationWizard";

export const metadata: Metadata = {
  title: "Business Qualification | Sovoli",
  description: "Help us understand your business needs.",
};

export default function QualificationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <QualificationWizard />
      </main>
    </div>
  );
}
