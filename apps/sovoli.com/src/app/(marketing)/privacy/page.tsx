// app/privacy/page.tsx (Next.js App Router)

export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Privacy Policy</h1>
      <p>Effective Date: September 2025</p>

      <p>
        Sovoli is operated by <strong>Carbon Technologies Ltd</strong>, a
        Jamaican company. This Privacy Policy explains how we collect, use, and
        share information when schools, parents, students, and other users
        access Sovoli services, including websites hosted for partner schools,
        WhatsApp integrations, and advertising systems.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect the following types of information:</p>
      <ul>
        <li>
          <strong>Basic identifiers:</strong> name, phone number, email,
          location.
        </li>
        <li>
          <strong>Enrollment data:</strong> program or grade applied for,
          student age, and school-specific requirements.
        </li>
        <li>
          <strong>Device and analytics data:</strong> IP address, browser,
          cookies, log files, and events captured through PostHog.
        </li>
        <li>
          <strong>Communications data:</strong> WhatsApp messages, website form
          submissions, and lead data.
        </li>
      </ul>

      <h2>2. How We Use Information</h2>
      <p>We use the information collected to:</p>
      <ul>
        <li>Route leads and enrollment requests to the correct school.</li>
        <li>
          Facilitate communication between schools and their customers (parents
          and students).
        </li>
        <li>
          Provide analytics and insights to schools using PostHog as our CDP.
        </li>
        <li>
          Improve the Sovoli platform, hosted on Vercel with databases on Neon
          and Supabase.
        </li>
        <li>Comply with legal obligations and regulatory requirements.</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>
        We do not sell personal data. We may share information in the following
        ways:
      </p>
      <ul>
        <li>
          <strong>With schools (tenants):</strong> data submitted by parents or
          students is shared with the school they interact with.
        </li>
        <li>
          <strong>With service providers:</strong> Vercel (hosting), Neon and
          Supabase (databases), PostHog (analytics), and WhatsApp Business API
          (communications).
        </li>
        <li>
          <strong>With Meta (Facebook/Instagram):</strong> we send certain data,
          including phone numbers and event data, back to Meta via the
          Conversions API (CAPI) to support lead automation, analytics, and
          advertising.
        </li>
        <li>
          <strong>For legal reasons:</strong> if required by law or government
          request.
        </li>
      </ul>

      <h2>4. International Data Transfers</h2>
      <p>
        Data may be processed in Jamaica, Guyana, the United States, or other
        regions depending on hosting and service providers. We take reasonable
        steps to ensure that appropriate safeguards are in place for
        international transfers.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        Lead and enrollment data are retained while a school relationship is
        active, unless deletion is requested. Analytics and system logs are
        retained for operational and product improvement. Users may request
        deletion of their data at any time (see Section 9).
      </p>

      <h2>6. Children’s Privacy</h2>
      <p>
        Sovoli processes children’s information only when submitted by parents
        or schools. Sovoli does not create accounts directly for children under
        13 (or under 16 in certain jurisdictions). Responsibility for obtaining
        parental consent lies with our partner schools.
      </p>

      <h2>7. Security</h2>
      <p>
        We use encryption in transit (HTTPS) and at rest, role-based access
        controls, and industry-standard safeguards. However, no system can be
        guaranteed 100% secure.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Depending on your location, you may have rights under data protection
        laws (such as GDPR or CCPA), including:
      </p>
      <ul>
        <li>Access to your personal data.</li>
        <li>Correction of inaccurate information.</li>
        <li>Deletion of your data (“right to be forgotten”).</li>
        <li>Opt-out of marketing communications.</li>
      </ul>
      <p>
        To exercise these rights, please contact us using the details in Section
        11.
      </p>

      <h2>9. Updates</h2>
      <p>
        We may update this Privacy Policy from time to time. Updates will be
        posted on this page with a new “Effective Date.” We encourage you to
        review it periodically.
      </p>

      <h2>10. Contact</h2>
      <p>
        <strong>Carbon Technologies Ltd</strong>
        <br />
        Kingston, Jamaica
        <br />
        Email: hi@sovoli.com
      </p>
    </div>
  );
}
