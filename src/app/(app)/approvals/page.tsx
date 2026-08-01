"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  useApproveSubmission,
  useRejectSubmission,
  useSubmissions,
} from "@/hooks/use-submissions";
import { SUBMISSION_STATUS_BADGE_VARIANT, SUBMISSION_STATUS_LABELS } from "@/constants";
import type { SubmissionWithRelations } from "@/types";

function PayloadPreview({ payload }: { payload: Record<string, unknown> }) {
  const entries = Object.entries(payload).filter(([, v]) => v !== null && v !== "");
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
      {entries.map(([key, value]) => (
        <div key={key} className="contents">
          <dt className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</dt>
          <dd className="truncate">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function SubmissionCard({
  submission,
  reviewerId,
}: {
  submission: SubmissionWithRelations;
  reviewerId: string;
}) {
  const approve = useApproveSubmission();
  const reject = useRejectSubmission();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [notes, setNotes] = useState("");

  async function handleApprove() {
    try {
      await approve.mutateAsync({ submissionId: submission.id, reviewerId });
      toast.success("Submission approved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not approve submission");
    }
  }

  async function handleReject() {
    try {
      await reject.mutateAsync({ submissionId: submission.id, reviewerId, notes });
      toast.success("Submission rejected");
      setRejectOpen(false);
    } catch {
      toast.error("Could not reject submission");
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            {submission.submitted_by_profile?.full_name ?? "Unknown submitter"}
          </CardTitle>
          <CardDescription>
            {submission.submitted_by_profile?.email} ·{" "}
            {new Date(submission.submitted_at).toLocaleString()}
          </CardDescription>
        </div>
        <Badge variant={SUBMISSION_STATUS_BADGE_VARIANT[submission.status]}>
          {SUBMISSION_STATUS_LABELS[submission.status]}
        </Badge>
      </CardHeader>
      <CardContent>
        <PayloadPreview payload={submission.payload as Record<string, unknown>} />
        {submission.status === "pending" && (
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleApprove} disabled={approve.isPending}>
              <Check className="size-4" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => setRejectOpen(true)}>
              <X className="size-4" /> Reject
            </Button>
          </div>
        )}
        {submission.review_notes && (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-medium">Review note:</span> {submission.review_notes}
          </p>
        )}
      </CardContent>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject submission</DialogTitle>
            <DialogDescription>
              Optionally explain why this submission is being rejected.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Reason (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <DialogFooter>
            <Button variant="destructive" onClick={handleReject} disabled={reject.isPending}>
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function ApprovalsPage() {
  const { profile } = useCurrentUser();
  const { data: pending, isLoading: pendingLoading } = useSubmissions("pending");
  const { data: all, isLoading: allLoading } = useSubmissions();

  return (
    <>
      <PageHeader
        title="Pending Approvals"
        description="Review staff-submitted records and changes before they take effect."
      />

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="all">All submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {pendingLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : pending && pending.length > 0 ? (
            pending.map((s) => (
              <SubmissionCard key={s.id} submission={s} reviewerId={profile?.id ?? ""} />
            ))
          ) : (
            <p className="py-10 text-center text-muted-foreground">
              No pending submissions. You&apos;re all caught up.
            </p>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4 space-y-4">
          {allLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : all && all.length > 0 ? (
            all.map((s) => (
              <SubmissionCard key={s.id} submission={s} reviewerId={profile?.id ?? ""} />
            ))
          ) : (
            <p className="py-10 text-center text-muted-foreground">No submissions yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
