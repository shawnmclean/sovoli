import type { Metadata } from "next";
import { ReliefForm } from "./components/ReliefForm";

export const metadata: Metadata = {
  title: "Jamaica Hurricane Relief",
  description:
    "Pledge a care package or financial support to help communities in Jamaica recover after the hurricane.",
};

export default function JamaicaReliefPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 px-4 pb-16 pt-4">
      <ReliefForm />
    </main>
  );
}
