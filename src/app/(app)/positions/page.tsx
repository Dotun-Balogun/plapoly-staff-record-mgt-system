"use client";

import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EntityFormDialog } from "@/components/shared/entity-form-dialog";
import {
  useCreatePosition,
  useDeletePosition,
  usePositions,
  useUpdatePosition,
} from "@/hooks/use-positions";
import { positionSchema, type PositionFormValues } from "@/schemas/position.schema";
import type { Position } from "@/types";

export default function PositionsPage() {
  const { data: positions, isLoading } = usePositions();
  const createPosition = useCreatePosition();
  const deletePosition = useDeletePosition();
  const [editing, setEditing] = useState<Position | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const updatePosition = useUpdatePosition(editing?.id ?? "");

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(pos: Position) {
    setEditing(pos);
    setDialogOpen(true);
  }

  async function handleSubmit(values: PositionFormValues) {
    try {
      if (editing) {
        await updatePosition.mutateAsync(values);
        toast.success("Position updated");
      } else {
        await createPosition.mutateAsync(values);
        toast.success("Position created");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <>
      <PageHeader
        title="Positions"
        description="Manage job titles and ranks assignable to staff records."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add Position
          </Button>
        }
      />

      <div className="rounded-lg border bg-background">
        {isLoading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions && positions.length > 0 ? (
                positions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {p.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(p)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={async () => {
                              if (!confirm(`Delete ${p.title}?`)) return;
                              try {
                                await deletePosition.mutateAsync(p.id);
                                toast.success("Position deleted");
                              } catch {
                                toast.error("Could not delete — it may still be in use.");
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No positions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <EntityFormDialog<PositionFormValues>
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? "Edit Position" : "Add Position"}
        schema={positionSchema}
        fields={[
          { name: "title", label: "Title", placeholder: "Lecturer I" },
          { name: "description", label: "Description", placeholder: "Optional description" },
        ]}
        defaultValues={{
          title: editing?.title ?? "",
          description: editing?.description ?? "",
        }}
        onSubmit={handleSubmit}
        isSubmitting={createPosition.isPending || updatePosition.isPending}
      />
    </>
  );
}
