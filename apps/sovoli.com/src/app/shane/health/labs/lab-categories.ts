export type LabCategory =
  | "Liver"
  | "Metabolic"
  | "Urine"
  | "Lipids"
  | "Glucose/A1c"
  | "Thyroid"
  | "CBC"
  | "Other";

export const LAB_CATEGORY_ORDER: LabCategory[] = [
  "Liver",
  "Metabolic",
  "Lipids",
  "Glucose/A1c",
  "Thyroid",
  "CBC",
  "Other",
  "Urine",
];

/**
 * Explicit mapping from `labs.csv` "Test Name" -> category.
 * Keep keys EXACTLY as in the CSV for reliable matching.
 */
export const LAB_TEST_TO_CATEGORY: Record<string, LabCategory> = {
  // Liver
  ALBUMIN: "Liver",
  "ALKALINE PHOSPHATASE": "Liver",
  "BILIRUBIN, DIRECT": "Liver",
  "BILIRUBIN, TOTAL": "Liver",
  "TOTAL BILIRUBIN": "Liver",
  GGTP: "Liver",
  SGOT: "Liver",
  SGPT: "Liver",
  GLOBULIN: "Liver",
  "GLOBULIN (CALC)": "Liver",
  "TOTAL PROTEIN": "Liver",
  "PROTEINS, TOTAL": "Liver",

  // Metabolic
  BUN: "Metabolic",
  CREATININE: "Metabolic",
  EGFR: "Metabolic",
  "ESTIMATED GFR": "Metabolic",
  SODIUM: "Metabolic",
  POTASSIUM: "Metabolic",
  CHLORIDE: "Metabolic",
  BICARBONATE: "Metabolic",
  "CARBON DIOXIDE": "Metabolic",
  CALCIUM: "Metabolic",
  "CALCIUM TOTAL": "Metabolic",
  PHOSPHORUS: "Metabolic",
  "URIC ACID": "Metabolic",
  LDH: "Metabolic",

  // Urine
  APPEARANCE: "Urine",
  COLOR: "Urine",
  COLOUR: "Urine",
  "SPECIFIC GRAVITY": "Urine",
  PH: "Urine",
  LEUCOCYTES: "Urine",
  NITRITE: "Urine",
  BLOOD: "Urine",
  "BLOOD - URINE": "Urine",
  BILIRUBIN: "Urine",
  GLUCOSE: "Urine",
  KETONE: "Urine",
  "URINE GLUCOSE": "Urine",
  "URINE KETONES": "Urine",
  "URINE PROTEIN": "Urine",
  UROBILINOGEN: "Urine",
  BACTERIA: "Urine",
  "RBC - URINE": "Urine",
  "WBC (HPF)": "Urine",
  "CASTS (LPF)": "Urine",
  "CASTS (PATH)": "Urine",
  "CASTS HYALINE": "Urine",
  CRYSTALS: "Urine",
  "AMORPHOUS DEPOSITS": "Urine",
  "MUCUS THREADS": "Urine",
  EPITHELIAL: "Urine",
  EPITHELIALS: "Urine",
  "EPITHELIAL NON-SQUAMOUS": "Urine",
  "EPITHELIAL SQUAMOUS": "Urine",
  "SPERM (URINE)": "Urine",
  TRICHOMONAS: "Urine",
  "YEAST CELLS (URINE)": "Urine",
  OTHER: "Urine",

  // Lipids
  "TOTAL CHOLESTEROL": "Lipids",
  "CHOLESTEROL TOTAL": "Lipids",
  "HDL CHOLESTEROL": "Lipids",
  "LDL CHOLESTEROL": "Lipids",
  TRIGLYCERIDES: "Lipids",
  "RISK RATIO": "Lipids",
  "CHOLESTEROL/HDL CHOLESTEROL (RATIO)": "Lipids",
  "APOLIPOPROTEIN A1": "Lipids",
  "APOLIPOPROTEIN B": "Lipids",

  // Glucose / A1c
  "FASTING GLUCOSE": "Glucose/A1c",
  "ESTIMATED AVG GLUCOSE": "Glucose/A1c",
  HBA1C: "Glucose/A1c",
  "INSULIN FASTING": "Glucose/A1c",

  // Thyroid
  TSH: "Thyroid",
  "HS-TSH": "Thyroid",
  "FREE T4": "Thyroid",

  // CBC
  HAEMOGLOBIN: "CBC",
  HB: "CBC",
  RBC: "CBC",
  WBC: "CBC",
  "WBC TOTAL": "CBC",
  PLATELETS: "CBC",
  PCV: "CBC",
  MCV: "CBC",
  MCH: "CBC",
  MCHC: "CBC",
  RDW: "CBC",
  "BASO ABS": "CBC",
  "BASO%": "CBC",
  "BASOPHILS %": "CBC",
  "BASOPHILS ABSOLUTE": "CBC",
  "EOS ABS": "CBC",
  "EOS%": "CBC",
  "EOSINOPHILS %": "CBC",
  "EOSINOPHILS ABSOLUTE": "CBC",
  "LYM ABS": "CBC",
  "LYM%": "CBC",
  "LYMPHOCYTES %": "CBC",
  "LYMPHOCYTES ABSOLUTE": "CBC",
  "MONOCYTES %": "CBC",
  "MONOCYTES ABSOLUTE": "CBC",
  "NEU ABS": "CBC",
  "NEU%": "CBC",
  "SEG NEUTROPHILS %": "CBC",
  "SEG NEUTROPHILS ABSOLUTE": "CBC",
};

export function getLabCategory(testName: string): LabCategory {
  const key = testName.trim();
  return LAB_TEST_TO_CATEGORY[key] ?? "Other";
}

