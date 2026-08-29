import { createClient } from "@/lib/supabase/client";

const DOCUMENTS_BUCKET = "staff-documents";

export type StaffDocument = {
  id: string;
  staff_id: string | null;
  submission_id: string | null;
  uploaded_by: string | null;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
};

export async function listStaffDocuments(staffId: string): Promise<StaffDocument[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff_documents")
    .select("*")
    .eq("staff_id", staffId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StaffDocument[];
}

export async function listSubmissionDocuments(submissionId: string): Promise<StaffDocument[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff_documents")
    .select("*")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StaffDocument[];
}

export async function uploadStaffDocument({
  file,
  staffId,
  documentType,
  uploadedBy,
}: {
  file: File;
  staffId: string;
  documentType: string;
  uploadedBy: string;
}) {
  const supabase = createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filePath = `staff/${staffId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("staff_documents")
    .insert({
      staff_id: staffId,
      uploaded_by: uploadedBy,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
    })
    .select()
    .single();

  if (error) throw error;
  return data as StaffDocument;
}

/** Uploads a document attached to a pending submission rather than a finalized staff record. */
export async function uploadSubmissionDocument({
  file,
  submissionId,
  documentType,
  uploadedBy,
}: {
  file: File;
  submissionId: string;
  documentType: string;
  uploadedBy: string;
}) {
  const supabase = createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filePath = `submissions/${submissionId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("staff_documents")
    .insert({
      submission_id: submissionId,
      uploaded_by: uploadedBy,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
    })
    .select()
    .single();

  if (error) throw error;
  return data as StaffDocument;
}

export async function getDocumentDownloadUrl(filePath: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(filePath, 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteStaffDocument(doc: StaffDocument) {
  const supabase = createClient();
  const { error: storageError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .remove([doc.file_path]);
  if (storageError) throw storageError;

  const { error } = await supabase.from("staff_documents").delete().eq("id", doc.id);
  if (error) throw error;
}