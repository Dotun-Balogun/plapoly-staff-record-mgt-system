import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPosition,
  deletePosition,
  listPositions,
  updatePosition,
} from "@/services/positions.service";
import type { PositionFormValues } from "@/schemas/position.schema";

const key = ["positions"] as const;

export function usePositions() {
  return useQuery({ queryKey: key, queryFn: listPositions });
}

export function useCreatePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: PositionFormValues) => createPosition(values),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdatePosition(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: PositionFormValues) => updatePosition(id, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeletePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePosition(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
