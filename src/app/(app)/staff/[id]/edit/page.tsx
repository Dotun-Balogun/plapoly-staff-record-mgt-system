"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffForm } from "@/features/staff/staff-form";
import { useStaffDetail, useUpdateStaff } from "@/hooks/use-staff";
import type { StaffFormValues } from "@/schemas/staff.schema";

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: staff, isLoading } = useStaffDetail(id);
  const updateStaff = useUpdateStaff(id);

  async function handleSubmit(values: StaffFormValues) {
    try {
      await updateStaff.mutateAsync(values);
      toast.success("Staff record updated");
      router.push(`/staff/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update staff record");
    }
  }

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!staff) return <p className="text-muted-foreground">Staff record not found.</p>;

  return (
    <>
      <PageHeader title={`Edit ${staff.first_name} ${staff.last_name}`} />
      <Card>
        <CardContent className="pt-6">
          <StaffForm
            defaultValues={{
              staff_id: staff.staff_id,
              first_name: staff.first_name,
              last_name: staff.last_name,
              other_names: staff.other_names ?? "",
              email: staff.email,
              phone: staff.phone ?? "",
              date_of_birth: staff.date_of_birth ?? "",
              gender: staff.gender ?? "",
              address: staff.address ?? "",
              department_id: staff.department_id ?? "",
              position_id: staff.position_id ?? "",
              employment_status: staff.employment_status,
              date_employed: staff.date_employed ?? "",
            }}
            onSubmit={handleSubmit}
            isSubmitting={updateStaff.isPending}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </>
  );
}
