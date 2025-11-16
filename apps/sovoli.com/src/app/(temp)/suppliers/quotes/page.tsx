import { hydrateCategory } from "~/modules/data/items/categories";
import type { Item, ItemCategory } from "~/modules/core/items/types";
import type { ItemTagSet } from "~/modules/core/items/types";
import { TAGSET_LIST } from "~/modules/data/items/tagsets";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Button } from "@sovoli/ui/components/button";

interface SearchParams {
  tagset?: string | string[];
}

function getTopLevelCategory(category: ItemCategory): ItemCategory {
  let current: ItemCategory = category;
  while (current.parent) {
    current = current.parent;
  }
  return current;
}

function groupItemsByTopLevelCategory(
  items: readonly Item[],
): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const top = getTopLevelCategory(item.category);
    const list = groups.get(top.id) ?? [];
    list.push(item);
    groups.set(top.id, list);
  }
  return groups;
}

function Section({ title, items }: { title: string; items: readonly Item[] }) {
  const grouped = groupItemsByTopLevelCategory(items);
  const orderedGroups = Array.from(grouped.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return (
    <Card className="shadow-none border border-gray-200">
      <CardHeader className="py-3">
        <h3 className="text-base font-semibold">{title}</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y">
          {orderedGroups.map(([groupId, groupItems], idx) => {
            const groupLabel = hydrateCategory(groupId).name;
            const sorted = [...groupItems].sort((a, b) =>
              a.name.localeCompare(b.name),
            );
            return (
              <div key={groupId}>
                {idx !== 0 ? null : null}
                <div className="px-4 py-2 bg-gray-50">
                  <p className="text-xs font-medium text-gray-600">
                    {groupLabel}
                  </p>
                </div>
                <ul className="px-2 py-1">
                  {sorted.map((item) => (
                    <li key={item.id} className="flex items-center">
                      <Checkbox
                        value={item.id}
                        className="w-full py-2 px-2 rounded-md data-[selected=true]:bg-gray-50"
                      >
                        <span className="text-sm">{item.name}</span>
                        {item.unitLabel ? (
                          <span className="ml-2 text-xs text-gray-500">
                            ({item.unitLabel})
                          </span>
                        ) : null}
                      </Checkbox>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tagset } = await searchParams;

  // Normalize selected tagset ids
  const selectedIds: string[] = Array.isArray(tagset)
    ? tagset
    : tagset
      ? [tagset]
      : [];

  const selectedTagsets: ItemTagSet[] = TAGSET_LIST.filter((t) =>
    selectedIds.includes(t.id),
  );

  // Union items across selected tagsets
  const items: readonly Item[] = (() => {
    const map = new Map<string, Item>();
    for (const ts of selectedTagsets) {
      for (const it of ts.items) {
        map.set(it.id, it);
      }
    }
    return Array.from(map.values());
  })();

  const pageLabel = `Supplier Quotes`;

  return (
    <div className="max-w-screen-sm mx-auto pb-40">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold">{pageLabel}</h1>
          <p className="text-xs text-gray-600">
            Check the items you can supply and include delivery quotes.
          </p>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        <Card className="shadow-none border border-gray-200">
          <CardHeader className="py-2">
            <h3 className="text-sm font-semibold">Filters</h3>
          </CardHeader>
          <CardBody className="p-0">
            <form method="get" className="px-2 py-2">
              <ul className="space-y-0.5">
                {TAGSET_LIST.map((t) => {
                  const checked = selectedIds.includes(t.id);
                  return (
                    <li key={t.id}>
                      <label className="flex items-center gap-2 py-1 px-1.5 rounded-md hover:bg-gray-50">
                        <input
                          type="checkbox"
                          name="tagset"
                          value={t.id}
                          defaultChecked={checked}
                          className="h-3.5 w-3.5"
                        />
                        <span className="text-xs">{t.name}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center mt-2">
                <Button
                  type="submit"
                  color="primary"
                  size="sm"
                  className="ml-auto"
                >
                  Apply Filters
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {items.length === 0 ? (
          <Card className="shadow-none border border-gray-200">
            <CardBody>
              <p className="text-sm text-gray-700">
                Select at least one tagset to view items.
              </p>
            </CardBody>
          </Card>
        ) : (
          <Section title="Items" items={items} />
        )}

        <Card className="shadow-none border border-gray-200">
          <CardHeader className="py-3">
            <h3 className="text-base font-semibold">Delivery</h3>
            <p className="text-xs text-gray-600">
              Please indicate which locations you can deliver to.
            </p>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="px-2 py-2">
              <li className="flex items-center py-1.5">
                <Checkbox
                  value="delivery-montego-bay"
                  className="w-full py-2 px-2 rounded-md data-[selected=true]:bg-gray-50"
                >
                  <span className="text-sm">Montego Bay</span>
                </Checkbox>
              </li>
              <li className="flex items-center py-1.5">
                <Checkbox
                  value="delivery-black-river"
                  className="w-full py-2 px-2 rounded-md data-[selected=true]:bg-gray-50"
                >
                  <span className="text-sm">Black River</span>
                </Checkbox>
              </li>
            </ul>
          </CardBody>
        </Card>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-2">
          <Button variant="flat" className="flex-1" size="sm">
            Download / Print
          </Button>
          <Button color="primary" className="flex-1" size="sm">
            Share
          </Button>
        </div>
      </footer>
    </div>
  );
}
