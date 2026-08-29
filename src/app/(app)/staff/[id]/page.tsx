"use client";

import { use } from "react";
import Link from "next/link";
import { Pencil, Mail, Phone, MapPin, Calendar, Building2, BadgeCheck } from "lucide-react";
import { StaffDocuments } from "@/components/shared/staff-documents";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStaffDetail } from "@/hooks/use-staff";
import { EMPLOYMENT_STATUS_BADGE_VARIANT, EMPLOYMENT_STATUS_LABELS } from "@/constants";

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: staff, isLoading } = useStaffDetail(id);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!staff) {
    return <p className="text-muted-foreground">Staff record not found.</p>;
  }

  return (
    <>
      <PageHeader
        title="Staff Profile"
        actions={
          <Button asChild>
            <Link href={`/staff/${id}/edit`}>
              <Pencil className="size-4" /> Edit
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="text-xl">
                {initials(staff.first_name, staff.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">
                {staff.first_name} {staff.last_name}
              </h2>
              <p className="text-sm text-muted-foreground">{staff.position?.title ?? "No position set"}</p>
            </div>
            <Badge variant={EMPLOYMENT_STATUS_BADGE_VARIANT[staff.employment_status]}>
              {EMPLOYMENT_STATUS_LABELS[staff.employment_status]}
            </Badge>
            <p className="text-xs text-muted-foreground">Staff ID: {staff.staff_id}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact & Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailRow icon={Mail} label="Email" value={staff.email} />
            <DetailRow icon={Phone} label="Phone" value={staff.phone ?? "—"} />
            <DetailRow icon={Building2} label="Department" value={staff.department?.name ?? "—"} />
            <DetailRow icon={BadgeCheck} label="Position" value={staff.position?.title ?? "—"} />
            <DetailRow icon={Calendar} label="Date employed" value={staff.date_employed ?? "—"} />
            <DetailRow icon={Calendar} label="Date of birth" value={staff.date_of_birth ?? "—"} />
            <DetailRow icon={MapPin} label="Address" value={staff.address ?? "—"} className="sm:col-span-2" />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
  <StaffDocuments staffId={id} />
</div>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
