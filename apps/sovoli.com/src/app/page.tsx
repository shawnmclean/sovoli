/** @jsxImportSource react */

import { WebText } from "@sovoli/ui/components/text-web";
import { ButtonComponent } from "./_components/button";
// import { RNTextServer } from "./_components/rn-text-server";
import { RNTextClient } from "./_components/rn-text-client";
import { RNTextClientTW } from "./_components/rn-text-tw";
import { WebTextTW } from "./_components/web-text-tw";

export default function Home() {
  return (
    <div className="container mx-auto">
      <main className="flex-1">
        <div className="mx-auto">
          <h1 className="text-2xl font-bold mb-4">
            👀 Spiking on Private Software, pls leave, kthxbai
          </h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Infra</h2>
            <ul>
              <li>✅ DNS</li>
              <li>
                ✅ Status:{" "}
                <a href="https://status.sovoli.com" target="_blank">
                  status.sovoli.com
                </a>
              </li>
              <li>✅ Analytics</li>
              <li>✅ Perf Monitor</li>
              <li>🕛 Logging</li>
              <li>🕛 Metrics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Shared UI Lib</h2>
            <ul>
              <li>
                ✅ Shared interactive RN UI: 🚩 (layout shift)
                <ButtonComponent />
              </li>
              <li>
                ✅ Next styled Web Component: <WebTextTW />
              </li>
              <li>
                ✅ Shared styled Web Component: <WebText />
              </li>
              <li>
                🚩 Shared styled client Text RN Component: (delayed styles){" "}
                <RNTextClient />
              </li>
              <li>
                🚩 Shared styled server Text RN Component: throws error
                {/* <RNTextServer /> */}
              </li>
              <li>
                🚩 Shared TW RN Component: (no style loaded, class is changed){" "}
                <RNTextClientTW />
              </li>

              <li>RN Reusables: </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Expo</h2>
            <ul>
              <li>Move this to shared comp n show in expo + next</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Database</h2>
            <ul>
              <li>Db lib</li>
              <li>Session model</li>
              <li>Db Health Check</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">API</h2>
            <ul>
              <li>Expo does health check</li>
              <li>Handle version skew</li>
            </ul>
            <div>
              <h3 className="text-lg font-medium mb-1">Sessions</h3>
              <ul>
                <li>Non authenticated sessions</li>
                <li>Session Id: [sessionId]</li>
                <li>Web users: [web sessions count here]</li>
                <li>Mobile users: [mobile sessions count here]</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Image Upload / Storage
            </h2>
            <input type="file" className="block mb-2" />
            <ul>
              <li>Persistent storage link here</li>
              <li>
                <button className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
                  Show button for a popup with image data here
                </button>
              </li>
              <li>Explode image data</li>
              <li>
                <button className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
                  RAG
                </button>
              </li>
              <li>
                Write to books (<a href="#">link to all books here</a>)
              </li>
              <li>
                Write to session books (
                <a href="#">link to current session books here</a>)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Take Notes</h2>
            <input
              type="text"
              placeholder="Input for notes on book"
              className="block border border-gray-300 p-2 mb-2"
            />
            <input type="file" className="block mb-2" />
            <ul>
              <li>Scan notes (image upload, read highlight and jottings)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Auth</h2>
            <ul>
              <li>WhatsApp TOTP</li>
              <li>Migrate session data</li>
            </ul>
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
            <ul>
              <li>Reflow the above workflow into generative UX flows</li>
              <li>Spike on generative UI for RN</li>
            </ul>
          </section>
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <iframe
          src="https://status.sovoli.com/badge?theme=dark"
          width="250"
          height="30"
        ></iframe>
      </footer>
    </div>
  );
}
