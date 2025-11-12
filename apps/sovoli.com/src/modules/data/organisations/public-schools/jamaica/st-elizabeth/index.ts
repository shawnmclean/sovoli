import type { OrgInstance } from "~/modules/organisations/types";

import { ABERDEEN_HIGH_ORG } from "./aberdeenprimaryjm";
import { ACCOMPONG_PRIMARY_ORG } from "./accompongprimaryjm";
import { APPLETON_BASIC_SCHOOL_ORG } from "./appleton";
import { AUSTIN_PRIMARY_ORG } from "./austinprimaryjm";
import { B_B_COKE_HIGH_ORG } from "./bbcokehighjm";
import { BALACLAVA_PRIMARY_ORG } from "./balaclavaprimaryjm";
import { BALLARDS_VALLEY_PRIMARY_ORG } from "./ballardsvalleyprimaryjm";
import { BARBARY_HALL_PRIMARY_ORG } from "./barbaryhallprimaryjm";
import { BEERSHEBA_PRIMARY_ORG } from "./beershebaprimaryjm";
import { BETHLEHEM_ALL_AGE_AND_INFANT_ORG } from "./bethlehemallagejm";
import { BETHLEHEM_MORAVIAN_COLLEGE_ORG } from "./bethlehem";
import { BIGWOODS_PRIMARY_ORG } from "./bigwoodsprimaryjm";
import { BLACK_RIVER_HIGH_ORG } from "./blackriverhighjm";
import { BLACK_RIVER_PRIMARY_AND_INFANT_ORG } from "./blackriverprimaryjm";
import { BOGUE_PRIMARY_ORG } from "./bogueallagejm";
import { BRAE_S_RIVER_PRIMARY_ORG } from "./braesriverprimaryjm";
import { BRINKLEY_PRIMARY_ORG } from "./brinkleyprimaryjm";
import { BROMPTON_PRIMARY_ORG } from "./bromptonprimaryjm";
import { BULL_SAVANNAH_PRIMARY_AND_INFANT_ORG } from "./bullsavannahprimaryjm";
import { BURNT_SAVANNAH_PRIMARY_ORG } from "./burntsavannaprimaryjm";
import { CARISBROOK_PRIMARY_ORG } from "./carisbrookprimaryjm";
import { CLAPHAM_PRIMARY_ORG } from "./claphamprimaryjm";
import { CRAWFORD_PRIMARY_ORG } from "./crawfordprimaryjm";
import { ELDERSLIE_PRIMARY_JUNIOR_HIGH_ORG } from "./elderslieprimaryjm";
import { EPPING_FOREST_PRIMARY_ORG } from "./eppingforestprimaryjm";
import { FULLERSWOOD_PRIMARY_ORG } from "./fullerswoodallagejm";
import { FYFFES_PEN_PRIMARY_ORG } from "./fyffespenprimaryjm";
import { GENEVA_PRIMARY_ORG } from "./genevaprimaryjm";
import { GIDDY_HALL_ALL_AGE_ORG } from "./giddyhallallagejm";
import { GINGER_HILL_ALL_AGE_ORG } from "./gingerhillallagejm";
import { GINGER_HILL_PRIMARY_ORG } from "./gingerhillprimaryjm";
import { GLEN_STUART_PRIMARY_ORG } from "./glenstuartprimaryjm";
import { GOSHEN_ALL_AGE_ORG } from "./goshenallagejm";
import { HAMPTON_SCHOOL_ORG } from "./hamptonschoolhighjm";
import { HAPPY_GROVE_PRIMARY_ORG } from "./happygroveprimaryjm";
import { HOLLAND_PRIMARY_ORG } from "./hollandprimaryjm";
import { HOPEWELL_PRIMARY_ORG } from "./hopewellprimaryjm";
import { KILMARNOCK_PRIMARY_ORG } from "./kilmarnockprimaryjm";
import { LACOVIA_HIGH_ORG } from "./lacoviahighjm";
import { LACOVIA_PRIMARY_ORG } from "./lacoviaprimaryjm";
import { LALOR_PRIMARY_ORG } from "./lalorprimaryjm";
import { LEEDS_PRIMARY_ORG } from "./leedsprimaryjm";
import { LEWISVILLE_HIGH_ORG } from "./lewisvillehighjm";
import { LITITZ_ALL_AGE_AND_INFANT_ORG } from "./lititzallagejm";
import { MAGGOTTY_HIGH_ORG } from "./maggottyhighjm";
import { MARIE_COLE_MEMORIAL_PRIMARY_ORG } from "./mariecolememorialprimaryjm";
import { MAYFIELD_ALL_AGE_ORG } from "./mayfieldallagejm";
import { MERRYWOOD_PRIMARY_ORG } from "./merrywoodprimaryjm";
import { MIDDLE_QUARTERS_ALL_AGE_ORG } from "./middlequartersallagejm";
import { MIDDLESEX_INFANT_ORG } from "./middlesexinfantman";
import { MORNINGSIDE_PRIMARY_ORG } from "./morningsideprimaryjm";
import { MOUNT_OSBORN_PRIMARY_ORG } from "./mountosbornprimaryjm";
import { MOUNTAINSIDE_PRIMARY_ORG } from "./mountainsideprimaryjm";
import { MULGRAVE_PRIMARY_ORG } from "./mulgraveprimaryjm";
import { MUNRO_COLLEGE_ORG } from "./munrocollegejm";
import { NAIN_HIGH_ORG } from "./nainprimaryjm";
import { NEWCOMBE_VALLEY_PRIMARY_ORG } from "./newcombevalleyprimaryjm";
import { NEWELL_HIGH_ORG } from "./newellhighjm";
import { NEWTON_PRIMARY_ORG } from "./newtonprimaryjm";
import { NIGHTINGALE_GROVE_PRIMARY_ORG } from "./nightingalegroveprimaryjm";
import { PARK_MOUNTAIN_PRIMARY_ORG } from "./parkmountainprimaryjm";
import { PAROTTEE_PRIMARY_ORG } from "./parotteeprimaryjm";
import { PEDRO_PLAINS_PRIMARY_ORG } from "./pedroplainsprimaryjm";
import { PEPPER_PRIMARY_ORG } from "./pepperprimaryjm";
import { PISGAH_PRIMARY_ORG } from "./pisgahallagejm";
import { PONDSIDE_PRIMARY_ORG } from "./pondsideallagejm";
import { QUICKSTEP_PRIMARY_ORG } from "./quickstepallagejm";
import { RED_BANK_PRIMARY_ORG } from "./redbankprimaryjm";
import { RETIREMENT_PRIMARY_ORG } from "./retirementprimaryjm";
import { ROGER_CLARKE_HIGH_ORG } from "./balaclavahighjm";
import { ROSE_HALL_PRIMARY_ORG } from "./rosehallallagejm";
import { ROSES_VALLEY_PRIMARY_ORG } from "./rosesvalleyprimaryjm";
import { RUSSELLS_PRIMARY_ORG } from "./russellsprimaryjm";
import { SANDY_BANK_PRIMARY_ORG } from "./sandybankprimaryjm";
import { SANTA_CRUZ_PRIMARY_JUNIOR_HIGH_ORG } from "./santacruzprimaryjm";
import { SCHOOLFIELD_PRIMARY_AND_INFANT_ORG } from "./schoolfieldprimaryjm";
import { SEAVIEW_PRIMARY_AND_INFANT_ORG } from "./seaviewprimaryjm";
import { SILOAH_PRIMARY_ORG } from "./siloahprimaryjm";
import { SLIPE_LEASED_PRIMARY_AND_INFANT_ORG } from "./slipeleasedprimaryjm";
import { SPRINGFIELD_ALL_AGE_ORG } from "./springfieldallagejm";
import { ST_ALBANS_PRIMARY_ORG } from "./stalbansprimaryjm";
import { ST_ELIZABETH_TECHNICAL_HIGH_ORG } from "./stethsadmin";
import { ST_MARYS_PRIMARY_ORG } from "./stmaryprimaryjm";
import { SYDNEY_PAGON_AGRICULTURAL_HIGH_ORG } from "./sydneypagonagriculturaljm";
import { THORNTON_PRIMARY_AND_INFANT_ORG } from "./thorntonprimaryjm";
import { TOP_HILL_PRIMARY_ORG } from "./tophillprimaryjm";
import { WARMINSTER_PRIMARY_ORG } from "./warminsterprimaryjm";
import { WHITE_HILL_PRIMARY_ORG } from "./whitehillprimaryjm";

export const ST_ELIZABETH_PUBLIC_SCHOOLS_JAMAICA: OrgInstance[] = [
  ABERDEEN_HIGH_ORG,
  ACCOMPONG_PRIMARY_ORG,
  APPLETON_BASIC_SCHOOL_ORG,
  AUSTIN_PRIMARY_ORG,
  B_B_COKE_HIGH_ORG,
  BALACLAVA_PRIMARY_ORG,
  BALLARDS_VALLEY_PRIMARY_ORG,
  BARBARY_HALL_PRIMARY_ORG,
  BEERSHEBA_PRIMARY_ORG,
  BETHLEHEM_ALL_AGE_AND_INFANT_ORG,
  BETHLEHEM_MORAVIAN_COLLEGE_ORG,
  BIGWOODS_PRIMARY_ORG,
  BLACK_RIVER_HIGH_ORG,
  BLACK_RIVER_PRIMARY_AND_INFANT_ORG,
  BOGUE_PRIMARY_ORG,
  BRAE_S_RIVER_PRIMARY_ORG,
  BRINKLEY_PRIMARY_ORG,
  BROMPTON_PRIMARY_ORG,
  BULL_SAVANNAH_PRIMARY_AND_INFANT_ORG,
  BURNT_SAVANNAH_PRIMARY_ORG,
  CARISBROOK_PRIMARY_ORG,
  CLAPHAM_PRIMARY_ORG,
  CRAWFORD_PRIMARY_ORG,
  ELDERSLIE_PRIMARY_JUNIOR_HIGH_ORG,
  EPPING_FOREST_PRIMARY_ORG,
  FULLERSWOOD_PRIMARY_ORG,
  FYFFES_PEN_PRIMARY_ORG,
  GENEVA_PRIMARY_ORG,
  GIDDY_HALL_ALL_AGE_ORG,
  GINGER_HILL_ALL_AGE_ORG,
  GINGER_HILL_PRIMARY_ORG,
  GLEN_STUART_PRIMARY_ORG,
  GOSHEN_ALL_AGE_ORG,
  HAMPTON_SCHOOL_ORG,
  HAPPY_GROVE_PRIMARY_ORG,
  HOLLAND_PRIMARY_ORG,
  HOPEWELL_PRIMARY_ORG,
  KILMARNOCK_PRIMARY_ORG,
  LACOVIA_HIGH_ORG,
  LACOVIA_PRIMARY_ORG,
  LALOR_PRIMARY_ORG,
  LEEDS_PRIMARY_ORG,
  LEWISVILLE_HIGH_ORG,
  LITITZ_ALL_AGE_AND_INFANT_ORG,
  MAGGOTTY_HIGH_ORG,
  MARIE_COLE_MEMORIAL_PRIMARY_ORG,
  MAYFIELD_ALL_AGE_ORG,
  MERRYWOOD_PRIMARY_ORG,
  MIDDLE_QUARTERS_ALL_AGE_ORG,
  MIDDLESEX_INFANT_ORG,
  MORNINGSIDE_PRIMARY_ORG,
  MOUNT_OSBORN_PRIMARY_ORG,
  MOUNTAINSIDE_PRIMARY_ORG,
  MULGRAVE_PRIMARY_ORG,
  MUNRO_COLLEGE_ORG,
  NAIN_HIGH_ORG,
  NEWCOMBE_VALLEY_PRIMARY_ORG,
  NEWELL_HIGH_ORG,
  NEWTON_PRIMARY_ORG,
  NIGHTINGALE_GROVE_PRIMARY_ORG,
  PARK_MOUNTAIN_PRIMARY_ORG,
  PAROTTEE_PRIMARY_ORG,
  PEDRO_PLAINS_PRIMARY_ORG,
  PEPPER_PRIMARY_ORG,
  PISGAH_PRIMARY_ORG,
  PONDSIDE_PRIMARY_ORG,
  QUICKSTEP_PRIMARY_ORG,
  RED_BANK_PRIMARY_ORG,
  RETIREMENT_PRIMARY_ORG,
  ROGER_CLARKE_HIGH_ORG,
  ROSE_HALL_PRIMARY_ORG,
  ROSES_VALLEY_PRIMARY_ORG,
  RUSSELLS_PRIMARY_ORG,
  SANDY_BANK_PRIMARY_ORG,
  SANTA_CRUZ_PRIMARY_JUNIOR_HIGH_ORG,
  SCHOOLFIELD_PRIMARY_AND_INFANT_ORG,
  SEAVIEW_PRIMARY_AND_INFANT_ORG,
  SILOAH_PRIMARY_ORG,
  SLIPE_LEASED_PRIMARY_AND_INFANT_ORG,
  SPRINGFIELD_ALL_AGE_ORG,
  ST_ALBANS_PRIMARY_ORG,
  ST_ELIZABETH_TECHNICAL_HIGH_ORG,
  ST_MARYS_PRIMARY_ORG,
  SYDNEY_PAGON_AGRICULTURAL_HIGH_ORG,
  THORNTON_PRIMARY_AND_INFANT_ORG,
  TOP_HILL_PRIMARY_ORG,
  WARMINSTER_PRIMARY_ORG,
  WHITE_HILL_PRIMARY_ORG,
];
