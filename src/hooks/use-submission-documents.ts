import { useQuery } from "@tanstack/react-query";

import { listSubmissionDocuments } from "@/services/documents.service";

export function useSubmissionDocuments(submissionId: string | undefined) {
  return useQuery({
    queryKey: ["submission-documents", submissionId],
    queryFn: () => listSubmissionDocuments(submissionId!),
    enabled: !!submissionId,
  });
}