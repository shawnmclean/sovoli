import { cache } from "react";
import { auth, signIn } from "@sovoli/auth";

import { api } from "~/api/tsr";

const getUserProfile = cache(async () => {
  const response = await api.user.me({
    fetchOptions: {
      cache: "no-store",
    },
  });

  return response;
});

export default async function SettingsPage() {
  const response = await getUserProfile();

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>Settings</h1>
      <p>Name from API:{response.body.name}</p>
      <SignIn />
    </div>
  );
}

async function SignIn() {
  const session = await auth();

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn();
        }}
      >
        <button type="submit">Sign in</button>
      </form>
    );
  }

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
