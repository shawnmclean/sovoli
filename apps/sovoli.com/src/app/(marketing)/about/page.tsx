export const metadata = {
  title: "About – Sovoli",
  description:
    "Sovoli helps schools go digital fast. We give each school a smart website, an AI chat to talk with parents, and simple tools for managing visits, applications, and student records.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-6">About Sovoli</h1>

        <p className="mb-8">
          Sovoli is a digital platform made for schools. It connects your
          website, chat, student data, and parent communication—all in one
          simple system. We make it easy for school owners and administrators to
          modernize without needing extra staff or complex software.
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Why Schools Use Sovoli
            </h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Fast setup:</strong> Your school gets a website and lead
                system in one day.
              </li>
              <li>
                <strong>Easy communication:</strong> Parents chat through a
                friendly bot that handles visits and applications.
              </li>
              <li>
                <strong>Smart records:</strong> Keep all student and guardian
                data in one place, ready to export or share.
              </li>
              <li>
                <strong>Everything connected:</strong> Visits, applications,
                fees, and records flow together automatically.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <p className="mb-4">
              Parents visit your school site and start a short chat. The bot
              collects their name, number, and their child's age. Then it helps
              them schedule a visit or start applying. Your team gets a WhatsApp
              alert so you can follow up quickly.
            </p>
            <p>
              Behind the scenes, Sovoli keeps everything organized. Student
              data, program details, and fees are stored neatly so your staff
              spends less time on paperwork and more time teaching.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Built for the Caribbean
            </h2>
            <p>
              Sovoli is made for schools in Jamaica, Guyana, and the wider
              Caribbean. It's light, fast, and works even on slow networks.
              Schools can start small, then grow into full digital systems with
              payments, job applications, and e‑commerce.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
            <p>
              Sovoli was built by Caribbean engineers who understand the daily
              work of running a school. We believe every school—no matter how
              small—deserves world‑class tools to manage learning and growth.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
