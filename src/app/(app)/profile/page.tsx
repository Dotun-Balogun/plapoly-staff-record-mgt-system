"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Calendar, Building2, BadgeCheck } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStaffByProfile } from "@/hooks/use-staff";
import { EMPLOYMENT_STATUS_BADGE_VARIANT, EMPLOYMENT_STATUS_LABELS } from "@/constants";

export default function MyProfilePage() {
  const { profile } = useCurrentUser();
  const { data: staff, isLoading } = useStaffByProfile(profile?.id);

  return (
    <>
      <PageHeader title="My Profile" description="Your staff record on file." />

      {isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : !staff ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">
              Your account isn&apos;t linked to a staff record yet.
            </p>
            <Button asChild>
              <Link href="/submit">Submit my record</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
              <Avatar className="size-20">
                <AvatarFallback className="text-xl">
                  {staff.first_name[0]}
                  {staff.last_name[0]}
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
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/submit">Request a change</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailRow icon={Mail} label="Email" value={staff.email} />
              <DetailRow icon={Phone} label="Phone" value={staff.phone ?? "—"} />
              <DetailRow icon={Building2} label="Department" value={staff.department?.name ?? "—"} />
              <DetailRow icon={BadgeCheck} label="Position" value={staff.position?.title ?? "—"} />
              <DetailRow icon={Calendar} label="Date employed" value={staff.date_employed ?? "—"} />
              <DetailRow icon={MapPin} label="Address" value={staff.address ?? "—"} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
