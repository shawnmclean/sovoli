import type { Media } from "../core/media/types";
import type { Contact } from "../core/types";

// #region Event Types

export interface Event {
  id: string;
  slug: string;
  name: string;
  description?: string;
  tagline?: string;

  // Event Details
  startDate: string; // ISO date format: "2025-10-17"
  endDate?: string; // ISO date format: "2025-10-17"
  startTime?: string; // 24-hour format: "09:00" or "21:30"
  endTime?: string; // 24-hour format: "15:00" or "23:30"
  location?: string;

  // Event Content
  highlights?: EventHighlight[];
  activities?: EventActivity[];
  requirements?: EventRequirement[];

  // Media
  media?: Media[];

  // Event Status
  status?: "upcoming" | "current" | "completed" | "cancelled";
  isPopular?: boolean;

  // Event Categories
  category?: EventCategory;
  tags?: string[];

  // Contact Information
  contactInfo?: Contact[];

  // Additional Information
  notes?: string;
}

export interface EventHighlight {
  icon: EventHighlightIcon;
  label: string;
  description: string;
}

export type EventHighlightIcon =
  | "calendar" // Date/Time
  | "map-pin" // Location
  | "users" // Group Activities
  | "star" // Special Features
  | "gift" // Gifts/Prizes
  | "palette" // Arts & Crafts
  | "music" // Music/Dance
  | "camera" // Photography
  | "heart" // Community
  | "trophy" // Awards
  | "book-open" // Learning
  | "smile" // Fun Activities
  | "clock" // Duration
  | "shield-check" // Safety
  | "home" // Indoor/Outdoor
  | "sun" // Weather
  | "moon" // Evening Events
  | "bell" // Notifications
  | "message-circle"; // Communication

export interface EventActivity {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  materials?: string[];
  instructions?: string[];
}

export interface EventRequirement {
  id: string;
  name: string;
  description?: string;
  type: "bring" | "wear" | "prepare" | "other";
  isRequired: boolean;
  quantity?: string;
  notes?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

// #endregion

// #region Event Module

export interface EventModule {
  events: Event[];
  featuredEvents?: Event[];
}

// #endregion
