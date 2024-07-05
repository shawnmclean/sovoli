/** @jsxImportSource react */

import { UserScreen } from "@sovoli/ui/screens/user";

export default function Profile({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>Profile: {params.username}</h1>
      <UserScreen username={params.username} />
    </div>
  );
}
