import type { EventModule } from "~/modules/events/types";
import { DIWALI_CELEBRATION_2025_EVENT } from "./diwali-celebration-2025";

const BACCHUS_LEARNING_EVENT_LIST = [DIWALI_CELEBRATION_2025_EVENT];

export const BACCHUS_LEARNING_EVENTS: EventModule = {
  events: BACCHUS_LEARNING_EVENT_LIST,
  featuredEvents: [DIWALI_CELEBRATION_2025_EVENT],
};

export const BACCHUS_LEARNING_EVENT_COUNT = BACCHUS_LEARNING_EVENT_LIST.length;
