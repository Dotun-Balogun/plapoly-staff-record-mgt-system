"use client";

import Link from "next/link";
import { FileEdit } from "lucide-react";

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
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMySubmissions } from "@/hooks/use-submissions";
import { SUBMISSION_STATUS_BADGE_VARIANT, SUBMISSION_STATUS_LABELS } from "@/constants";

export default function MySubmissionsPage() {
  const { profile } = useCurrentUser();
  const { data: submissions, isLoading } = useMySubmissions(profile?.id);

  return (
    <>
      <PageHeader
        title="My Submissions"
        description="Track the status of records and changes you've submitted."
        actions={
          <Button asChild>
            <Link href="/submit">
              <FileEdit className="size-4" /> New submission
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : submissions && submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((s) => {
            const payload = s.payload as Record<string, unknown>;
            return (
              <Card key={s.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">
                      {String(payload.first_name ?? "")} {String(payload.last_name ?? "")}
                    </CardTitle>
                    <CardDescription>
                      Submitted {new Date(s.submitted_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Badge variant={SUBMISSION_STATUS_BADGE_VARIANT[s.status]}>
                    {SUBMISSION_STATUS_LABELS[s.status]}
                  </Badge>
                </CardHeader>
                {s.review_notes && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Review note:</span> {s.review_notes}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">You haven&apos;t submitted anything yet.</p>
            <Button asChild>
              <Link href="/submit">Submit my record</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
