import { OrgLocationFeature } from "./types";

export const ORG_LOCATION_FEATURE_GROUPS: Record<string, OrgLocationFeature[]> =
  {
    safety: [
      OrgLocationFeature.GATED_PREMISES,
      OrgLocationFeature.SECURE_DROPOFF,
      OrgLocationFeature.CCTV_MONITORING,
      OrgLocationFeature.EMERGENCY_TRAINING,
      OrgLocationFeature.CONTROLLED_ACCESS,
      OrgLocationFeature.FIRE_EXTINGUISHERS,
      OrgLocationFeature.FIRST_AID_KIT,
    ],
    accessibility: [
      OrgLocationFeature.ONSITE_PARKING,
      OrgLocationFeature.DROPOFF_LANE,
      OrgLocationFeature.WHEELCHAIR_ACCESSIBLE,
      OrgLocationFeature.LANDMARK_LOCATION,
      OrgLocationFeature.PUBLIC_TRANSPORT_NEARBY,
    ],
    environment: [
      OrgLocationFeature.AIR_CONDITIONED,
      OrgLocationFeature.CLEAN_BATHROOMS,
      OrgLocationFeature.CHILD_FURNITURE,
      OrgLocationFeature.DEDICATED_PLAY_AREA,
      OrgLocationFeature.READING_CORNER,
      OrgLocationFeature.LEARNING_STATIONS,
      OrgLocationFeature.NAP_AREA,
    ],
    health: [
      OrgLocationFeature.DAILY_SANITIZATION,
      OrgLocationFeature.NUTRITIOUS_MEALS,
      OrgLocationFeature.PARENT_PROVIDES_MEALS,
      OrgLocationFeature.SICK_CHILD_POLICY,
      OrgLocationFeature.VACCINATION_REQUIRED,
      OrgLocationFeature.HYGIENE_PRACTICES,
    ],
    staff: [
      OrgLocationFeature.CERTIFIED_TEACHERS,
      OrgLocationFeature.DAILY_UPDATES_TO_PARENTS,
      OrgLocationFeature.OPEN_DOOR_POLICY,
      OrgLocationFeature.PARENT_ORIENTATION,
      OrgLocationFeature.STAFF_BACKGROUND_CHECKED,
    ],
    culture: [
      OrgLocationFeature.BIRTHDAY_CELEBRATIONS,
      OrgLocationFeature.HOLIDAY_EVENTS,
      OrgLocationFeature.PHOTO_CONSENT_POLICY,
      OrgLocationFeature.FIELD_TRIPS,
      OrgLocationFeature.GRADUATION_CEREMONY,
    ],
    media: [
      OrgLocationFeature.HAS_FRONT_IMAGE,
      OrgLocationFeature.HAS_PLAYGROUND_IMAGE,
      OrgLocationFeature.HAS_CLASSROOM_IMAGE,
      OrgLocationFeature.HAS_TEACHER_IMAGE,
    ],
  };
