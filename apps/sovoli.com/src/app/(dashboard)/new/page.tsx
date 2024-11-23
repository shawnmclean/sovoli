import { auth } from "@sovoli/auth";

export default function NewPage() {
  async function create() {
    "use server";
    const session = await auth();
    if (!session) {
      throw new Error("Not authenticated");
    }
  }

  return (
    <div className="min-h-screen dark:bg-black">
      <form action={create} method="post">
        <input type="text" name="title" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
