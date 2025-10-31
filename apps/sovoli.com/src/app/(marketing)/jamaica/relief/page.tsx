import type { Metadata } from "next";
import { ReliefForm } from "./components/ReliefForm";

export const metadata: Metadata = {
  title: "Jamaica Hurricane Relief",
  description:
    "Pledge a care package or financial support to help communities in Jamaica recover after the hurricane.",
};

export default function JamaicaReliefPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 px-4 pb-16 pt-12">
      <div className="max-w-3xl text-center space-y-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
          Jamaica Relief Network
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Coordinate disaster relief for Jamaica
        </h1>
        <p className="text-lg text-default-500">
          Share the support you&apos;re ready to give. Let us know where you can
          drop off supplies or how much you can contribute financially, and our
          team will reach out with the next steps.
        </p>
      </div>
      <ReliefForm />
    </main>
  );
}
