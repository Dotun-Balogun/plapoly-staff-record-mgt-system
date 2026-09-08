"use client";

import { useRef, useState } from "react";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocumentDownloadUrl } from "@/services/documents.service";
import {
  useDeleteStaffDocument,
  useStaffDocuments,
  useUploadStaffDocument,
} from "@/hooks/use-staff-documents";
import { useCurrentUser } from "@/hooks/use-current-user";

const DOCUMENT_TYPES = [
  "CV / Resume",
  "Certificate",
  "ID Card",
  "Appointment Letter",
  "Other",
];

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export function StaffDocuments({ staffId }: { staffId: string }) {
  const { profile } = useCurrentUser();
  const { data: documents, isLoading } = useStaffDocuments(staffId);
  const upload = useUploadStaffDocument(staffId);
  const remove = useDeleteStaffDocument(staffId);

  const inputRef = useRef<HTMLInputElement>(null);
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }

    try {
      await upload.mutateAsync({ file, documentType, uploadedBy: profile.id });
      toast.success("Document uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload document");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDownload(filePath: string, fileName: string) {
    try {
      const url = await getDocumentDownloadUrl(filePath);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      link.click();
    } catch {
      toast.error("Could not generate download link");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Documents</CardTitle>
        <CardDescription>
          Certificates, ID, and other files attached to this staff record.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button
            type="button"
            variant="outline"
            disabled={upload.isPending}
            onClick={() => inputRef.current?.click()}
          >
            {upload.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Upload document
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : documents && documents.length > 0 ? (
          <ul className="divide-y rounded-md border">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="size-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.document_type} · {formatBytes(doc.file_size)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc.file_path, doc.file_name)}
                  >
                    <Download className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      if (!confirm(`Delete ${doc.file_name}?`)) return;
                      try {
                        await remove.mutateAsync(doc);
                        toast.success("Document deleted");
                      } catch {
                        toast.error("Could not delete document");
                      }
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No documents uploaded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}