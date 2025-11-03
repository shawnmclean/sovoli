import type { OrgInstance } from "~/modules/organisations/types";
import { applyPrivateSchoolMetadata } from "./metadata";
// Import all org instances from each tenant
import { MODERN_ACADEMY_ORG } from "./modernacademy";
import { ACADEMY_EXCELLENCE_ORG } from "./academyexcellence";
import { ACADEMY_PROFESSIONAL_ORG } from "./academyprofessional";
import { ACADEMIC_TRAINING_ORG } from "./academictraining";
import { APEX_EDUCATION_ORG } from "./apexeducation";
import { CANADIAN_SCHOOL_ORG } from "./canadianschool";
import { CARIBBEAN_FIRST_ORG } from "./caribbeanfirst";
import { CHESED_ACADEMY_ORG } from "./chesedacademy";
import { CIOGMETEN_ORG } from "./ciogmeten";
import { CONCORD_ACADEMY_ORG } from "./concordacademy";
import { DOMINION_SCHOOLS_ORG } from "./dominionschools";
import { EBASCOL_EDUCATION_ORG } from "./ebascoleducation";
import { EDEN_HAVEN_ORG } from "./edenhaven";
import { FLUENCY_BILINGUAL_ORG } from "./fluencybilingual";
import { GEMSVILLE_ACADEMY_ORG } from "./gemsvilleacademy";
import { GARDEN_CITY_ORG } from "./gardencity";
import { GENESIS_EARLY_ORG } from "./genesisearly";
import { GEORGETOWN_INTERNATIONAL_ORG } from "./georgetowninternational";
import { GEORGETOWN_LEARNING_ORG } from "./georgetownlearning";
import { GLOBAL_TECHNOLOGY_ORG } from "./globaltechnology";
import { GREEN_ACRES_SCHOOL_ORG } from "./greenacresschool";
import { HIDDEN_TREASURES_ORG } from "./hiddentreasures";
import { INTERNATIONAL_BUSINESS_ORG } from "./internationalbusiness";
import { ISA_ISLAMIC_ORG } from "./isaislamic";
import { JOSEL_EDUCATIONAL_ORG } from "./joseleducational";
import { LA_PREMIERE_ORG } from "./lapremiere";
import { LASER_EDGE_ORG } from "./laseredge";
import { LESLYNS_ACADEMY_ORG } from "./leslynsacademy";
import { LOVABLE_FRIENDS_ORG } from "./lovablefriends";
import { MAES_SCHOOLS_ORG } from "./maesschools";
import { MARIAN_ACADEMY_ORG } from "./marianacademy";
import { MET_PRIDE_ORG } from "./metpride";
import { MONAR_EDUCATIONAL_ORG } from "./monareducational";
import { NEW_LIFE_MINISTRIES_ORG } from "./newlifeministries";
import { QAYYIM_ACADEMY_ORG } from "./qayyimacademy";
import { SAPODILLA_SCHOOL_ORG } from "./sapodillaschool";
import { SCHOOL_BRILLIANT_ORG } from "./schoolbrilliant";
import { SCHOOL_NATIONS_ORG } from "./schoolnations";
import { STANDARD_CHRISTIAN_ORG } from "./standardchristian";
import { SUCCESS_ELEMENTARY_ORG } from "./successelementary";
import { THE_BUSINESS_ORG } from "./thebusiness";
import { THE_GUYANA_EDUCATION_ORG } from "./theguyanaeducation";
import { THE_NEW_GUYANA_ORG } from "./thenewguyana";
import { VALMIKI_VIDYALAYA_ORG } from "./valmikividyalaya";
import { XENON_ACADEMY_ORG } from "./xenonacademy";
import { CHASE_ACADEMY_ORG } from "./chaseacademy";
import { FRASERS_EDUCATIONAL_ORG } from "./fraserseducational";
import { MORGANS_LEARNING_ORG } from "./morganslearning";
import { PURE_MASTERS_ACADEMY_ORG } from "./puremastersacademy";
import { BACCHUS_LEARNING_ORG } from "./bacchuslearning";
import { WESTFIELD_PREP_ORG } from "./westfieldprep";
import { ANAIS_PRIVATE_SCHOOL_ORG } from "./anaisprivateschool";
import { HEAVENLY_SUNLIGHT_ORG } from "./heavenlysunlight";
import { SVN_ORG } from "./svn";
import { DHARMIC_RAMA_KRISHNA_ORG } from "./dharmicramakrishna";
import { GEORGETOWN_SDA_ACADEMY_ORG } from "./georgetown-sda-academy";

const PRIVATE_SCHOOLS_GUYANA_BASE: OrgInstance[] = [
  MODERN_ACADEMY_ORG,
  ACADEMY_EXCELLENCE_ORG,
  ACADEMY_PROFESSIONAL_ORG,
  ACADEMIC_TRAINING_ORG,
  APEX_EDUCATION_ORG,
  CANADIAN_SCHOOL_ORG,
  CARIBBEAN_FIRST_ORG,
  CHESED_ACADEMY_ORG,
  CIOGMETEN_ORG,
  CONCORD_ACADEMY_ORG,
  DOMINION_SCHOOLS_ORG,
  EBASCOL_EDUCATION_ORG,
  EDEN_HAVEN_ORG,
  FLUENCY_BILINGUAL_ORG,
  GEMSVILLE_ACADEMY_ORG,
  GARDEN_CITY_ORG,
  GENESIS_EARLY_ORG,
  GEORGETOWN_INTERNATIONAL_ORG,
  GEORGETOWN_LEARNING_ORG,
  GLOBAL_TECHNOLOGY_ORG,
  GREEN_ACRES_SCHOOL_ORG,
  HIDDEN_TREASURES_ORG,
  INTERNATIONAL_BUSINESS_ORG,
  ISA_ISLAMIC_ORG,
  JOSEL_EDUCATIONAL_ORG,
  LA_PREMIERE_ORG,
  LASER_EDGE_ORG,
  LESLYNS_ACADEMY_ORG,
  LOVABLE_FRIENDS_ORG,
  MAES_SCHOOLS_ORG,
  MARIAN_ACADEMY_ORG,
  MET_PRIDE_ORG,
  MONAR_EDUCATIONAL_ORG,
  NEW_LIFE_MINISTRIES_ORG,
  QAYYIM_ACADEMY_ORG,
  SAPODILLA_SCHOOL_ORG,
  SCHOOL_BRILLIANT_ORG,
  SCHOOL_NATIONS_ORG,
  STANDARD_CHRISTIAN_ORG,
  SUCCESS_ELEMENTARY_ORG,
  THE_BUSINESS_ORG,
  THE_GUYANA_EDUCATION_ORG,
  THE_NEW_GUYANA_ORG,
  VALMIKI_VIDYALAYA_ORG,
  XENON_ACADEMY_ORG,
  CHASE_ACADEMY_ORG,
  FRASERS_EDUCATIONAL_ORG,
  MORGANS_LEARNING_ORG,
  PURE_MASTERS_ACADEMY_ORG,
  BACCHUS_LEARNING_ORG,
  WESTFIELD_PREP_ORG,
  ANAIS_PRIVATE_SCHOOL_ORG,
  HEAVENLY_SUNLIGHT_ORG,
  SVN_ORG,
  DHARMIC_RAMA_KRISHNA_ORG,
  GEORGETOWN_SDA_ACADEMY_ORG,
];

export const PRIVATE_SCHOOLS_GUYANA: OrgInstance[] =
  PRIVATE_SCHOOLS_GUYANA_BASE.map(applyPrivateSchoolMetadata);
