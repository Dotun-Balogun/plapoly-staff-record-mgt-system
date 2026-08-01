export const APP_NAME = "SRMS";
export const APP_FULL_NAME = "Staff Record Management System";
export const INSTITUTION_NAME = "Plateau State Polytechnic";

export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
} as const;

export const EMPLOYMENT_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  on_leave: "On Leave",
  suspended: "Suspended",
  retired: "Retired",
  terminated: "Terminated",
};

export const EMPLOYMENT_STATUS_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  active: "success",
  on_leave: "warning",
  suspended: "destructive",
  retired: "secondary",
  terminated: "destructive",
};

export const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

export const SUBMISSION_STATUS_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  draft: "outline",
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

export type NavItem = {
  label: string;
  href: string;
  icon: string; // lucide icon name, resolved in the sidebar component
};

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Staff Records", href: "/staff", icon: "Users" },
  { label: "Departments", href: "/departments", icon: "Building2" },
  { label: "Positions", href: "/positions", icon: "BadgeCheck" },
  { label: "Pending Approvals", href: "/approvals", icon: "ClipboardList" },
  { label: "Reports", href: "/reports", icon: "BarChart3" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

export const STAFF_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Profile", href: "/profile", icon: "UserCircle" },
  { label: "Submit Record", href: "/submit", icon: "FileEdit" },
  { label: "My Submissions", href: "/submissions", icon: "ClipboardList" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];
