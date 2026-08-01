import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveSubmission,
  createSubmission,
  listMySubmissions,
  listSubmissions,
  rejectSubmission,
} from "@/services/submissions.service";

const key = ["submissions"] as const;

export function useSubmissions(status?: string) {
  return useQuery({
    queryKey: [...key, status],
    queryFn: () => listSubmissions(status),
  });
}

export function useMySubmissions(userId: string | undefined) {
  return useQuery({
    queryKey: [...key, "mine", userId],
    queryFn: () => listMySubmissions(userId!),
    enabled: !!userId,
  });
}

export function useCreateSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSubmission,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useApproveSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      reviewerId,
      notes,
    }: {
      submissionId: string;
      reviewerId: string;
      notes?: string;
    }) => approveSubmission(submissionId, reviewerId, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useRejectSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      reviewerId,
      notes,
    }: {
      submissionId: string;
      reviewerId: string;
      notes?: string;
    }) => rejectSubmission(submissionId, reviewerId, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
