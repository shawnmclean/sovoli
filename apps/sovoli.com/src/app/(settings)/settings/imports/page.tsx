import { auth } from "@sovoli/auth";
import { db, eq, schema } from "@sovoli/db";

export default async function SettingsImportPage() {
  const session = await auth();
  if (!session) throw new Error("You must be logged in to access this page");

  const importResults = await db.query.Import.findMany({
    where: eq(schema.Import.userId, session.userId),
    orderBy: (_table, { desc }) => [desc(schema.Import.createdAt)],
    limit: 10,
  });

  return (
    <div className="min-h-screen dark:bg-black">
      <h1>Import</h1>

      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {importResults.map((importResult) => (
            <tr key={importResult.id}>
              <td>{importResult.status}</td>
              <td>{importResult.createdAt.toISOString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
