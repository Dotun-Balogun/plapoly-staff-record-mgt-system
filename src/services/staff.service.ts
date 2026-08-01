import { createClient } from "@/lib/supabase/client";
import type { StaffFormValues } from "@/schemas/staff.schema";
import type { StaffWithRelations } from "@/types";

const STAFF_SELECT = `
  *,
  department:departments ( id, name ),
  position:positions ( id, title )
`;

export async function listStaff(params?: {
  search?: string;
  departmentId?: string;
  status?: string;
}): Promise<StaffWithRelations[]> {
  const supabase = createClient();
  let query = supabase.from("staff").select(STAFF_SELECT).order("last_name");

  if (params?.search) {
    query = query.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,staff_id.ilike.%${params.search}%,email.ilike.%${params.search}%`
    );
  }
  if (params?.departmentId) {
    query = query.eq("department_id", params.departmentId);
  }
  if (params?.status) {
    query = query.eq("employment_status", params.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as StaffWithRelations[];
}

export async function getStaffById(id: string): Promise<StaffWithRelations> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff")
    .select(STAFF_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as StaffWithRelations;
}

export async function getStaffByProfileId(
  profileId: string
): Promise<StaffWithRelations | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff")
    .select(STAFF_SELECT)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as StaffWithRelations | null;
}

/** Admin-only direct create (bypasses the approval workflow). */
export async function createStaff(values: StaffFormValues) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff")
    .insert({
      ...values,
      department_id: values.department_id || null,
      position_id: values.position_id || null,
      date_of_birth: values.date_of_birth || null,
      date_employed: values.date_employed || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Admin-only direct update (bypasses the approval workflow). */
export async function updateStaff(id: string, values: Partial<StaffFormValues>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff")
    .update({
      ...values,
      department_id: values.department_id || null,
      position_id: values.position_id || null,
      date_of_birth: values.date_of_birth || null,
      date_employed: values.date_employed || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStaff(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("staff").delete().eq("id", id);
  if (error) throw error;
}
