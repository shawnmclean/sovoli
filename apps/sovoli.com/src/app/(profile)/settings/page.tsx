import { auth, signIn } from "@sovoli/auth";

export default async function SettingsPage() {
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>Settings</h1>
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
