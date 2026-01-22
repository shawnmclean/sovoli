"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  AlertTriangle,
  Apple as AppleIcon,
  Award,
  Bell,
  BookOpenCheck,
  Building,
  Bus,
  Calendar,
  Camera,
  Car,
  Car as CarIcon,
  DoorOpen,
  Droplets,
  GraduationCap as GraduationCapIcon,
  Heart,
  Image,
  Image as ImageIcon,
  Image as ImageIcon2,
  Image as ImageIcon3,
  Landmark,
  MapPin,
  Monitor,
  PartyPopper,
  Pill,
  Play,
  Sandwich,
  Shield,
  Snowflake,
  Sofa,
  Sparkles,
  Stethoscope,
  Syringe,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { OrgLocationFeature } from "~/modules/organisations/types";

interface LocationFeaturesSectionProps {
  orgInstance: OrgInstance;
  program: Program;
}

// Icon mapping for location features
const FEATURE_ICONS: Record<
  OrgLocationFeature,
  React.ComponentType<{ className?: string }>
> = {
  // Safety
  [OrgLocationFeature.GATED_PREMISES]: Shield,
  [OrgLocationFeature.SECURE_DROPOFF]: Car,
  [OrgLocationFeature.CCTV_MONITORING]: Building,
  [OrgLocationFeature.EMERGENCY_TRAINING]: AlertTriangle,
  [OrgLocationFeature.CONTROLLED_ACCESS]: Shield,
  [OrgLocationFeature.FIRE_EXTINGUISHERS]: Sparkles,
  [OrgLocationFeature.FIRST_AID_KIT]: Heart,

  // Accessibility
  [OrgLocationFeature.ONSITE_PARKING]: Car,
  [OrgLocationFeature.DROPOFF_LANE]: CarIcon,
  [OrgLocationFeature.WHEELCHAIR_ACCESSIBLE]: Users, // Using Users as alternative for wheelchair
  [OrgLocationFeature.LANDMARK_LOCATION]: Landmark,
  [OrgLocationFeature.PUBLIC_TRANSPORT_NEARBY]: Bus,

  // Environment
  [OrgLocationFeature.AIR_CONDITIONED]: Snowflake,
  [OrgLocationFeature.CLEAN_BATHROOMS]: Droplets,
  [OrgLocationFeature.CHILD_FURNITURE]: Sofa,
  [OrgLocationFeature.DEDICATED_PLAY_AREA]: Play,
  [OrgLocationFeature.READING_CORNER]: BookOpenCheck,
  [OrgLocationFeature.LEARNING_STATIONS]: Monitor,
  [OrgLocationFeature.NAP_AREA]: Pill,

  // Health
  [OrgLocationFeature.DAILY_SANITIZATION]: Droplets, // Using Droplets as alternative for spray
  [OrgLocationFeature.NUTRITIOUS_MEALS]: AppleIcon,
  [OrgLocationFeature.PARENT_PROVIDES_MEALS]: Sandwich,
  [OrgLocationFeature.SICK_CHILD_POLICY]: Stethoscope,
  [OrgLocationFeature.VACCINATION_REQUIRED]: Syringe,
  [OrgLocationFeature.HYGIENE_PRACTICES]: Heart, // Using Heart as alternative for soap

  // Staff
  [OrgLocationFeature.CERTIFIED_TEACHERS]: Award,
  [OrgLocationFeature.DAILY_UPDATES_TO_PARENTS]: Bell,
  [OrgLocationFeature.OPEN_DOOR_POLICY]: DoorOpen,
  [OrgLocationFeature.PARENT_ORIENTATION]: Users,
  [OrgLocationFeature.STAFF_BACKGROUND_CHECKED]: UserCheck,

  // Culture
  [OrgLocationFeature.BIRTHDAY_CELEBRATIONS]: PartyPopper,
  [OrgLocationFeature.HOLIDAY_EVENTS]: Calendar,
  [OrgLocationFeature.PHOTO_CONSENT_POLICY]: Camera,
  [OrgLocationFeature.FIELD_TRIPS]: MapPin,
  [OrgLocationFeature.GRADUATION_CEREMONY]: GraduationCapIcon,

  // Media
  [OrgLocationFeature.HAS_FRONT_IMAGE]: Image,
  [OrgLocationFeature.HAS_PLAYGROUND_IMAGE]: ImageIcon,
  [OrgLocationFeature.HAS_CLASSROOM_IMAGE]: ImageIcon2,
  [OrgLocationFeature.HAS_TEACHER_IMAGE]: ImageIcon3,
};

// Feature labels
const FEATURE_LABELS: Record<OrgLocationFeature, string> = {
  // Safety
  [OrgLocationFeature.GATED_PREMISES]: "Gated Premises",
  [OrgLocationFeature.SECURE_DROPOFF]: "Secure Drop-off",
  [OrgLocationFeature.CCTV_MONITORING]: "CCTV Monitoring",
  [OrgLocationFeature.EMERGENCY_TRAINING]: "Emergency Training",
  [OrgLocationFeature.CONTROLLED_ACCESS]: "Controlled Access",
  [OrgLocationFeature.FIRE_EXTINGUISHERS]: "Fire Extinguishers",
  [OrgLocationFeature.FIRST_AID_KIT]: "First Aid Kit",

  // Accessibility
  [OrgLocationFeature.ONSITE_PARKING]: "On-site Parking",
  [OrgLocationFeature.DROPOFF_LANE]: "Drop-off Lane",
  [OrgLocationFeature.WHEELCHAIR_ACCESSIBLE]: "Wheelchair Accessible",
  [OrgLocationFeature.LANDMARK_LOCATION]: "Landmark Location",
  [OrgLocationFeature.PUBLIC_TRANSPORT_NEARBY]: "Public Transport Nearby",

  // Environment
  [OrgLocationFeature.AIR_CONDITIONED]: "Air Conditioned",
  [OrgLocationFeature.CLEAN_BATHROOMS]: "Clean Bathrooms",
  [OrgLocationFeature.CHILD_FURNITURE]: "Child-Sized Furniture",
  [OrgLocationFeature.DEDICATED_PLAY_AREA]: "Dedicated Play Area",
  [OrgLocationFeature.READING_CORNER]: "Reading Corner",
  [OrgLocationFeature.LEARNING_STATIONS]: "Learning Stations",
  [OrgLocationFeature.NAP_AREA]: "Nap Area",

  // Health
  [OrgLocationFeature.DAILY_SANITIZATION]: "Daily Sanitization",
  [OrgLocationFeature.NUTRITIOUS_MEALS]: "Nutritious Meals",
  [OrgLocationFeature.PARENT_PROVIDES_MEALS]: "Parent Provides Meals",
  [OrgLocationFeature.SICK_CHILD_POLICY]: "Sick Child Policy",
  [OrgLocationFeature.VACCINATION_REQUIRED]: "Vaccination Required",
  [OrgLocationFeature.HYGIENE_PRACTICES]: "Hygiene Practices",

  // Staff
  [OrgLocationFeature.CERTIFIED_TEACHERS]: "Certified Teachers",
  [OrgLocationFeature.DAILY_UPDATES_TO_PARENTS]: "Daily Updates to Parents",
  [OrgLocationFeature.OPEN_DOOR_POLICY]: "Open Door Policy",
  [OrgLocationFeature.PARENT_ORIENTATION]: "Parent Orientation",
  [OrgLocationFeature.STAFF_BACKGROUND_CHECKED]: "Staff Background Checked",

  // Culture
  [OrgLocationFeature.BIRTHDAY_CELEBRATIONS]: "Birthday Celebrations",
  [OrgLocationFeature.HOLIDAY_EVENTS]: "Holiday Events",
  [OrgLocationFeature.PHOTO_CONSENT_POLICY]: "Photo Consent Policy",
  [OrgLocationFeature.FIELD_TRIPS]: "Field Trips",
  [OrgLocationFeature.GRADUATION_CEREMONY]: "Graduation Ceremony",

  // Media
  [OrgLocationFeature.HAS_FRONT_IMAGE]: "Front Image Available",
  [OrgLocationFeature.HAS_PLAYGROUND_IMAGE]: "Playground Image Available",
  [OrgLocationFeature.HAS_CLASSROOM_IMAGE]: "Classroom Image Available",
  [OrgLocationFeature.HAS_TEACHER_IMAGE]: "Teacher Image Available",
};

export function LocationFeaturesSection({
  orgInstance,
  program,
}: LocationFeaturesSectionProps) {
  const { locations } = orgInstance.org;

  // Find the primary location
  const primaryLocation = locations.find((location) => location.isPrimary);

  if (!primaryLocation?.features || primaryLocation.features.length === 0) {
    return null;
  }

  // Get all features
  const allFeatures = primaryLocation.features;
  const firstFiveFeatures = allFeatures.slice(0, 5);
  const hasMoreFeatures = allFeatures.length > 5;

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground">
            Your Learning Space
          </h2>
        </div>
        <div className="space-y-2">
          {/* Show first 5 features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firstFiveFeatures.map((feature) => {
              const Icon = FEATURE_ICONS[feature];
              return (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-lg"
                >
                  <div className="shrink-0 w-8 h-8 bg-default-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-default-600" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {FEATURE_LABELS[feature]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {hasMoreFeatures && (
          <div className="pt-4">
            <Button
              variant="flat"
              color="default"
              fullWidth
              href={`/programs/${program.slug}/location-features`}
              as={Link}
            >
              Show all {allFeatures.length} features
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
