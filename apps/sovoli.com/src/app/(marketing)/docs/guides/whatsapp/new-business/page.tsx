import Link from "next/link";

export default function WhatsAppNewBusinessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col py-12">
      <div className="w-full max-w-4xl mx-auto space-y-8 prose">
        <div>
          <h1>Setting up WhatsApp for a New Business</h1>
          <p className="text-default-600">
            Step-by-step instructions for configuring WhatsApp when starting a
            new business on Sovoli.
          </p>
        </div>

        <div className="space-y-4">
          <section>
            <h2>Introduction</h2>
            <p>Content coming soon...</p>
          </section>

          <section>
            <h2>Steps</h2>
            <ol>
              <li>Step 1: Content coming soon...</li>
              <li>Step 2: Content coming soon...</li>
              <li>Step 3: Content coming soon...</li>
            </ol>
          </section>

          <section>
            <h2>Related</h2>
            <ul>
              <li>
                <Link href="/docs/guides/whatsapp">Back to WhatsApp Guide</Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
