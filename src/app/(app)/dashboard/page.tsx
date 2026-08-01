"use client";

import Link from "next/link";
import { Users, Building2, ClipboardList, BadgeCheck } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStaffList } from "@/hooks/use-staff";
import { useDepartments } from "@/hooks/use-departments";
import { useSubmissions } from "@/hooks/use-submissions";
import { useStaffByProfile } from "@/hooks/use-staff";
import { useMySubmissions } from "@/hooks/use-submissions";

function StatCard({
  icon: Icon,
  label,
  value,
  isLoading,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  isLoading?: boolean;
  href?: string;
}) {
  const content = (
    <Card className="transition-colors hover:border-primary/40">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <CardTitle className="text-3xl">{value}</CardTitle>
        )}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function AdminDashboard() {
  const { data: staff, isLoading: staffLoading } = useStaffList();
  const { data: departments, isLoading: deptLoading } = useDepartments();
  const { data: pending, isLoading: pendingLoading } = useSubmissions("pending");

  return (
    <>
      <PageHeader
        title="Administrator Dashboard"
        description="Overview of staff records, departments, and pending approvals."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Staff" value={staff?.length ?? 0} isLoading={staffLoading} href="/staff" />
        <StatCard icon={Building2} label="Departments" value={departments?.length ?? 0} isLoading={deptLoading} href="/departments" />
        <StatCard icon={ClipboardList} label="Pending Approvals" value={pending?.length ?? 0} isLoading={pendingLoading} href="/approvals" />
        <StatCard
          icon={BadgeCheck}
          label="Active Staff"
          value={staff?.filter((s) => s.employment_status === "active").length ?? 0}
          isLoading={staffLoading}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recently added staff</CardTitle>
          <CardDescription>The latest records added to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {staffLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : staff && staff.length > 0 ? (
            <ul className="divide-y">
              {staff.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="font-medium">
                    {s.first_name} {s.last_name}
                  </span>
                  <span className="text-muted-foreground">{s.department?.name ?? "—"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No staff records yet.</p>
          )}
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/staff">View all staff</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function StaffDashboard() {
  const { profile } = useCurrentUser();
  const { data: myRecord, isLoading: recordLoading } = useStaffByProfile(profile?.id);
  const { data: mySubmissions, isLoading: subLoading } = useMySubmissions(profile?.id);

  const pendingCount = mySubmissions?.filter((s) => s.status === "pending").length ?? 0;

  return (
    <>
      <PageHeader
        title={`Welcome, ${profile?.full_name?.split(" ")[0] ?? ""}`}
        description="Here's a summary of your staff profile and submissions."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={BadgeCheck}
          label="Profile Status"
          value={myRecord ? "Linked" : "Not Linked"}
          isLoading={recordLoading}
          href="/profile"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Submissions"
          value={pendingCount}
          isLoading={subLoading}
          href="/submissions"
        />
      </div>

      {!recordLoading && !myRecord && (
        <Card className="mt-6 border-dashed">
          <CardHeader>
            <CardTitle>Complete your profile</CardTitle>
            <CardDescription>
              Your account isn&apos;t yet linked to a staff record. Submit your details
              for an administrator to review and approve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/submit">Submit my record</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default function DashboardPage() {
  const { isAdmin, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return isAdmin ? <AdminDashboard /> : <StaffDashboard />;
}
