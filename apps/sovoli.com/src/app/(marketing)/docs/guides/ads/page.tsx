import Link from "next/link";

export default function AdsGuidePage() {
  return (
    <div className="flex min-h-[60vh] flex-col py-12">
      <div className="w-full max-w-4xl mx-auto space-y-8 prose">
        <div>
          <h1>Ads Guide</h1>
          <p className="text-default-600">
            Learn how to create and manage advertising campaigns in Sovoli.
          </p>
        </div>

        <div className="space-y-4">
          <section>
            <h2>Getting Started</h2>
            <p>Content coming soon...</p>
          </section>

          <section>
            <h2>Creating Campaigns</h2>
            <p>Content coming soon...</p>
          </section>

          <section>
            <h2>Managing Ads</h2>
            <p>Content coming soon...</p>
          </section>

          <section>
            <h2>Related</h2>
            <ul>
              <li>
                <Link href="/docs/guides">Back to Guides</Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
