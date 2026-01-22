import type {
  Department,
  Position,
  WorkforceMember,
  WorkforceModule,
} from "~/modules/workforce/types";

// Define departments and positions for Creative Thinking Stationery Hub
const MANAGER: Position = {
  name: "Manager",
  slug: "manager",
  description: "Store manager and owner",
  image: "/stationary/guyana/creativethinking/team/manager.webp",
  url: "/stationary/guyana/creativethinking/team",
};

const SALES_DEPARTMENT: Department = {
  name: "Sales & Customer Service",
  slug: "sales-customer-service",
  description:
    "Our friendly sales team is here to help you find exactly what you need.",
  image: "/stationary/guyana/creativethinking/team/sales.webp",
  url: "/stationary/guyana/creativethinking/team",
};

export const STORE_MANAGER: WorkforceMember = {
  id: "001",
  name: "Store Manager",
  slug: "store-manager",
  bio: "Dedicated to providing quality stationery and office supplies to the community. Committed to excellent customer service and helping customers find exactly what they need for their educational and office requirements.",
  quote:
    "Your success is our priority - we're here to provide the tools you need to excel.",
  isPublic: true,
  contacts: [
    {
      type: "phone",
      value: "+5926461013",
      isPublic: true,
    },
    {
      type: "email",
      value: "info@ctshgy.sovoli.com",
      isPublic: true,
    },
  ],
  roleAssignments: [
    {
      position: MANAGER,
      department: SALES_DEPARTMENT,
      isPrimary: true,
    },
  ],
};

export const CREATIVE_THINKING_STATIONERY_HUB_WORKFORCE: WorkforceModule = {
  departments: [SALES_DEPARTMENT],
  positions: [MANAGER],
  teams: [],
  members: [STORE_MANAGER],
};
