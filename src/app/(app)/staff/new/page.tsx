"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StaffForm } from "@/features/staff/staff-form";
import { useCreateStaff } from "@/hooks/use-staff";
import type { StaffFormValues } from "@/schemas/staff.schema";

export default function NewStaffPage() {
  const router = useRouter();
  const createStaff = useCreateStaff();

  async function handleSubmit(values: StaffFormValues) {
    try {
      const staff = await createStaff.mutateAsync(values);
      toast.success("Staff record created");
      router.push(`/staff/${staff.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create staff record");
    }
  }

  return (
    <>
      <PageHeader title="Add Staff" description="Create a new staff record directly." />
      <Card>
        <CardContent className="pt-6">
          <StaffForm onSubmit={handleSubmit} isSubmitting={createStaff.isPending} submitLabel="Create staff record" />
        </CardContent>
      </Card>
    </>
  );
}
