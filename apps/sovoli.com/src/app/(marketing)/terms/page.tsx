export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong>{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Sovoli ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement. If
              you do not agree to abide by the above, please do not use this
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Service
            </h2>
            <p>
              Sovoli is an educational technology platform that provides digital
              solutions for schools, organizations, and educational
              institutions. Our services include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                Website creation and management for educational institutions
              </li>
              <li>Digital record management systems</li>
              <li>Student enrollment and application management</li>
              <li>Communication tools for schools and parents</li>
              <li>Educational program management</li>
              <li>Analytics and reporting tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. User Accounts and Registration
            </h2>
            <p>
              To access certain features of the Service, you may be required to
              create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Acceptable Use Policy
            </h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>
                Upload, transmit, or distribute harmful, offensive, or
                inappropriate content
              </li>
              <li>
                Attempt to gain unauthorized access to the Service or other
                users' accounts
              </li>
              <li>
                Use the Service for commercial purposes without proper
                authorization
              </li>
              <li>Interfere with or disrupt the Service or servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Educational Content and Data
            </h2>
            <p>
              Users are responsible for the accuracy and appropriateness of all
              content and data uploaded to the Service. Sovoli:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Does not verify the accuracy of user-provided content</li>
              <li>
                Reserves the right to remove inappropriate or harmful content
              </li>
              <li>Is not responsible for the content posted by users</li>
              <li>May use anonymized data for service improvement purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Privacy and Data Protection
            </h2>
            <p>
              Your privacy is important to us. Our collection and use of
              personal information is governed by our Privacy Policy, which is
              incorporated into these Terms by reference. By using the Service,
              you consent to our collection and use of information as outlined
              in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Intellectual Property Rights
            </h2>
            <p>
              The Service and its original content, features, and functionality
              are owned by Sovoli and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property
              laws. Users retain ownership of their content but grant Sovoli a
              license to use, store, and display such content as necessary to
              provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Service Availability and Modifications
            </h2>
            <p>
              Sovoli strives to maintain high service availability but does not
              guarantee uninterrupted access. We may:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Modify, suspend, or discontinue the Service at any time</li>
              <li>
                Perform maintenance that may temporarily affect service
                availability
              </li>
              <li>Update features and functionality to improve the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Sovoli shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to loss of profits, data, use,
              goodwill, or other intangible losses resulting from your use of
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Sovoli and its
              officers, directors, employees, and agents from and against any
              claims, damages, obligations, losses, liabilities, costs, or debt
              arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice, for any reason, including
              breach of these Terms. Upon termination, your right to use the
              Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of Guyana, without regard to its conflict of law
              provisions. Any disputes arising from these Terms or the Service
              shall be subject to the exclusive jurisdiction of the courts in
              Guyana.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              13. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              notify users of any material changes by posting the new Terms on
              this page and updating the "Last updated" date. Your continued use
              of the Service after such modifications constitutes acceptance of
              the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              14. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p>
                <strong>Email:</strong> hello@sovoli.com
              </p>
              <p>
                <strong>Website:</strong> https://sovoli.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
