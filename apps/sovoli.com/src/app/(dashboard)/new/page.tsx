import { BatchCreateKnowledge } from "@sovoli/api/services/knowledge/batchCreateKnowledge";
import { db } from "@sovoli/db";

export default function NewPage() {
  async function create() {
    "use server";
    const batchCreateKnowledge = new BatchCreateKnowledge(db);
    await batchCreateKnowledge.call({
      authUserId: "192914a3-fa51-4df7-ab6e-7a1d622c49dd",
      title: "asdf",
    });
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
