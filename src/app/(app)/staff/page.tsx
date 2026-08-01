"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useStaffList, useDeleteStaff } from "@/hooks/use-staff";
import { useDepartments } from "@/hooks/use-departments";
import {
  EMPLOYMENT_STATUS_BADGE_VARIANT,
  EMPLOYMENT_STATUS_LABELS,
} from "@/constants";
import type { StaffWithRelations } from "@/types";

export default function StaffListPage() {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("all");

  const { data: staff, isLoading } = useStaffList({
    search: search || undefined,
    departmentId: departmentId !== "all" ? departmentId : undefined,
  });
  const { data: departments } = useDepartments();
  const deleteStaff = useDeleteStaff();

  const columns = useMemo<ColumnDef<StaffWithRelations>[]>(
    () => [
      {
        header: "Staff ID",
        accessorKey: "staff_id",
      },
      {
        header: "Name",
        cell: ({ row }) => (
          <Link href={`/staff/${row.original.id}`} className="font-medium hover:underline">
            {row.original.first_name} {row.original.last_name}
          </Link>
        ),
      },
      {
        header: "Department",
        cell: ({ row }) => row.original.department?.name ?? "—",
      },
      {
        header: "Position",
        cell: ({ row }) => row.original.position?.title ?? "—",
      },
      {
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={EMPLOYMENT_STATUS_BADGE_VARIANT[row.original.employment_status]}>
            {EMPLOYMENT_STATUS_LABELS[row.original.employment_status]}
          </Badge>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/staff/${row.original.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/staff/${row.original.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={async () => {
                  if (!confirm(`Delete ${row.original.first_name} ${row.original.last_name}?`)) return;
                  try {
                    await deleteStaff.mutateAsync(row.original.id);
                    toast.success("Staff record deleted");
                  } catch {
                    toast.error("Could not delete staff record");
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [deleteStaff]
  );

  const table = useReactTable({
    data: staff ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title="Staff Records"
        description="Search, filter, and manage all staff records."
        actions={
          <Button asChild>
            <Link href="/staff/new">
              <Plus className="size-4" /> Add Staff
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, staff ID, or email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={departmentId} onValueChange={setDepartmentId}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="All departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments?.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-background">
        {isLoading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No staff records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
