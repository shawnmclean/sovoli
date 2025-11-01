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
        <h1 className="text-xl font-bold tracking-tight sm:text-5xl">
          Hurricane Package Delivery
        </h1>
        <p className="text-default-500">
          We are collecting care packages from Kingston region to be deliverered
          to Black River and Savanna-la-Mar regions.
        </p>
      </div>
      <ReliefForm />
    </main>
  );
}
