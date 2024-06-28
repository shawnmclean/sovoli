"use client";

import { Button } from "../../components/button";
import { Text } from "../../components/text";

export function HomeScreen() {
  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        👀 Spiking on something, pls leave, kthxbai
      </h1>

      <span className="mb-8">
        Goal: Working on something to help me read and write better.
      </span>

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
        <h2 className="text-xl font-semibold mb-2">Design System</h2>
        <ul>
          <li>
            ✅ RN Reusables:
            <Button onPress={() => alert("Pressed")}>
              <Text>Button</Text>
            </Button>
          </li>

          <li>
            🚩 SSR RN TW: (Wait on NativeWind fixup) {/* <RNTextServer /> */}
          </li>
          <li>🕛 Share screen in Expo and Next</li>
          <li>✅ Share TW Config</li>
          <li>🕛 Dark Mode Toggle</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Expo</h2>
        <ul>
          <li>Build / Publish</li>
          <li>Show QR Code here</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Mocks</h2>
        <ul>
          <li>My Book Details</li>
          <li>My Books Listing</li>
          <li>Book Details</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Database</h2>
        <ul>
          <li>Db lib</li>
          <li>Db Health Check</li>
          <li>Book model</li>
          <li>Seed Book table</li>
          <li>Book Details backed by Book data</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">API</h2>
        <ul>
          <li>Expo get book details</li>
          <li>Expo does health check</li>
          <li>Handle version skew</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Auth</h2>
        <ul>
          <li>Db: Session model</li>
          <li>Non authenticated sessions</li>
          <li>Session Id: [sessionId]</li>
          <li>Web users: [web sessions count here]</li>
          <li>Mobile users: [mobile sessions count here]</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">My Books</h2>
        <ul>
          <li>Db: Account, MyBook models. Connect Session to MyBooks</li>
          <li>Seed Account and MyBook tables</li>
          <li>Back MyBooks listing and details with by database</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Image Upload / Storage</h2>
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
  );
}
