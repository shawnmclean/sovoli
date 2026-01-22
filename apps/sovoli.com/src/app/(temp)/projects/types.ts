import type { Item } from "~/modules/core/items/types";
import type { Media } from "~/modules/core/media/types";
import type { NeedPriority, NeedStatus, NeedType } from "~/modules/needs/types";
import type {
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
} from "~/modules/projects/types";

export interface ProjectNeedSummary {
  slug: string;
  title: string;
  quantity?: number;
  type: NeedType;
  status?: NeedStatus;
  priority?: NeedPriority;
  item?: Item; // Only present for material needs
}

export interface ProjectDirectoryEntry {
  /** Unique identifier for directory listing (org + project/group) */
  id: string;
  projectId: string;
  title: string;
  description?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  tags?: string[];
  internal?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;

  /** Group information - if present, this entry represents a group */
  groupId?: string;
  groupSlug?: string;

  orgUsername: string;
  orgName: string;
  orgLogo?: string;
  orgCategories: string[];

  locationKey?: string;
  locationLabel?: string;
  locationAddress?: string;
  locationAddressLine1?: string;
  locationCity?: string;
  locationState?: string;
  locationCountryCode?: string;
  coordinates?: { lat: number; lng: number };
  placeId?: string;

  media: Media[];
  coverMedia?: Media | null;

  needs: ProjectNeedSummary[];
}
