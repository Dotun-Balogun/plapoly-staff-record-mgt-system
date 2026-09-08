"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffForm } from "@/features/staff/staff-form";
import {
  SubmissionDocumentsPicker,
  type PendingDocument,
} from "@/components/shared/submission-documents-picker";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStaffByProfile } from "@/hooks/use-staff";
import { useCreateSubmission } from "@/hooks/use-submissions";
import { uploadSubmissionDocument } from "@/services/documents.service";
import type { StaffFormValues } from "@/schemas/staff.schema";

export default function SubmitRecordPage() {
  const router = useRouter();
  const { profile, isLoading: userLoading } = useCurrentUser();
  const { data: existingStaff, isLoading: staffLoading } = useStaffByProfile(profile?.id);
  const createSubmission = useCreateSubmission();
  const [pendingDocs, setPendingDocs] = useState<PendingDocument[]>([]);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);

  async function handleSubmit(values: StaffFormValues) {
    if (!profile) return;
    try {
      const submission = await createSubmission.mutateAsync({
        staff_id: existingStaff?.id ?? null,
        submitted_by: profile.id,
        payload: values,
      });

      if (pendingDocs.length > 0) {
        setIsUploadingDocs(true);
        for (const { file, documentType } of pendingDocs) {
          await uploadSubmissionDocument({
            file,
            submissionId: submission.id,
            documentType,
            uploadedBy: profile.id,
          });
        }
        setIsUploadingDocs(false);
      }

      toast.success("Submitted for approval");
      router.push("/submissions");
    } catch (error) {
      setIsUploadingDocs(false);
      toast.error(error instanceof Error ? error.message : "Could not submit record");
    }
  }

  const isLoading = userLoading || staffLoading;
  const isSubmitting = createSubmission.isPending || isUploadingDocs;

  return (
    <>
      <PageHeader
        title={existingStaff ? "Submit a Change" : "Submit My Record"}
        description="Your submission will be reviewed by an administrator before it takes effect."
      />
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <StaffForm
                defaultValues={
                  existingStaff
                    ? {
                        staff_id: existingStaff.staff_id,
                        first_name: existingStaff.first_name,
                        last_name: existingStaff.last_name,
                        other_names: existingStaff.other_names ?? "",
                        email: existingStaff.email,
                        phone: existingStaff.phone ?? "",
                        date_of_birth: existingStaff.date_of_birth ?? "",
                        gender: existingStaff.gender ?? "",
                        address: existingStaff.address ?? "",
                        department_id: existingStaff.department_id ?? "",
                        position_id: existingStaff.position_id ?? "",
                        employment_status: existingStaff.employment_status,
                        date_employed: existingStaff.date_employed ?? "",
                        photo_url: existingStaff.photo_url ?? "",
                      }
                    : {
                        email: profile?.email ?? "",
                        first_name: profile?.full_name?.split(" ")[0] ?? "",
                        last_name: profile?.full_name?.split(" ").slice(1).join(" ") ?? "",
                      }
                }
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel={isUploadingDocs ? "Uploading documents..." : "Submit for approval"}
                photoFolderId={existingStaff?.id ?? "new"}
              />
            )}
          </CardContent>
        </Card>

        {!isLoading && (
          <SubmissionDocumentsPicker
            files={pendingDocs}
            onChange={setPendingDocs}
            isUploading={isSubmitting}
          />
        )}
      </div>
    </>
  );
}