import type { EventModule } from "~/modules/events/types";

import { AMERINDIAN_HERITAGE_DAY_2025_EVENT } from "./amerindian-heritage-day-2025";
import { BREAST_CANCER_AWARENESS_2025_EVENT } from "./breast-cancer-awareness-2025";
import { CHRISTMAS_CONCERT_2025_EVENT } from "./christmas-concert-2025";
import { DIWALI_CELEBRATION_2025_EVENT } from "./diwali-celebration-2025";
import { END_OF_TERM_TESTS_2025_EVENT } from "./end-of-term-tests-2025";
import { HALLOWEEN_PARTY_2025_EVENT } from "./halloween-party-2025";
import { ONE_ON_ONE_SESSION_2025_EVENT } from "./one-on-one-session-2025";
import { SCHOOL_PARTY_CLOSING_2025_EVENT } from "./school-party-closing-2025";
import { SCHOOL_REOPENS_2026_EVENT } from "./school-reopens-2026";
import { SPORTS_DAY_2025_EVENT } from "./sports-day-2025";

const MODERN_ACADEMY_EVENT_LIST = [
  AMERINDIAN_HERITAGE_DAY_2025_EVENT,
  DIWALI_CELEBRATION_2025_EVENT,
  BREAST_CANCER_AWARENESS_2025_EVENT,
  HALLOWEEN_PARTY_2025_EVENT,
  SPORTS_DAY_2025_EVENT,
  END_OF_TERM_TESTS_2025_EVENT,
  CHRISTMAS_CONCERT_2025_EVENT,
  ONE_ON_ONE_SESSION_2025_EVENT,
  SCHOOL_PARTY_CLOSING_2025_EVENT,
  SCHOOL_REOPENS_2026_EVENT,
];

export const MODERN_ACADEMY_EVENTS: EventModule = {
  events: MODERN_ACADEMY_EVENT_LIST,
  upcomingEvents: [],
  featuredEvents: [],
};

export const MODERN_ACADEMY_EVENT_COUNT = MODERN_ACADEMY_EVENT_LIST.length;
