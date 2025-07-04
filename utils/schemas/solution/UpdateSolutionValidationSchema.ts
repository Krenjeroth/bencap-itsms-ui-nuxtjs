import { z } from "zod";

export const UpdateSolutionValidationSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  error_code: z.string().nullable().optional(),
  reference_url: z.string().nullable().optional(),
});
