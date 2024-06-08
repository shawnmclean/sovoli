import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
	  { title: "Sovoli: Your Ultimate Book Organizer" },
	  {
		property: "og:title",
		content: "Sovoli: Your Ultimate Book Organizer",
	  },
	  {
		name: "description",
		content: "Track your reading progress, write notes, and share your library with Sovoli. Start organizing your books today!",
	  }
	]
}

export default function Index() {
	return (
		<main className="font-poppins grid h-full place-items-center">
			<div className="flex max-w-md flex-col items-center text-center xl:order-2 xl:items-start xl:text-left">
				<h1
					data-heading
					className="mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-5xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]"
				>
					Sovolis
				</h1>
			</div>
		</main>
	)
}
