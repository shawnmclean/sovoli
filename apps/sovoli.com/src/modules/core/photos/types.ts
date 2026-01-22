import type { Media } from "../media/types";

/**
 * Photo type - backward compatible alias for Media with type "image"
 * @deprecated Consider using Media directly. Photo is maintained for backward compatibility.
 */
export type Photo = Media & { type: "image" };
