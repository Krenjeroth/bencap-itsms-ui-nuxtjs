import { z } from "zod";

export const UpdateAgencyValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Agency name is required",
    })
    .min(2, "Agency name must be at least 2 characters long"),
  abbreviation: z
    .string({
      invalid_type_error: "Agency abbreviation is required",
    })
    .min(2, "Agency abbreviation must be at least 2 characters long")
    .optional(),
});
