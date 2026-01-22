import { notFound } from "next/navigation";
import { plans } from "~/modules/plans/data";

export interface PlanPageProps {
  params: Promise<{ plan: string }>;
}

export default async function PlanPage({ params }: PlanPageProps) {
  const { plan } = await params;
  const planDefinition = plans.find((p) => p.key === plan);
  if (!planDefinition) {
    return notFound();
  }
  return (
    <main className="mx-auto w-full max-w-screen-lg px-4 pb-16 pt-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        {planDefinition.title}
      </h1>
    </main>
  );
}
