import { WhatsAppButton } from "./components/WhatsAppButton";

type SearchParams = Promise<{
  school?: string;
}>;

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { school } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-screen-lg px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-bold text-default-900">
          Thank you for your feedback!
        </h1>
        <p className="mb-4 text-base text-default-600">
          We're excited to explore how Sovoli can support{" "}
          <span className="font-semibold text-default-800">
            {school ?? "your school"}
          </span>
          .
        </p>
        <p className="mb-8 text-base text-default-600">
          We’ll be in touch soon to discuss next steps.
        </p>

        <WhatsAppButton />
      </div>
    </main>
  );
}
