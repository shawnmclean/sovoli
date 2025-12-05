import type {
  WorkforceMember,
  WorkforceModule,
  Position,
  Department,
} from "~/modules/workforce/types";

// Define departments and positions for Healing Emerald Wellness
const INSTRUCTOR: Position = {
  name: "Instructor",
  slug: "instructor",
  description: "Wellness and beauty therapy instructor",
  image: "/vocational-training/jamaica/healingemeraldwellness/team/instructor.webp",
  url: "/vocational-training/jamaica/healingemeraldwellness/team",
};

const OWNER: Position = {
  name: "Owner",
  slug: "owner",
  description: "Business owner and lead instructor",
  image: "/vocational-training/jamaica/healingemeraldwellness/team/owner.webp",
  url: "/vocational-training/jamaica/healingemeraldwellness/team",
};

const MANAGEMENT: Department = {
  name: "Management",
  slug: "management",
  description: "Executive leadership and business operations",
  image: "/vocational-training/jamaica/healingemeraldwellness/team/management.webp",
  url: "/vocational-training/jamaica/healingemeraldwellness/team",
};

const FACULTY: Department = {
  name: "Faculty",
  slug: "faculty",
  description: "Teaching staff and instructors",
  image: "/vocational-training/jamaica/healingemeraldwellness/team/faculty.webp",
  url: "/vocational-training/jamaica/healingemeraldwellness/team",
};

export const ALISHA_DAVIS: WorkforceMember = {
  id: "001",
  name: "Alisha Davis",
  slug: "alisha-davis",
  image: "/images/orgs/vocational-training/jamaica/healingemeraldwellness/team/alisha.webp",
  bio: "Alisha Davis is the founder and owner of Healing Emerald Wellness Spa & Training Centre Limited. With a passion for wellness and beauty therapy, she established the centre to provide high-quality spa services and vocational training in massage therapy, waxing, and other wellness disciplines.",
  quote: "Empowering others through wellness education and self-care.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: OWNER,
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
  positions: [OWNER, INSTRUCTOR],
  teams: [],
  members: [ALISHA_DAVIS],
};

