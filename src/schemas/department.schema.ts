import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  code: z.string().max(10, "Keep the code short (max 10 chars)").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
