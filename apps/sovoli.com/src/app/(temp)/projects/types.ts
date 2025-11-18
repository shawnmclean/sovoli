import type { NeedPriority, NeedStatus, NeedType } from "~/modules/needs/types";
import type { Photo } from "~/modules/core/photos/types";
import type {
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
} from "~/modules/projects/types";
import type { Item } from "~/modules/core/items/types";

export interface ProjectNeedSummary {
  slug: string;
  title: string;
  quantity?: number;
  type: NeedType;
  status?: NeedStatus;
  priority?: NeedPriority;
  item: Item;
}

export interface ProjectDirectoryEntry {
  /** Unique identifier for directory listing (org + project) */
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

  orgUsername: string;
  orgName: string;
  orgLogo?: string;
  orgCategories: string[];

  locationKey?: string;
  locationLabel?: string;
  locationAddress?: string;
  locationCity?: string;
  locationState?: string;
  locationCountryCode?: string;
  coordinates?: { lat: number; lng: number };
  placeId?: string;

  photos: Photo[];
  coverPhoto?: Photo | null;

  needs: ProjectNeedSummary[];
}
