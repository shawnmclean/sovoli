import { auth, signIn } from "~/core/auth";

export default function SettingsPage() {
  return (
    <div className="min-h-screen dark:bg-black">
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
      <h1>Server Rendered</h1>
      <p>Name from Server: {session.user?.name}</p>

      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
