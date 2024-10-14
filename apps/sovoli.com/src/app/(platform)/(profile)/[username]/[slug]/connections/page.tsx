import { BookScanner } from "./_components/BookScanner";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

export default function ConnectionsEditPage({
  params: { username, slug },
}: Props) {
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>
        Scan Book By ISBN - {username}/{slug}
      </h1>
      <BookScanner />
    </div>
  );
}
