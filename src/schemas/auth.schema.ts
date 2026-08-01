import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signUpSchema = loginSchema.extend({
  full_name: z.string().min(2, "Full name is required"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
