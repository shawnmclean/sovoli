export default function Furniture({
  params,
}: {
  params: { username: string; slug: string };
}) {
  return (
    <div className="">
      <h1>
        Furniture: {params.username} - {params.slug}
      </h1>
    </div>
  );
}
