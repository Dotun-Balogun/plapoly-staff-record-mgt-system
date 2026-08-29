import { createClient } from "@/lib/supabase/client";

const STAFF_PHOTOS_BUCKET = "staff-photos";

/**
 * Uploads a staff photo to the `staff-photos` Storage bucket and returns its
 * public URL. Pass a stable folder id (the staff record's UUID, or "new" for
 * records that don't have one yet) so re-uploads don't pile up.
 */
export async function uploadStaffPhoto(file: File, folderId: string): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const filePath = `${folderId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(STAFF_PHOTOS_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(STAFF_PHOTOS_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}