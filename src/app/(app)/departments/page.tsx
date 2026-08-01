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
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
} from "@/hooks/use-departments";
import { departmentSchema, type DepartmentFormValues } from "@/schemas/department.schema";
import type { Department } from "@/types";

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const createDepartment = useCreateDepartment();
  const deleteDepartment = useDeleteDepartment();
  const [editing, setEditing] = useState<Department | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const updateDepartment = useUpdateDepartment(editing?.id ?? "");

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(dept: Department) {
    setEditing(dept);
    setDialogOpen(true);
  }

  async function handleSubmit(values: DepartmentFormValues) {
    try {
      if (editing) {
        await updateDepartment.mutateAsync(values);
        toast.success("Department updated");
      } else {
        await createDepartment.mutateAsync(values);
        toast.success("Department created");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <>
      <PageHeader
        title="Departments"
        description="Manage the academic and administrative departments used across staff records."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add Department
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
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments && departments.length > 0 ? (
                departments.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>{d.code ?? "—"}</TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {d.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(d)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={async () => {
                              if (!confirm(`Delete ${d.name}?`)) return;
                              try {
                                await deleteDepartment.mutateAsync(d.id);
                                toast.success("Department deleted");
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
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No departments yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <EntityFormDialog<DepartmentFormValues>
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? "Edit Department" : "Add Department"}
        schema={departmentSchema}
        fields={[
          { name: "name", label: "Name", placeholder: "Computer Science" },
          { name: "code", label: "Code", placeholder: "CSC" },
          { name: "description", label: "Description", placeholder: "Optional description" },
        ]}
        defaultValues={{
          name: editing?.name ?? "",
          code: editing?.code ?? "",
          description: editing?.description ?? "",
        }}
        onSubmit={handleSubmit}
        isSubmitting={createDepartment.isPending || updateDepartment.isPending}
      />
    </>
  );
}
