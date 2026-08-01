import { z } from "zod";

export const positionSchema = z.object({
  title: z.string().min(2, "Position title is required"),
  description: z.string().optional().or(z.literal("")),
});

export type PositionFormValues = z.infer<typeof positionSchema>;
