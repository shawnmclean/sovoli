"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
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

  const stickyStyleForColumnKey = (columnKey: string) => {
    if (columnKey === "test") {
      return {
        className:
          [
            "sticky left-0 z-20 bg-content1 border-b border-foreground-100",
            // Right-side shadow/gradient to indicate the column is stickied.
            "relative",
            // Keep the gradient *inside* the cell so it doesn't add scroll width.
            "after:content-[''] after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-full after:w-4",
            "after:bg-gradient-to-r after:from-foreground-200/60 after:to-transparent",
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
        style: { width: dateColWidth, minWidth: dateColWidth, maxWidth: dateColWidth },
      } as const;
    }

    return {
      className: "border-b border-foreground-100",
      style: undefined,
    } as const;
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-4 px-4 py-6">
      <Card className="bg-content1">
        <CardHeader className="flex flex-col items-start gap-3">
          <div className="space-y-1">
            <div className="text-base font-semibold text-foreground">Labs</div>
            <div className="text-sm text-foreground-500">
              {tests.length} tests • {dateColumns.length} result dates
            </div>
          </div>

          <div className="w-full space-y-2">
            <Input
              aria-label="Search tests"
              placeholder="Search tests..."
              value={search}
              onValueChange={setSearch}
              size="md"
            />
          </div>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <Table
              isHeaderSticky
              removeWrapper
              layout="fixed"
              classNames={{
                table: "min-w-max w-full text-sm",
                th: "px-3 py-2 text-left font-semibold text-foreground border-b border-foreground-200 bg-content1 whitespace-normal break-words",
                td: "px-3 py-2 align-top text-foreground whitespace-normal break-words",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => {
                  const sticky = stickyStyleForColumnKey(column.key);
                  return (
                    <TableColumn
                      key={column.key}
                      className={sticky.className}
                      style={sticky.style}
                    >
                      {column.label}
                    </TableColumn>
                  );
                }}
              </TableHeader>

              <TableBody
                items={displayItems}
                emptyContent="No matching tests."
              >
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
                      const sticky = stickyStyleForColumnKey(key);

                      if (item.kind === "header") {
                        const headerCellClassName = [
                          sticky.className,
                          "bg-content2",
                          "border-b border-foreground-200",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        if (key === "test") {
                          return (
                            <TableCell
                              className={headerCellClassName}
                              style={sticky.style}
                            >
                              <div className="font-semibold text-foreground-500">
                                {item.category}
                              </div>
                            </TableCell>
                          );
                        }

                        // Important: still render one cell per column (no colSpan).
                        return (
                          <TableCell className={headerCellClassName} style={sticky.style}>
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
                          <TableCell
                            className={sticky.className}
                            style={sticky.style}
                          >
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
                          <TableCell
                            className={sticky.className}
                            style={sticky.style}
                          >
                            <span
                              className={[
                                outOfRange ? "font-semibold" : "",
                                outOfRange
                                  ? "text-red-600 dark:text-red-400"
                                  : "",
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
                        <TableCell className={sticky.className} style={sticky.style}>
                          —
                        </TableCell>
                      );
                    }}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

