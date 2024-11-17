import type { SelectImport } from "@sovoli/db/schema";
import { auth } from "@sovoli/auth";
import { db, eq, schema } from "@sovoli/db";

import { importDataErrorSchema } from "~/app/(dashboard)/new/import/lib/schemas";

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
            <th>Errors?</th>
          </tr>
        </thead>
        <tbody>
          {importResults.map((importResult) => (
            <tr key={importResult.id}>
              <td>{importResult.status}</td>
              <td>{importResult.createdAt.toISOString()}</td>
              <td>
                <ImportError import={importResult} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImportError(props: { import: SelectImport }) {
  const { import: importResult } = props;
  if (!importResult.errorData) {
    return null;
  }

  const importDataError = importDataErrorSchema.parse(importResult.errorData);

  return (
    <div className="text-red-500">
      {importDataError.errors.map((error) => (
        <div key={error.book}>
          {error.book}: {error.message}
        </div>
      ))}
    </div>
  );
}
