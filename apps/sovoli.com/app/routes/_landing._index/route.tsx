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
        'Track your reading progress, write notes, and share your library with Sovoli. Start organizing your books today!',
    },
  ]
}

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Not ready yet, pls leave, Kthxbai</h1>

      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>TailwindCSS</li>
        <li>Prisma</li>
        <li>AI Gateway</li>
        <li>Generative UX - Upload photos of books</li>
        <li>Populate profile</li>
        <li>WhatsApp TOTP Auth</li>
      </ul>
    </div>
  )
}
