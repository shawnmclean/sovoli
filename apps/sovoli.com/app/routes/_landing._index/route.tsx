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
            <li>Prisma</li>
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
            <li>Web: [show session ID here]</li>
            <li>Mobile (sync with database)</li>
            <li>
              [Increment session count here (show mobile count vs web count)]
            </li>
          </ul>
        </li>
        <li>Image Upload / Storage</li>
        <li>
          AI Gateway
          <ul>
            <li>Failovers</li>
            <li>Retry/backoffs</li>
          </ul>
        </li>
        <li>
          Explode image data
          <ul>
            <li>Write to books</li>
            <li>Write to session books</li>
            <li>Share session Id</li>
          </ul>
        </li>
        <li>
          Take Notes
          <ul>
            <li>Jot Notes</li>
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
            <li>View user library</li>
          </ul>
        </li>
        <li>Generative UX</li>
      </ul>
    </div>
  )
}
