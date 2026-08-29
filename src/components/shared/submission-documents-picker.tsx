"use client";

import { useState } from "react";
import { FileText, Plus, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const DOCUMENT_TYPES = [
  "CV / Resume",
  "Certificate",
  "ID Card",
  "Appointment Letter",
  "Other",
];

export type PendingDocument = { file: File; documentType: string };

export function SubmissionDocumentsPicker({
  files,
  onChange,
  isUploading,
}: {
  files: PendingDocument[];
  onChange: (files: PendingDocument[]) => void;
  isUploading?: boolean;
}) {
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB");
      return;
    }
    onChange([...files, { file, documentType }]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Documents</CardTitle>
        <CardDescription>
          Attach certificates, ID, or other files. They&apos;ll be uploaded when you submit.
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

          <label
            className={cn(
              buttonVariants({ variant: "outline" }),
              "cursor-pointer",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            <Plus className="size-4" /> Add file
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </label>
        </div>

        {files.length > 0 && (
          <ul className="divide-y rounded-md border">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-3 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="size-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{f.file.name}</p>
                    <p className="text-xs text-muted-foreground">{f.documentType}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isUploading}
                  onClick={() => removeFile(i)}
                >
                  <X className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}