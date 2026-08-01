/**
 * These types mirror the SQL in `supabase/migrations`.
 *
 * Once you have a real Supabase project linked, regenerate this file with:
 *   npx supabase gen types typescript --linked > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "admin" | "staff";
export type EmploymentStatus =
  | "active"
  | "on_leave"
  | "suspended"
  | "retired"
  | "terminated";
export type SubmissionStatus = "draft" | "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["departments"]["Insert"]>;
      };
      positions: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["positions"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: AppRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: AppRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      staff: {
        Row: {
          id: string;
          profile_id: string | null;
          staff_id: string;
          first_name: string;
          last_name: string;
          other_names: string | null;
          email: string;
          phone: string | null;
          date_of_birth: string | null;
          gender: string | null;
          address: string | null;
          department_id: string | null;
          position_id: string | null;
          employment_status: EmploymentStatus;
          date_employed: string | null;
          photo_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          staff_id: string;
          first_name: string;
          last_name: string;
          other_names?: string | null;
          email: string;
          phone?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          address?: string | null;
          department_id?: string | null;
          position_id?: string | null;
          employment_status?: EmploymentStatus;
          date_employed?: string | null;
          photo_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["staff"]["Insert"]>;
      };
      staff_submissions: {
        Row: {
          id: string;
          staff_id: string | null;
          submitted_by: string;
          reviewed_by: string | null;
          status: SubmissionStatus;
          payload: Json;
          review_notes: string | null;
          submitted_at: string;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          staff_id?: string | null;
          submitted_by: string;
          reviewed_by?: string | null;
          status?: SubmissionStatus;
          payload: Json;
          review_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["staff_submissions"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      approve_staff_submission: {
        Args: {
          submission_id: string;
          reviewer_id: string;
          notes?: string | null;
        };
        Returns: Database["public"]["Tables"]["staff"]["Row"];
      };
    };
    Enums: {
      app_role: AppRole;
      employment_status: EmploymentStatus;
      submission_status: SubmissionStatus;
    };
  };
}
