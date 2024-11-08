import { BatchCreateKnowledge } from "@sovoli/api/services/knowledge/batchCreateKnowledge";
import { auth } from "@sovoli/auth";
import { db } from "@sovoli/db";

export default function NewPage() {
  async function create() {
    "use server";
    const session = await auth();
    if (!session) {
      throw new Error("Not authenticated");
    }
    const batchCreateKnowledge = new BatchCreateKnowledge(db);
    const created = await batchCreateKnowledge.call({
      authUserId: session.userId,
      knowledges: [
        {
          title: "test",
          description: "test",
          content: "test",
          type: "collection",
          query: "test",
          queryType: "query",
          isOrigin: true,
        },
        {
          title: "test-2",
          description: "test",
          content: "test",
          type: "collection",
          query: "test",
          queryType: "query",
          isOrigin: true,
        },
      ],
    });
    console.log(created);
  }
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <form action={create} method="post">
        <input type="text" name="title" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
