import {
  LayoutDashboard,
  Users,
  Building2,
  BadgeCheck,
  ClipboardList,
  BarChart3,
  Settings,
  UserCircle,
  FileEdit,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Building2,
  BadgeCheck,
  ClipboardList,
  BarChart3,
  Settings,
  UserCircle,
  FileEdit,
};

export function NavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? LayoutDashboard;
  return <Icon className={className} />;
}
