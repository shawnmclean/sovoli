/** @jsxImportSource react */

export default function Shelf({
  params,
}: {
  params: { username: string; slug: string };
}) {
  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>
        Shelf: {params.username} - {params.slug}
      </h1>
    </div>
  );
}
