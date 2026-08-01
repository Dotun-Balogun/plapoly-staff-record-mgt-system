import { createClient } from "@/lib/supabase/client";
import type { DepartmentFormValues } from "@/schemas/department.schema";
import type { Department } from "@/types";

export async function listDepartments(): Promise<Department[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Department[];
}

export async function createDepartment(values: DepartmentFormValues) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("departments")
    .insert({ ...values, code: values.code || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDepartment(id: string, values: DepartmentFormValues) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("departments")
    .update({ ...values, code: values.code || null })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDepartment(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("departments").delete().eq("id", id);
  if (error) throw error;
}
