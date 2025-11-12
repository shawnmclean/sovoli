import type { OrgInstance } from "~/modules/organisations/types";

import { ABERDEEN_HIGH_ORG } from "./aberdeenprimaryseh";
import { ACCOMPONG_PRIMARY_ORG } from "./accompongprimaryseh";
import { APPLETON_BASIC_SCHOOL_ORG } from "./appleton";
import { AUSTIN_PRIMARY_ORG } from "./austinprimaryseh";
import { B_B_COKE_HIGH_ORG } from "./bbcokehighseh";
import { BALACLAVA_PRIMARY_ORG } from "./balaclavaprimaryseh";
import { BALLARDS_VALLEY_PRIMARY_ORG } from "./ballardsvalleyprimaryseh";
import { BARBARY_HALL_PRIMARY_ORG } from "./barbaryhallprimaryseh";
import { BEERSHEBA_PRIMARY_ORG } from "./beershebaprimaryseh";
import { BETHLEHEM_ALL_AGE_AND_INFANT_ORG } from "./bethlehemallageseh";
import { BETHLEHEM_MORAVIAN_COLLEGE_ORG } from "./bethlehem";
import { BIGWOODS_PRIMARY_ORG } from "./bigwoodsprimaryseh";
import { BLACK_RIVER_HIGH_ORG } from "./blackriverhighseh";
import { BLACK_RIVER_PRIMARY_AND_INFANT_ORG } from "./blackriverprimaryseh";
import { BOGUE_PRIMARY_ORG } from "./bogueallageseh";
import { BRAE_S_RIVER_PRIMARY_ORG } from "./braesriverprimaryseh";
import { BRINKLEY_PRIMARY_ORG } from "./brinkleyprimaryseh";
import { BROMPTON_PRIMARY_ORG } from "./bromptonprimaryseh";
import { BULL_SAVANNAH_PRIMARY_AND_INFANT_ORG } from "./bullsavannahprimaryseh";
import { BURNT_SAVANNAH_PRIMARY_ORG } from "./burntsavannaprimaryseh";
import { CARISBROOK_PRIMARY_ORG } from "./carisbrookprimaryseh";
import { CLAPHAM_PRIMARY_ORG } from "./claphamprimaryseh";
import { CRAWFORD_PRIMARY_ORG } from "./crawfordprimaryseh";
import { ELDERSLIE_PRIMARY_JUNIOR_HIGH_ORG } from "./elderslieprimaryseh";
import { EPPING_FOREST_PRIMARY_ORG } from "./eppingforestprimaryseh";
import { FULLERSWOOD_PRIMARY_ORG } from "./fullerswoodallageseh";
import { FYFFES_PEN_PRIMARY_ORG } from "./fyffespenprimaryseh";
import { GENEVA_PRIMARY_ORG } from "./genevaprimaryseh";
import { GIDDY_HALL_ALL_AGE_ORG } from "./giddyhallallageseh";
import { GINGER_HILL_ALL_AGE_ORG } from "./gingerhillallageseh";
import { GLEN_STUART_PRIMARY_ORG } from "./glenstuartprimaryseh";
import { GOSHEN_ALL_AGE_ORG } from "./goshenallageseh";
import { HAMPTON_SCHOOL_ORG } from "./hamptonschoolhighseh";
import { HAPPY_GROVE_PRIMARY_ORG } from "./happygroveprimaryseh";
import { HOLLAND_PRIMARY_ORG } from "./hollandprimaryseh";
import { HOPEWELL_PRIMARY_ORG } from "./hopewellprimaryseh";
import { KILMARNOCK_PRIMARY_ORG } from "./kilmarnockprimaryseh";
import { LACOVIA_HIGH_ORG } from "./lacoviahighseh";
import { LACOVIA_PRIMARY_ORG } from "./lacoviaprimaryseh";
import { LALOR_PRIMARY_ORG } from "./lalorprimaryseh";
import { LEEDS_PRIMARY_ORG } from "./leedsprimaryseh";
import { LEWISVILLE_HIGH_ORG } from "./lewisvillehighseh";
import { LITITZ_ALL_AGE_AND_INFANT_ORG } from "./lititzallageseh";
import { MAGGOTTY_HIGH_ORG } from "./maggottyhighseh";
import { MARIE_COLE_MEMORIAL_PRIMARY_ORG } from "./mariecolememorialprimaryseh";
import { MAYFIELD_ALL_AGE_ORG } from "./mayfieldallageseh";
import { MERRYWOOD_PRIMARY_ORG } from "./merrywoodprimaryseh";
import { MIDDLE_QUARTERS_ALL_AGE_ORG } from "./middlequartersallageseh";
import { MIDDLESEX_INFANT_ORG } from "./middlesexinfantman";
import { MORNINGSIDE_PRIMARY_ORG } from "./morningsideprimaryseh";
import { MOUNT_OSBORN_PRIMARY_ORG } from "./mountosbornprimaryseh";
import { MOUNTAINSIDE_PRIMARY_ORG } from "./mountainsideprimaryseh";
import { MULGRAVE_PRIMARY_ORG } from "./mulgraveprimaryseh";
import { MUNRO_COLLEGE_ORG } from "./munrocollegeseh";
import { NAIN_HIGH_ORG } from "./nainprimaryseh";
import { NEWCOMBE_VALLEY_PRIMARY_ORG } from "./newcombevalleyprimaryseh";
import { NEWELL_HIGH_ORG } from "./newellhighseh";
import { NEWTON_PRIMARY_ORG } from "./newtonprimaryseh";
import { NIGHTINGALE_GROVE_PRIMARY_ORG } from "./nightingalegroveprimaryseh";
import { PARK_MOUNTAIN_PRIMARY_ORG } from "./parkmountainprimaryseh";
import { PAROTTEE_PRIMARY_ORG } from "./parotteeprimaryseh";
import { PEDRO_PLAINS_PRIMARY_ORG } from "./pedroplainsprimaryseh";
import { PEPPER_PRIMARY_ORG } from "./pepperprimaryseh";
import { PISGAH_PRIMARY_ORG } from "./pisgahallageseh";
import { PONDSIDE_PRIMARY_ORG } from "./pondsideallageseh";
import { QUICKSTEP_PRIMARY_ORG } from "./quickstepallageseh";
import { RED_BANK_PRIMARY_ORG } from "./redbankprimaryseh";
import { RETIREMENT_PRIMARY_ORG } from "./retirementprimaryseh";
import { ROGER_CLARKE_HIGH_ORG } from "./balaclavahighseh";
import { ROSE_HALL_PRIMARY_ORG } from "./rosehallallageseh";
import { ROSES_VALLEY_PRIMARY_ORG } from "./rosesvalleyprimaryseh";
import { RUSSELLS_PRIMARY_ORG } from "./russellsprimaryseh";
import { SANDY_BANK_PRIMARY_ORG } from "./sandybankprimaryseh";
import { SANTA_CRUZ_PRIMARY_JUNIOR_HIGH_ORG } from "./santacruzprimaryseh";
import { SCHOOLFIELD_PRIMARY_AND_INFANT_ORG } from "./schoolfieldprimaryseh";
import { SEAVIEW_PRIMARY_AND_INFANT_ORG } from "./seaviewprimaryseh";
import { SILOAH_PRIMARY_ORG } from "./siloahprimaryseh";
import { SLIPE_LEASED_PRIMARY_AND_INFANT_ORG } from "./slipeleasedprimaryseh";
import { SPRINGFIELD_ALL_AGE_ORG } from "./springfieldallageseh";
import { ST_ALBANS_PRIMARY_ORG } from "./stalbansprimaryseh";
import { ST_ELIZABETH_TECHNICAL_HIGH_ORG } from "./stethsadmin";
import { ST_MARYS_PRIMARY_ORG } from "./stmaryprimaryseh";
import { SYDNEY_PAGON_AGRICULTURAL_HIGH_ORG } from "./sydneypagonagriculturalseh";
import { THORNTON_PRIMARY_AND_INFANT_ORG } from "./thorntonprimaryseh";
import { TOP_HILL_PRIMARY_ORG } from "./tophillprimaryseh";
import { WARMINSTER_PRIMARY_ORG } from "./warminsterprimaryseh";
import { WHITE_HILL_PRIMARY_ORG } from "./whitehillprimaryseh";

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
