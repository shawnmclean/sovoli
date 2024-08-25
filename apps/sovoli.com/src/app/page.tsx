import { RoadmapScreen } from "@sovoli/ui/screens/roadmap";

export default function Home() {
  return (
    <div className="container mx-auto">
      <main className="flex-1">
        <RoadmapScreen />
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
