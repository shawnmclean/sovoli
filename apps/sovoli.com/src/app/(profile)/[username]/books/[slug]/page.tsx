/** @jsxImportSource react */

import MyBookDetailsScreen from "@sovoli/ui/screens/mybooks/details";

export default function MyBookDetails({
  params,
}: {
  params: { username: string; slug: string };
}) {
  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>My book details: {params.username}</h1>
      <span>{params.slug}</span>
      <MyBookDetailsScreen />
    </div>
  );
}
