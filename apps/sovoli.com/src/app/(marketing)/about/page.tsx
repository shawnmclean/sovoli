import { auth, signIn, signOut } from "@sovoli/auth";

export default function About() {
  return (
    <div className="container mx-auto">
      <main className="flex-1">
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
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
