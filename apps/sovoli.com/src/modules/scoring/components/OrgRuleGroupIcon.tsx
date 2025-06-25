import type { LucideIcon } from "lucide-react";
import {
  ShieldCheckIcon,
  BarChartIcon,
  MessageCircleIcon,
  FileTextIcon,
  ServerCogIcon,
  InfoIcon,
} from "lucide-react";

export const groupIconMap: Record<string, LucideIcon> = {
  visibility: ShieldCheckIcon,
  transparency: BarChartIcon,
  communication: MessageCircleIcon,
  enrollment: FileTextIcon,
  systems: ServerCogIcon,
} as const;

export interface OrgRuleGroupIconProps {
  groupKey: string;
  className?: string;
}

export function OrgRuleGroupIcon({
  groupKey,
  className,
}: OrgRuleGroupIconProps) {
  const Icon = groupIconMap[groupKey] ?? InfoIcon;
  return <Icon className={className} />;
}
