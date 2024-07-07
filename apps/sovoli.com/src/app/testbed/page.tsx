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
      <h1 className="text-2xl font-bold mb-4">NativeWind Testbed</h1>

      <p>RN Component:</p>
      <Component />

      <p>Web Component:</p>
      <div className="m-2 p-4 border-2">
        <p>Should have a border with padding</p>
      </div>
    </div>
  );
}
