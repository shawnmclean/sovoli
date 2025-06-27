import type { LucideIcon } from "lucide-react";
import {
  ShieldCheckIcon, // 🛡️ Safety & Legitimacy
  MessageCircleIcon, // 💬 Communication
  GlobeIcon, // 🖥️ Digital Readiness
  BarChartIcon, // 📊 Transparency
  FileTextIcon, // 📄 Enrollment Experience
  InfoIcon, // ℹ️ Fallback
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
