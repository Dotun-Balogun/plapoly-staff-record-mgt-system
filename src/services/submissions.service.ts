import { createClient } from "@/lib/supabase/client";
import type { SubmissionWithRelations } from "@/types";

const SUBMISSION_SELECT = `
  *,
  submitted_by_profile:profiles!staff_submissions_submitted_by_fkey ( id, full_name, email )
`;

export async function listSubmissions(status?: string) {
  const supabase = createClient();
  let query = supabase
    .from("staff_submissions")
    .select(SUBMISSION_SELECT)
    .order("submitted_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as SubmissionWithRelations[];
}

export async function listMySubmissions(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff_submissions")
    .select("*")
    .eq("submitted_by", userId)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as import("@/types").StaffSubmission[];
}

export async function createSubmission(payload: {
  staff_id?: string | null;
  submitted_by: string;
  payload: Record<string, unknown>;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff_submissions")
    .insert({
      staff_id: payload.staff_id ?? null,
      submitted_by: payload.submitted_by,
      payload: payload.payload,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Approves a submission via the `approve_staff_submission` RPC (see migrations). */
export async function approveSubmission(
  submissionId: string,
  reviewerId: string,
  notes?: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("approve_staff_submission", {
    submission_id: submissionId,
    reviewer_id: reviewerId,
    notes: notes ?? null,
  });
  if (error) throw error;
  return data;
}

export async function rejectSubmission(
  submissionId: string,
  reviewerId: string,
  notes?: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff_submissions")
    .update({
      status: "rejected",
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      review_notes: notes ?? null,
    })
    .eq("id", submissionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
