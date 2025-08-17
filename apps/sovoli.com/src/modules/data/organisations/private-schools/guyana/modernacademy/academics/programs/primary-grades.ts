import {
  GY_PRIMARY_GRADE_1_V1,
  GY_PRIMARY_GRADE_2_V1,
  GY_PRIMARY_GRADE_3_V1,
  GY_PRIMARY_GRADE_4_V1,
  GY_PRIMARY_GRADE_5_V1,
  GY_PRIMARY_GRADE_6_V1,
} from "~/modules/data/academics/guyana/programs";
import { PRIMARY_PHOTOS } from "../../photos";
import type { Program } from "~/modules/academics/types";
import {
  MAGY_PRIMARY_GRADE_1_2025_T1,
  MAGY_PRIMARY_GRADE_2_2025_T1,
  MAGY_PRIMARY_GRADE_3_2025_T1,
  MAGY_PRIMARY_GRADE_4_2025_T1,
  MAGY_PRIMARY_GRADE_5_2025_T1,
  MAGY_PRIMARY_GRADE_6_2025_T1,
} from "../cycles";
import { MAGY_SHARED_TESTIMONIALS } from "../testimonials";
import {
  primaryProgramHighlights,
  MAGY_PRIMARY_DEPT_ACTIVITIES,
} from "./shared";

export const MAGY_PRIMARY_GRADE_1_PROGRAM: Program = {
  id: "magy-primary-grade-1",
  slug: "grade-1",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_1_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_1_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade1-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Foundation Mathematics",
      units: [
        {
          title: "Numbers and Operations",
          topics: [
            "Number recognition 1-100",
            "Addition and subtraction",
            "Place value",
            "Simple word problems",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Early Reading Skills",
      units: [
        {
          title: "Reading Fundamentals",
          topics: [
            "Sight words",
            "Phonics review",
            "Reading comprehension",
            "Fluency practice",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Basic Grammar",
      units: [
        {
          title: "Grammar Basics",
          topics: [
            "Nouns and verbs",
            "Simple sentences",
            "Capitalization",
            "Punctuation",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-science",
      subject: { id: "science", name: "Science" },
      title: "Introduction to Science",
      units: [
        {
          title: "Living Things and Environment",
          topics: [
            "Plants and animals",
            "Basic needs",
            "Weather patterns",
            "Simple experiments",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Community and Culture",
      units: [
        {
          title: "Our Community",
          topics: [
            "Family and community",
            "Local geography",
            "Cultural celebrations",
            "Community helpers",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Word Building",
      units: [
        {
          title: "Vocabulary Development",
          topics: [
            "New words",
            "Word meanings",
            "Context clues",
            "Word families",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health and Wellness",
      units: [
        {
          title: "Healthy Living",
          topics: [
            "Personal hygiene",
            "Healthy eating",
            "Exercise",
            "Safety rules",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Advanced Phonics",
      units: [
        {
          title: "Phonics Skills",
          topics: [
            "Blends and digraphs",
            "Long and short vowels",
            "Word patterns",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling Skills",
      units: [
        {
          title: "Spelling Patterns",
          topics: [
            "High-frequency words",
            "Phonetic spelling",
            "Spelling rules",
            "Word practice",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Creative Writing",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Sentence writing",
            "Story creation",
            "Descriptive writing",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Reading Comprehension",
      units: [
        {
          title: "Understanding Text",
          topics: [
            "Main idea",
            "Details and facts",
            "Making predictions",
            "Drawing conclusions",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Listening and Writing",
      units: [
        {
          title: "Dictation Practice",
          topics: [
            "Listening skills",
            "Spelling accuracy",
            "Sentence structure",
            "Writing speed",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Handwriting and Writing",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Letter formation",
            "Neat handwriting",
            "Writing sentences",
            "Creative expression",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry Appreciation",
      units: [
        {
          title: "Poetry Basics",
          topics: [
            "Rhyming words",
            "Poem structure",
            "Reading poetry",
            "Simple poetry writing",
          ],
        },
      ],
    },
    {
      id: "magy-grade1-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Creative Arts",
      units: [
        {
          title: "Art Expression",
          topics: [
            "Drawing techniques",
            "Color mixing",
            "Craft projects",
            "Art appreciation",
          ],
        },
      ],
    },
  ],
};

export const MAGY_PRIMARY_GRADE_2_PROGRAM: Program = {
  id: "magy-primary-grade-2",
  slug: "grade-2",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_2_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_2_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade2-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Building Mathematics Skills",
      units: [
        {
          title: "Numbers and Operations",
          topics: [
            "Number patterns",
            "Addition and subtraction with regrouping",
            "Multiplication basics",
            "Problem solving",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Developing Reading Skills",
      units: [
        {
          title: "Reading Development",
          topics: [
            "Reading fluency",
            "Comprehension strategies",
            "Vocabulary building",
            "Independent reading",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Grammar Fundamentals",
      units: [
        {
          title: "Grammar Skills",
          topics: [
            "Parts of speech",
            "Sentence structure",
            "Tenses",
            "Grammar rules",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-science",
      subject: { id: "science", name: "Science" },
      title: "Exploring Science",
      units: [
        {
          title: "Scientific Inquiry",
          topics: [
            "Life cycles",
            "Matter and materials",
            "Forces and motion",
            "Scientific method",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Our World",
      units: [
        {
          title: "Geography and History",
          topics: [
            "Maps and globes",
            "Local history",
            "Cultural diversity",
            "Community development",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Expanding Vocabulary",
      units: [
        {
          title: "Word Knowledge",
          topics: [
            "Synonyms and antonyms",
            "Multiple meanings",
            "Word origins",
            "Context clues",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health and Safety",
      units: [
        {
          title: "Healthy Choices",
          topics: [
            "Nutrition",
            "Physical activity",
            "Safety awareness",
            "Emotional health",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Advanced Phonics",
      units: [
        {
          title: "Phonics Mastery",
          topics: [
            "Complex blends",
            "Syllable patterns",
            "Word analysis",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling Mastery",
      units: [
        {
          title: "Spelling Skills",
          topics: [
            "Spelling patterns",
            "Word families",
            "Spelling rules",
            "Vocabulary building",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Writing Development",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Paragraph writing",
            "Story development",
            "Descriptive writing",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Reading Comprehension",
      units: [
        {
          title: "Understanding Text",
          topics: [
            "Main idea and details",
            "Inference skills",
            "Text structure",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Listening and Writing",
      units: [
        {
          title: "Dictation Skills",
          topics: [
            "Listening comprehension",
            "Spelling accuracy",
            "Sentence writing",
            "Writing fluency",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Writing Skills",
      units: [
        {
          title: "Writing Development",
          topics: [
            "Handwriting improvement",
            "Sentence variety",
            "Creative writing",
            "Writing conventions",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry and Creative Writing",
      units: [
        {
          title: "Poetry Skills",
          topics: [
            "Poetic forms",
            "Rhythm and rhyme",
            "Poetry writing",
            "Poetry appreciation",
          ],
        },
      ],
    },
    {
      id: "magy-grade2-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Creative Arts",
      units: [
        {
          title: "Art Skills",
          topics: [
            "Drawing techniques",
            "Painting skills",
            "Craft projects",
            "Art history",
          ],
        },
      ],
    },
  ],
};

export const MAGY_PRIMARY_GRADE_3_PROGRAM: Program = {
  id: "magy-primary-grade-3",
  slug: "grade-3",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_3_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_3_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade3-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Intermediate Mathematics",
      units: [
        {
          title: "Mathematical Operations",
          topics: [
            "Multiplication and division",
            "Fractions basics",
            "Measurement",
            "Geometry concepts",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Advanced Reading Skills",
      units: [
        {
          title: "Reading Mastery",
          topics: [
            "Reading strategies",
            "Comprehension skills",
            "Literature appreciation",
            "Critical thinking",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Grammar Application",
      units: [
        {
          title: "Grammar Skills",
          topics: [
            "Advanced parts of speech",
            "Sentence variety",
            "Punctuation mastery",
            "Grammar usage",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-science",
      subject: { id: "science", name: "Science" },
      title: "Scientific Discovery",
      units: [
        {
          title: "Science Exploration",
          topics: [
            "Ecosystems",
            "Energy and matter",
            "Simple machines",
            "Scientific investigation",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "World Studies",
      units: [
        {
          title: "Global Perspectives",
          topics: [
            "World geography",
            "Cultural studies",
            "Historical events",
            "Global citizenship",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Advanced Vocabulary",
      units: [
        {
          title: "Word Mastery",
          topics: [
            "Academic vocabulary",
            "Word relationships",
            "Figurative language",
            "Word analysis",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health and Wellness",
      units: [
        {
          title: "Healthy Living",
          topics: [
            "Mental health",
            "Social skills",
            "Conflict resolution",
            "Healthy relationships",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Phonics Mastery",
      units: [
        {
          title: "Advanced Phonics",
          topics: [
            "Complex word patterns",
            "Syllable division",
            "Word analysis",
            "Reading fluency",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Advanced Spelling",
      units: [
        {
          title: "Spelling Mastery",
          topics: [
            "Complex spelling patterns",
            "Word origins",
            "Spelling strategies",
            "Vocabulary building",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Advanced Writing",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Essay writing",
            "Creative writing",
            "Research skills",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Advanced Comprehension",
      units: [
        {
          title: "Reading Skills",
          topics: [
            "Critical reading",
            "Text analysis",
            "Inference skills",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Advanced Dictation",
      units: [
        {
          title: "Dictation Skills",
          topics: [
            "Complex sentences",
            "Advanced vocabulary",
            "Writing accuracy",
            "Listening skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Writing Excellence",
      units: [
        {
          title: "Writing Mastery",
          topics: [
            "Writing styles",
            "Creative expression",
            "Writing conventions",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry and Literature",
      units: [
        {
          title: "Poetry Skills",
          topics: [
            "Poetic forms",
            "Literary devices",
            "Poetry writing",
            "Literature analysis",
          ],
        },
      ],
    },
    {
      id: "magy-grade3-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Advanced Arts",
      units: [
        {
          title: "Art Mastery",
          topics: [
            "Advanced techniques",
            "Art history",
            "Creative expression",
            "Art appreciation",
          ],
        },
      ],
    },
  ],
};

export const MAGY_PRIMARY_GRADE_4_PROGRAM: Program = {
  id: "magy-primary-grade-4",
  slug: "grade-4",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_4_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_4_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade4-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Upper Primary Mathematics",
      units: [
        {
          title: "Advanced Operations",
          topics: [
            "Fractions and decimals",
            "Geometry and measurement",
            "Data handling",
            "Problem solving",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Reading Excellence",
      units: [
        {
          title: "Reading Mastery",
          topics: [
            "Literature analysis",
            "Reading strategies",
            "Comprehension skills",
            "Critical thinking",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Grammar Mastery",
      units: [
        {
          title: "Advanced Grammar",
          topics: [
            "Complex sentence structures",
            "Grammar rules",
            "Language usage",
            "Writing mechanics",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-science",
      subject: { id: "science", name: "Science" },
      title: "Advanced Science",
      units: [
        {
          title: "Scientific Investigation",
          topics: [
            "Life processes",
            "Physical science",
            "Earth science",
            "Scientific method",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Advanced Social Studies",
      units: [
        {
          title: "Social Sciences",
          topics: [
            "History and geography",
            "Civics and government",
            "Economics basics",
            "Cultural studies",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Vocabulary Excellence",
      units: [
        {
          title: "Advanced Vocabulary",
          topics: [
            "Academic language",
            "Word origins",
            "Figurative language",
            "Vocabulary strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Advanced Health Education",
      units: [
        {
          title: "Health and Wellness",
          topics: [
            "Personal development",
            "Social skills",
            "Health awareness",
            "Life skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Phonics Application",
      units: [
        {
          title: "Phonics Skills",
          topics: [
            "Word analysis",
            "Reading strategies",
            "Spelling patterns",
            "Reading fluency",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling Excellence",
      units: [
        {
          title: "Advanced Spelling",
          topics: [
            "Complex patterns",
            "Word origins",
            "Spelling strategies",
            "Vocabulary building",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Advanced Composition",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Essay writing",
            "Creative writing",
            "Research writing",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Advanced Comprehension",
      units: [
        {
          title: "Reading Skills",
          topics: [
            "Critical reading",
            "Text analysis",
            "Inference skills",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Advanced Dictation",
      units: [
        {
          title: "Dictation Skills",
          topics: [
            "Complex passages",
            "Advanced vocabulary",
            "Writing accuracy",
            "Listening skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Writing Excellence",
      units: [
        {
          title: "Writing Mastery",
          topics: [
            "Writing styles",
            "Creative expression",
            "Writing conventions",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry and Literature",
      units: [
        {
          title: "Poetry Skills",
          topics: [
            "Poetic forms",
            "Literary devices",
            "Poetry writing",
            "Literature analysis",
          ],
        },
      ],
    },
    {
      id: "magy-grade4-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Advanced Arts",
      units: [
        {
          title: "Art Mastery",
          topics: [
            "Advanced techniques",
            "Art history",
            "Creative expression",
            "Art appreciation",
          ],
        },
      ],
    },
  ],
};

export const MAGY_PRIMARY_GRADE_5_PROGRAM: Program = {
  id: "magy-primary-grade-5",
  slug: "grade-5",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_5_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_5_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade5-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "Pre-NGSA Mathematics",
      units: [
        {
          title: "Advanced Mathematics",
          topics: [
            "Fractions and decimals",
            "Geometry and measurement",
            "Algebra basics",
            "Problem solving",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "Reading for NGSA",
      units: [
        {
          title: "Reading Excellence",
          topics: [
            "Literature analysis",
            "Reading strategies",
            "Comprehension skills",
            "Critical thinking",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "Grammar for NGSA",
      units: [
        {
          title: "Advanced Grammar",
          topics: [
            "Complex sentence structures",
            "Grammar rules",
            "Language usage",
            "Writing mechanics",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-science",
      subject: { id: "science", name: "Science" },
      title: "Science for NGSA",
      units: [
        {
          title: "Scientific Excellence",
          topics: [
            "Life processes",
            "Physical science",
            "Earth science",
            "Scientific investigation",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "Social Studies for NGSA",
      units: [
        {
          title: "Social Sciences",
          topics: [
            "History and geography",
            "Civics and government",
            "Economics basics",
            "Cultural studies",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "Vocabulary for NGSA",
      units: [
        {
          title: "Advanced Vocabulary",
          topics: [
            "Academic language",
            "Word origins",
            "Figurative language",
            "Vocabulary strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health Education",
      units: [
        {
          title: "Health and Wellness",
          topics: [
            "Personal development",
            "Social skills",
            "Health awareness",
            "Life skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Phonics Application",
      units: [
        {
          title: "Phonics Skills",
          topics: [
            "Word analysis",
            "Reading strategies",
            "Spelling patterns",
            "Reading fluency",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "Spelling for NGSA",
      units: [
        {
          title: "Advanced Spelling",
          topics: [
            "Complex patterns",
            "Word origins",
            "Spelling strategies",
            "Vocabulary building",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "Composition for NGSA",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Essay writing",
            "Creative writing",
            "Research writing",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "Comprehension for NGSA",
      units: [
        {
          title: "Reading Skills",
          topics: [
            "Critical reading",
            "Text analysis",
            "Inference skills",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "Dictation for NGSA",
      units: [
        {
          title: "Dictation Skills",
          topics: [
            "Complex passages",
            "Advanced vocabulary",
            "Writing accuracy",
            "Listening skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "Writing for NGSA",
      units: [
        {
          title: "Writing Mastery",
          topics: [
            "Writing styles",
            "Creative expression",
            "Writing conventions",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry and Literature",
      units: [
        {
          title: "Poetry Skills",
          topics: [
            "Poetic forms",
            "Literary devices",
            "Poetry writing",
            "Literature analysis",
          ],
        },
      ],
    },
    {
      id: "magy-grade5-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Advanced Arts",
      units: [
        {
          title: "Art Mastery",
          topics: [
            "Advanced techniques",
            "Art history",
            "Creative expression",
            "Art appreciation",
          ],
        },
      ],
    },
  ],
};

export const MAGY_PRIMARY_GRADE_6_PROGRAM: Program = {
  id: "magy-primary-grade-6",
  slug: "grade-6",
  audience: "parent",
  highlights: primaryProgramHighlights,
  tagline: "Science-led. Built for real learning",
  outcome: "NGSA (Grade 6 Exam)",
  description: "Strong foundational learning in a nurturing environment",
  standardProgramVersion: GY_PRIMARY_GRADE_6_V1,
  photos: PRIMARY_PHOTOS,
  cycles: [MAGY_PRIMARY_GRADE_6_2025_T1],
  testimonials: MAGY_SHARED_TESTIMONIALS,
  activities: MAGY_PRIMARY_DEPT_ACTIVITIES,
  courses: [
    {
      id: "magy-grade6-mathematics",
      subject: { id: "math", name: "Mathematics" },
      title: "NGSA Mathematics",
      units: [
        {
          title: "NGSA Preparation",
          topics: [
            "Advanced operations",
            "Geometry and measurement",
            "Data analysis",
            "Problem solving strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-reading",
      subject: { id: "language-reading", name: "Reading" },
      title: "NGSA Reading",
      units: [
        {
          title: "Reading Excellence",
          topics: [
            "Literature analysis",
            "Reading strategies",
            "Comprehension skills",
            "Critical thinking",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-grammar",
      subject: { id: "language-grammar", name: "Grammar" },
      title: "NGSA Grammar",
      units: [
        {
          title: "Grammar Mastery",
          topics: [
            "Advanced grammar",
            "Language usage",
            "Writing mechanics",
            "Grammar application",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-science",
      subject: { id: "science", name: "Science" },
      title: "NGSA Science",
      units: [
        {
          title: "Scientific Excellence",
          topics: [
            "Life processes",
            "Physical science",
            "Earth science",
            "Scientific investigation",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-social-studies",
      subject: { id: "social-studies", name: "Social Studies" },
      title: "NGSA Social Studies",
      units: [
        {
          title: "Social Sciences",
          topics: [
            "History and geography",
            "Civics and government",
            "Economics basics",
            "Cultural studies",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-vocabulary",
      subject: { id: "language-vocabulary", name: "Vocabulary" },
      title: "NGSA Vocabulary",
      units: [
        {
          title: "Advanced Vocabulary",
          topics: [
            "Academic language",
            "Word origins",
            "Figurative language",
            "Vocabulary strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-health",
      subject: {
        id: "health-education",
        name: "Health and Family Life Education",
      },
      title: "Health Education",
      units: [
        {
          title: "Health and Wellness",
          topics: [
            "Personal development",
            "Social skills",
            "Health awareness",
            "Life skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-phonics",
      subject: { id: "language-phonics", name: "Phonics" },
      title: "Phonics Application",
      units: [
        {
          title: "Phonics Skills",
          topics: [
            "Word analysis",
            "Reading strategies",
            "Spelling patterns",
            "Reading fluency",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-spelling",
      subject: { id: "language-spelling", name: "Spelling" },
      title: "NGSA Spelling",
      units: [
        {
          title: "Advanced Spelling",
          topics: [
            "Complex patterns",
            "Word origins",
            "Spelling strategies",
            "Vocabulary building",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-composition",
      subject: { id: "language-composition", name: "Composition" },
      title: "NGSA Composition",
      units: [
        {
          title: "Writing Skills",
          topics: [
            "Essay writing",
            "Creative writing",
            "Research writing",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-comprehension",
      subject: { id: "language-comprehension", name: "Comprehension" },
      title: "NGSA Comprehension",
      units: [
        {
          title: "Reading Skills",
          topics: [
            "Critical reading",
            "Text analysis",
            "Inference skills",
            "Reading strategies",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-dictation",
      subject: { id: "language-dictation", name: "Dictation" },
      title: "NGSA Dictation",
      units: [
        {
          title: "Dictation Skills",
          topics: [
            "Complex passages",
            "Advanced vocabulary",
            "Writing accuracy",
            "Listening skills",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-writing",
      subject: { id: "language-writing", name: "Writing" },
      title: "NGSA Writing",
      units: [
        {
          title: "Writing Mastery",
          topics: [
            "Writing styles",
            "Creative expression",
            "Writing conventions",
            "Writing process",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-poetry",
      subject: { id: "language-poetry", name: "Poetry" },
      title: "Poetry and Literature",
      units: [
        {
          title: "Poetry Skills",
          topics: [
            "Poetic forms",
            "Literary devices",
            "Poetry writing",
            "Literature analysis",
          ],
        },
      ],
    },
    {
      id: "magy-grade6-art",
      subject: { id: "creative-art", name: "Art" },
      title: "Advanced Arts",
      units: [
        {
          title: "Art Mastery",
          topics: [
            "Advanced techniques",
            "Art history",
            "Creative expression",
            "Art appreciation",
          ],
        },
      ],
    },
  ],
};
