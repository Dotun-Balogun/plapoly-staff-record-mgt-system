import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStaff,
  deleteStaff,
  getStaffById,
  getStaffByProfileId,
  listStaff,
  updateStaff,
} from "@/services/staff.service";
import type { StaffFormValues } from "@/schemas/staff.schema";

const staffKeys = {
  all: ["staff"] as const,
  list: (filters?: Record<string, unknown>) => [...staffKeys.all, "list", filters] as const,
  detail: (id: string) => [...staffKeys.all, "detail", id] as const,
  byProfile: (profileId: string) => [...staffKeys.all, "profile", profileId] as const,
};

export function useStaffList(filters?: {
  search?: string;
  departmentId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: staffKeys.list(filters),
    queryFn: () => listStaff(filters),
  });
}

export function useStaffDetail(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => getStaffById(id),
    enabled: !!id,
  });
}

export function useStaffByProfile(profileId: string | undefined) {
  return useQuery({
    queryKey: staffKeys.byProfile(profileId ?? ""),
    queryFn: () => getStaffByProfileId(profileId!),
    enabled: !!profileId,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: StaffFormValues) => createStaff(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
}

export function useUpdateStaff(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<StaffFormValues>) => updateStaff(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
}
