import type { Attributes } from "@opentelemetry/api";
import { flatten } from "flat";

/**
 * Flattens an object into a set of key-value pairs.
 * @param obj
 * @returns
 *
 * @link https://opentelemetry.io/docs/specs/semconv/general/attribute-naming/
 */
export function flattenAttributes(
  obj: Record<string, unknown> | unknown[] | null | undefined,
): Attributes {
  return flatten(obj);
}
