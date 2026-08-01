import { createClient } from "@/lib/supabase/client";
import type { PositionFormValues } from "@/schemas/position.schema";
import type { Position } from "@/types";

export async function listPositions(): Promise<Position[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .order("title");
  if (error) throw error;
  return (data ?? []) as Position[];
}

export async function createPosition(values: PositionFormValues) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("positions")
    .insert(values)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePosition(id: string, values: PositionFormValues) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("positions")
    .update(values)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePosition(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("positions").delete().eq("id", id);
  if (error) throw error;
}
