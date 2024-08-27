import { HomeScreen } from "@sovoli/ui/screens/home";

import { auth, signIn } from "~/auth";

export default function Home() {
  return (
    <div className="container mx-auto">
      <main className="flex-1">
        <HomeScreen />
        <SignIn />
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <iframe
          src="https://status.sovoli.com/badge?theme=dark"
          width="250"
          height="30"
        ></iframe>
      </footer>
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
      Logged in as {session.user.name} - {session.user.email} -{" "}
      {session.user.username} - {session.user.id}
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
