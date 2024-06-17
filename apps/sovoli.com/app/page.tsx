import { Button } from "@sovoli/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className="text-2xl font-bold mb-4">
          Private Software, pls leave, kthxbai
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Infra</h2>
          <p>✅ DNS</p>
          <p>✅ Status</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Shared Lib</h2>
          <p>
            ✅ UI comp: <Button appName="sovoli.com">Hello there!</Button>
          </p>
          <p>RN reusables</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Expo</h2>
          <p>Move this to shared comp n show in expo</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Database</h2>
          <p>Db lib</p>
          <p>Session model</p>
          <p>Db Health Check</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">API</h2>
          <p>Expo does health check</p>
          <p>Handle version skew</p>
          <div>
            <h3 className="text-lg font-medium mb-1">Sessions</h3>
            <p>Non authenticated sessions</p>
            <p>Session Id: [sessionId]</p>
            <p>Web users: [web sessions count here]</p>
            <p>Mobile users: [mobile sessions count here]</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Image Upload / Storage</h2>
          <input type="file" className="block mb-2" />
          <p>Persistent storage link here</p>
          <div>
            <button className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
              Show button for a popup with image data here
            </button>
            <p>Explode image data</p>
            <button className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
              RAG
            </button>
            <p>
              Write to books (<a href="#">link to all books here</a>)
            </p>
            <p>
              Write to session books (
              <a href="#">link to current session books here</a>)
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Take Notes</h2>
          <input
            type="text"
            placeholder="Input for notes on book"
            className="block border border-gray-300 p-2 mb-2"
          />
          <input type="file" className="block mb-2" />
          <p>Scan notes (image upload, read highlight and jottings)</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Auth</h2>
          <p>WhatsApp TOTP</p>
          <p>Migrate session data</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Onboard</h2>
          <input
            type="text"
            placeholder="Accept Username"
            className="block border border-gray-300 p-2 mb-2"
          />
          <button className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
            View user profile
          </button>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Generative UX</h2>
          <p>Reflow the above workflow into generative UX flows</p>
          <p>Spike on generative UI for RN</p>
        </section>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://status.sovoli.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Status
        </a>
      </footer>
    </div>
  );
}
