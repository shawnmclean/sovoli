import type { SelectImport } from "@sovoli/db/schema";
import { db, eq, schema } from "@sovoli/db";

import { auth } from "~/core/auth";
import { importDataErrorSchema } from "~/trigger/importTrigger";

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
      <h1 className="mb-4 text-2xl font-semibold text-white">Import History</h1>

      <table className="min-w-full overflow-hidden rounded-lg bg-white text-sm text-gray-700 shadow-lg dark:bg-black dark:text-white">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Created At</th>
            <th className="px-6 py-3 text-left">Errors?</th>
          </tr>
        </thead>
        <tbody>
          {importResults.map((importResult) => (
            <tr
              key={importResult.id}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-6 py-3">{importResult.status}</td>
              <td className="px-6 py-3">
                {importResult.createdAt.toISOString()}
              </td>
              <td className="px-6 py-3">
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
    return <span className="text-green-500">No Errors</span>;
  }

  const importDataError = importDataErrorSchema.parse(importResult.errorData);

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-red-500">Import Errors:</h4>
      {importDataError.errors.length === 0 ? (
        <div className="text-yellow-500">No errors found in the data.</div>
      ) : (
        <div className="space-y-2">
          {importDataError.errors.map((error) => (
            <div
              key={error.book}
              className="flex items-center space-x-2 rounded-lg border-l-4 border-red-500 bg-red-50 p-2"
            >
              <span className="font-semibold text-red-500">{error.book}:</span>
              <span className="text-gray-700">{error.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
