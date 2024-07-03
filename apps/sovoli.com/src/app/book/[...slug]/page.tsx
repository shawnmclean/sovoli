/** @jsxImportSource react */

import Component from "./Component";

export default function BookDetails({
  params,
}: {
  params: { username: string; slug: string[] };
}) {
  // this catch all route should check for an isbn in the first or second slug.
  // the goal of this structure is to have a title slug first and then an isbn slug second.

  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>Book details: {params.username}</h1>
      {params.slug.map((slug) => (
        <p>{slug}</p>
      ))}
      <Component />
    </div>
  );
}
