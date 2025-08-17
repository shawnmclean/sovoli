import {
  StarIcon,
  GraduationCapIcon,
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  BadgeCheckIcon,
  ScissorsIcon,
  ShoppingBagIcon,
  HammerIcon,
  WrenchIcon,
  BabyIcon,
  PaletteIcon,
  SchoolIcon,
  ShieldCheckIcon,
  MapPinIcon,
  SmileIcon,
  MessageCircleIcon,
} from "lucide-react";
import type { Program } from "~/modules/academics/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";

interface ProgramHighlightsSectionProps {
  program: Program;
}

export const ProgramHighlightIconMap = {
  "graduation-cap": GraduationCapIcon,
  users: UsersIcon,
  user: UserIcon,
  "book-open": BookOpenIcon,
  clock: ClockIcon,
  star: StarIcon,
  "badge-check": BadgeCheckIcon,
  scissors: ScissorsIcon,
  "shopping-bag": ShoppingBagIcon,
  hammer: HammerIcon,
  tool: WrenchIcon,
  baby: BabyIcon,
  palette: PaletteIcon,
  school: SchoolIcon,
  "shield-check": ShieldCheckIcon,
  "map-pin": MapPinIcon,
  smile: SmileIcon,
  "message-circle": MessageCircleIcon,
};

export function ProgramHighlightsSection({
  program,
}: ProgramHighlightsSectionProps) {
  // If no highlights are defined, don't render the component
  if (!program.highlights || program.highlights.length === 0) {
    return null;
  }

  const getIconColor = (index: number) => {
    const colors = ["primary", "secondary", "success", "warning"];
    return colors[index % colors.length];
  };

  return (
    <ProgramSectionsWrapper program={program}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {program.highlights.map((highlight, index) => {
          const IconComponent = ProgramHighlightIconMap[highlight.icon];
          const color = getIconColor(index);

          return (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}
              >
                <IconComponent className={`h-4 w-4 text-${color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-0.5">
                  {highlight.label}
                </h3>
                <p className="text-xs text-foreground-600">
                  {highlight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ProgramSectionsWrapper>
  );
}
