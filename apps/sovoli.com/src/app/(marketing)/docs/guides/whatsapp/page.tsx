import Link from "next/link";

export default function WhatsAppGuidePage() {
  return (
    <div className="flex min-h-[60vh] flex-col py-12">
      <div className="w-full max-w-4xl mx-auto space-y-8 prose">
        <div>
          <h1>WhatsApp Guide</h1>
          <p className="text-default-600">
            Learn how to set up and use WhatsApp features in Sovoli.
          </p>
        </div>

        <div className="space-y-4">
          <section>
            <h2>Getting Started</h2>
            <p>Content coming soon...</p>
          </section>

          <section>
            <h2>Related Guides</h2>
            <ul>
              <li>
                <Link href="/docs/guides/whatsapp/new-business">
                  Setting up WhatsApp for a new business
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
