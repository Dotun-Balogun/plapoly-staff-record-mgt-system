import { z } from "zod";

export const employmentStatusEnum = z.enum([
  "active",
  "on_leave",
  "suspended",
  "retired",
  "terminated",
]);

export const staffSchema = z.object({
  staff_id: z.string().min(2, "Staff ID is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  other_names: z.string().optional().or(z.literal("")),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  department_id: z.string().uuid().optional().or(z.literal("")),
  position_id: z.string().uuid().optional().or(z.literal("")),
  employment_status: employmentStatusEnum,
  date_employed: z.string().optional().or(z.literal("")),
  photo_url: z.string().optional().or(z.literal("")),
});

export type StaffFormValues = z.infer<typeof staffSchema>;

/** Subset of fields a staff member is allowed to self-edit. */
export const staffSelfEditSchema = staffSchema.pick({
  phone: true,
  address: true,
  other_names: true,
});

export type StaffSelfEditValues = z.infer<typeof staffSelfEditSchema>;