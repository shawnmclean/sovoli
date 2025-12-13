import type {
  WorkforceMember,
  WorkforceModule,
  Position,
  Department,
} from "~/modules/workforce/types";
import type { Media } from "~/modules/core/media/types";

// Define departments and positions for Healing Emerald Wellness
const INSTRUCTOR: Position = {
  name: "Instructor",
  slug: "instructor",
  description: "Wellness and beauty therapy instructor",
  image:
    "/vocational-training/jamaica/healingemeraldwellness/team/instructor.webp",
  url: "/vocational-training/jamaica/healingemeraldwellness/team",
};

const SPA_MANAGING_DIRECTOR: Position = {
  name: "Spa Managing Director",
  slug: "spa-managing-director",
  description: "Spa Managing Director and lead instructor",
  image:
    "/vocational-training/jamaica/healingemeraldwellness/team/director.webp",
  url: "/vocational-training/jamaica/healingemeraldwellness/team",
};

const MANAGEMENT: Department = {
  name: "Management",
  slug: "management",
  description: "Executive leadership and business operations",
  image:
    "/vocational-training/jamaica/healingemeraldwellness/team/management.webp",
  url: "/vocational-training/jamaica/healingemeraldwellness/team",
};

const FACULTY: Department = {
  name: "Faculty",
  slug: "faculty",
  description: "Teaching staff and instructors",
  image:
    "/vocational-training/jamaica/healingemeraldwellness/team/faculty.webp",
  url: "/vocational-training/jamaica/healingemeraldwellness/team",
};

export const ALICIA_DAVIS: WorkforceMember = {
  id: "001",
  name: "Alicia Davis",
  slug: "alicia-davis",
  photo: {
    type: "image",
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1765637751/o/healingemeraldwellness/team/alicia.png",
    assetId: "18e695f0da005cf04cce95f85c92b9cd",
    publicId: "o/healingemeraldwellness/team/alicia",
    width: 992,
    height: 969,
    format: "png",
    bytes: 1091637,
    version: 1765637751,
  } satisfies Media,
  bio: "Alicia Davis is the founder and owner of Healing Emerald Wellness Spa & Training Centre Limited. With a passion for wellness and beauty therapy, she established the centre to provide high-quality spa services and vocational training in massage therapy, waxing, and other wellness disciplines.",
  quote: "Empowering others through wellness education and self-care.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: SPA_MANAGING_DIRECTOR,
      department: MANAGEMENT,
      isPrimary: true,
    },
    {
      position: INSTRUCTOR,
      department: FACULTY,
      isPrimary: false,
    },
  ],
  subjectAssignments: [
    {
      subject: "Massage Therapy",
      grades: ["Beginner", "Intermediate", "Advanced"],
    },
    {
      subject: "Waxing",
      grades: ["Beginner"],
    },
  ],
};

export const HEALING_EMERALD_WORKFORCE: WorkforceModule = {
  departments: [MANAGEMENT, FACULTY],
  positions: [SPA_MANAGING_DIRECTOR, INSTRUCTOR],
  teams: [],
  members: [ALICIA_DAVIS],
};
