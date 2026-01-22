import type { LucideIcon } from "lucide-react";
import {
  BarChartIcon, // 📊 Transparency
  FileTextIcon, // 📄 Enrollment Experience
  GlobeIcon, // 🖥️ Digital Readiness
  InfoIcon, // ℹ️ Fallback
  MessageCircleIcon, // 💬 Communication
  ShieldCheckIcon, // 🛡️ Safety & Legitimacy
} from "lucide-react";

export const groupIconMap: Record<string, LucideIcon> = {
  safety: ShieldCheckIcon,
  communication: MessageCircleIcon,
  digital: GlobeIcon,
  transparency: BarChartIcon,
  enrollment: FileTextIcon,
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
