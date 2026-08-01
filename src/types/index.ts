import type { Database } from "./database.types";

export type Department = Database["public"]["Tables"]["departments"]["Row"];
export type Position = Database["public"]["Tables"]["positions"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Staff = Database["public"]["Tables"]["staff"]["Row"];
export type StaffSubmission =
  Database["public"]["Tables"]["staff_submissions"]["Row"];

export type StaffInsert = Database["public"]["Tables"]["staff"]["Insert"];
export type StaffUpdate = Database["public"]["Tables"]["staff"]["Update"];

export type DepartmentInsert =
  Database["public"]["Tables"]["departments"]["Insert"];
export type PositionInsert =
  Database["public"]["Tables"]["positions"]["Insert"];

export type { AppRole, EmploymentStatus, SubmissionStatus } from "./database.types";

/** Staff row with its department/position joined in. */
export type StaffWithRelations = Staff & {
  department: Pick<Department, "id" | "name"> | null;
  position: Pick<Position, "id" | "title"> | null;
};

/** Submission row with the submitter's profile joined in. */
export type SubmissionWithRelations = StaffSubmission & {
  submitted_by_profile: Pick<Profile, "id" | "full_name" | "email"> | null;
};
