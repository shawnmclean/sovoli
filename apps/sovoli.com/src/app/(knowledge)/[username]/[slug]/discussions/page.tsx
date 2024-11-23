interface DiscussionsPageProps {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

export default function DiscussionsPage(_props: DiscussionsPageProps) {
  return (
    <div className="min-h-screen dark:bg-black">
      <h1>Discussions</h1>
    </div>
  );
}
