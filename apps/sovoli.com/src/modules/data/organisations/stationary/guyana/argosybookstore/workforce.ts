import type {
  WorkforceMember,
  WorkforceModule,
  Position,
  Department,
} from "~/modules/workforce/types";

// Define departments and positions for Argosy Book Store
const MANAGER: Position = {
  name: "Manager",
  slug: "manager",
  description: "Store manager and owner",
  image: "/stationary/guyana/argosybookstore/team/manager.webp",
  url: "/stationary/guyana/argosybookstore/team",
};

const SALES_DEPARTMENT: Department = {
  name: "Sales & Customer Service",
  slug: "sales-customer-service",
  description:
    "Our friendly sales team is here to help you find exactly what you need.",
  image: "/stationary/guyana/argosybookstore/team/sales.webp",
  url: "/stationary/guyana/argosybookstore/team",
};

export const STORE_MANAGER: WorkforceMember = {
  id: "001",
  name: "Ganesh Mohabir",
  slug: "ganesh-mohabir",
  bio: "Dedicated to providing quality books and stationery to the Georgetown community. Committed to excellent customer service and helping customers find exactly what they need for their educational and reading requirements.",
  quote:
    "Books are the gateway to knowledge - we're here to provide the tools you need to learn and grow.",
  isPublic: true,
  contacts: [
    {
      type: "phone",
      value: "+5926550922",
      isPublic: true,
    },
    {
      type: "email",
      value: "ganeshmohabir@hotmail.com",
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

export const ARGOSY_BOOK_STORE_WORKFORCE: WorkforceModule = {
  departments: [SALES_DEPARTMENT],
  positions: [MANAGER],
  teams: [],
  members: [STORE_MANAGER],
};
