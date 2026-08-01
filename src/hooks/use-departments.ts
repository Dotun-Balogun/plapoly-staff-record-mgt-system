import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDepartment,
  deleteDepartment,
  listDepartments,
  updateDepartment,
} from "@/services/departments.service";
import type { DepartmentFormValues } from "@/schemas/department.schema";

const key = ["departments"] as const;

export function useDepartments() {
  return useQuery({ queryKey: key, queryFn: listDepartments });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: DepartmentFormValues) => createDepartment(values),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateDepartment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: DepartmentFormValues) => updateDepartment(id, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
