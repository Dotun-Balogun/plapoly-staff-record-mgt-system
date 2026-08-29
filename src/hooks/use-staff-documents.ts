import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteStaffDocument,
  listStaffDocuments,
  uploadStaffDocument,
  type StaffDocument,
} from "@/services/documents.service";

const key = (staffId: string) => ["staff-documents", staffId] as const;

export function useStaffDocuments(staffId: string | undefined) {
  return useQuery({
    queryKey: key(staffId ?? ""),
    queryFn: () => listStaffDocuments(staffId!),
    enabled: !!staffId,
  });
}

export function useUploadStaffDocument(staffId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { file: File; documentType: string; uploadedBy: string }) =>
      uploadStaffDocument({ ...args, staffId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(staffId) }),
  });
}

export function useDeleteStaffDocument(staffId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (doc: StaffDocument) => deleteStaffDocument(doc),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(staffId) }),
  });
}