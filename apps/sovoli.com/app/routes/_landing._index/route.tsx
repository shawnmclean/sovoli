import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Sovoli: Your Ultimate Book Organizer' },
    {
      property: 'og:title',
      content: 'Sovoli: Your Ultimate Book Organizer',
    },
    {
      name: 'description',
      content:
        'Track your reading progress, write notes, and share your library with Sovoli. Start organizing your knowledge today!',
    },
  ]
}

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Private software, pls leave, Kthxbai</h1>

      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          UI
          <ul>
            <li>✅ TailwindCSS</li>
            <li>Shared Lib - react-native-reusables</li>
            <li>Move this component to shared lib</li>
          </ul>
        </li>
        <li>
          Database
          <ul>
            <li>Db lib</li>
            <li>Session model</li>
            <li>Db Health Check</li>
          </ul>
        </li>
        <li>
          API
          <ul>
            <li>Expo does health check</li>
            <li>Handle version skew</li>
          </ul>
        </li>
        <li>
          Sessions
          <ul>
            <li>Non authenticated sessions</li>
            <li>Session Id: [sessionId]</li>
            <li>Web users: [web sessions count here]</li>
            <li>Mobile users: [mobile sessions count here]</li>
          </ul>
        </li>
        <li>
          Image Upload / Storage
          <ul>
            <li>File Input here</li>
            <li>Persistent storage link here</li>
          </ul>
        </li>
        <li>
          AI Gateway (portkey + vercel AI SDK)
          <ul>
            <li>Failovers</li>
            <li>Retry/backoffs</li>
          </ul>
          <li>Show button for a popup with image data here.</li>
        </li>
        <li>
          Explode image data
          <ul>
            <li>RAG [button here to prompt against db]</li>
            <li>Write to books (link to all books here)</li>
            <li>Write to session books (link to current session books here)</li>
          </ul>
        </li>
        <li>
          Take Notes
          <ul>
            <li>Input for notes on book</li>
            <li>Scan notes (image upload, read highlight and jottings)</li>
          </ul>
        </li>
        <li>
          Auth
          <ul>
            <li>WhatsApp TOTP</li>
            <li>Migrate session data</li>
          </ul>
        </li>
        <li>
          Onboard
          <ul>
            <li>Accept Username</li>
            <li>View user profile</li>
          </ul>
        </li>
        <li>
          Generative UX
          <ul>
            <li>Reflow the above workflow into generative UX flows</li>
            <li>Spike on generative UI for RN</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
