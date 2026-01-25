"use client";

import { Input } from "@sovoli/ui/components/input";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@sovoli/ui/components/table";

import { isOutOfRange } from "./labs-utils";
import { LAB_CATEGORY_ORDER, getLabCategory } from "./lab-categories";
import type { LabCategory } from "./lab-categories";

export interface LabsDateColumn {
  raw: string;
  label: string;
}

export interface LabsRow {
  testName: string;
  units: string;
  referenceRange: string;
  resultsByDate: Record<string, string>;
}

interface Props {
  tests: LabsRow[];
  dateColumns: LabsDateColumn[];
}

interface ColumnDef {
  key: string;
  label: string;
}

type DisplayItem =
  | { kind: "header"; category: LabCategory }
  | { kind: "test"; row: LabsRow };

export function LabsTableClient({ tests, dateColumns }: Props) {
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Default to a more compact view on small screens.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => {
      setIsMobile(mq.matches);
    };
    apply();
    // no cleanup needed beyond removing listener
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const stickyTestWidth = useMemo(() => {
    // Test column includes Units/Ref range, so give it more space.
    if (isMobile) return 140;
    return 170;
  }, [isMobile]);

  const dateColWidth = 96;

  const filteredTests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter((t) => t.testName.toLowerCase().includes(q));
  }, [search, tests]);

  const displayItems = useMemo<DisplayItem[]>(() => {
    // Stable grouping: preserve CSV order within each category by iterating once.
    const buckets: Record<LabCategory, LabsRow[]> = {
      Urine: [],
      Liver: [],
      Metabolic: [],
      Lipids: [],
      "Glucose/A1c": [],
      Thyroid: [],
      CBC: [],
      Other: [],
    };

    for (const row of filteredTests) {
      const category = getLabCategory(row.testName);
      buckets[category].push(row);
    }

    const items: DisplayItem[] = [];
    for (const category of LAB_CATEGORY_ORDER) {
      const rows = buckets[category];
      if (rows.length === 0) continue;
      items.push({ kind: "header", category });
      for (const row of rows) {
        items.push({ kind: "test", row });
      }
    }

    return items;
  }, [filteredTests]);

  const columns = useMemo<ColumnDef[]>(() => {
    const cols: ColumnDef[] = [{ key: "test", label: "Test" }];

    for (const d of dateColumns) {
      cols.push({ key: `date:${d.raw}`, label: d.label });
    }

    return cols;
  }, [dateColumns]);

  const cellStyleForColumnKey = (
    columnKey: string,
    options?: { isHeader?: boolean },
  ) => {
    // Avoid per-cell `position: sticky` / z-index hacks that can interfere with HeroUI's
    // sticky header behavior. Keep this strictly to safe width + basic borders.
    if (columnKey === "test") {
      return {
        className: [
          "sticky left-0 bg-content1 border-b border-foreground-100 border-r border-foreground-200",
          // Ensure sticky header stays above sticky column cells while scrolling.
          options?.isHeader ? "z-50" : "z-10",
        ].join(" "),
        style: {
          width: stickyTestWidth,
          minWidth: stickyTestWidth,
          maxWidth: stickyTestWidth,
        },
      } as const;
    }

    if (columnKey.startsWith("date:")) {
      return {
        className: "border-b border-foreground-100",
        style: {
          width: dateColWidth,
          minWidth: dateColWidth,
          maxWidth: dateColWidth,
        },
      } as const;
    }

    return {
      className: "border-b border-foreground-100",
      style: undefined,
    } as const;
  };

  return (
    <div className="h-[100svh] overflow-hidden bg-content1 flex flex-col">
      <div className="sticky top-0 z-40 border-b border-foreground-200 bg-content1">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
          <Input
            aria-label="Search tests"
            placeholder="Search tests..."
            value={search}
            onValueChange={setSearch}
            size="md"
          />
        </div>
      </div>

      <div className="w-full flex-1 min-h-0 sm:pb-6">
        <Table
          isHeaderSticky
          aria-label="Labs table"
          layout="fixed"
          classNames={{
            // Fill remaining viewport height (parent is `flex-1 min-h-0`),
            // while keeping the table internally scrollable.
            base: "h-full overflow-auto bg-content1",
            // Remove internal padding/gutters so nothing can "peek" behind sticky header/column.
            wrapper: "p-0",
            // Ensure no spacing gaps where scrolled content can "peek through"
            // behind sticky header/column.
            table: "min-h-full bg-content1 border-separate border-spacing-0",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => {
              const col = cellStyleForColumnKey(column.key, { isHeader: true });

              return (
                <TableColumn
                  key={column.key}
                  className={["bg-content1", col.className].join(" ")}
                  style={col.style}
                >
                  {column.label}
                </TableColumn>
              );
            }}
          </TableHeader>

          <TableBody items={displayItems} emptyContent="No matching tests.">
            {(item) => (
              <TableRow
                key={
                  item.kind === "header"
                    ? `header:${item.category}`
                    : `test:${item.row.testName}::${item.row.units}::${item.row.referenceRange}`
                }
              >
                {(columnKey) => {
                  const key = String(columnKey);
                  const cell = cellStyleForColumnKey(key);

                  if (item.kind === "header") {
                    const headerCellClassName = [
                      cell.className,
                      "bg-content2",
                      "border-b border-foreground-200",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    if (key === "test") {
                      return (
                        <TableCell
                          className={headerCellClassName}
                          style={cell.style}
                        >
                          <div className="font-semibold text-foreground-500">
                            {item.category}
                          </div>
                        </TableCell>
                      );
                    }

                    // Important: still render one cell per column (no colSpan).
                    return (
                      <TableCell
                        className={headerCellClassName}
                        style={cell.style}
                      >
                        {""}
                      </TableCell>
                    );
                  }

                  const row = item.row;

                  if (key === "test") {
                    const units = row.units.trim();
                    const ref = row.referenceRange.trim();
                    const hasMeta = Boolean(ref) || Boolean(units);

                    return (
                      <TableCell className={cell.className} style={cell.style}>
                        <div className="space-y-0.5">
                          <div
                            className="font-medium whitespace-normal break-words leading-snug"
                            title={row.testName}
                          >
                            {row.testName || "—"}
                          </div>
                          {hasMeta ? (
                            <div className="text-xs text-foreground-500 leading-snug">
                              {ref ? (
                                <span className="font-semibold">{ref}</span>
                              ) : null}
                              {ref && units ? " " : null}
                              {units ? <span>{units}</span> : null}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                    );
                  }

                  if (key.startsWith("date:")) {
                    const rawDate = key.slice("date:".length);
                    const rawValue = row.resultsByDate[rawDate] ?? "";
                    const value = rawValue.trim();
                    const isEmpty = value.length === 0;
                    const outOfRange =
                      !isEmpty && isOutOfRange(row.referenceRange, value);

                    return (
                      <TableCell className={cell.className} style={cell.style}>
                        <span
                          className={[
                            outOfRange ? "font-semibold" : "",
                            outOfRange ? "text-red-600 dark:text-red-400" : "",
                            isEmpty ? "text-foreground-500" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {isEmpty ? "—" : value}
                        </span>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell className={cell.className} style={cell.style}>
                      —
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
