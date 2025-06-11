import { z } from "zod";

export const CreateItServiceValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters long"),
  description: z
    .string({
      invalid_type_error: "Description is required",
    })
    .min(2, "Description must be at least 2 characters long"),
  code: z
    .string({
      invalid_type_error: "Code is required",
    })
    .min(2, "Code must be at least 2 characters long")
    .max(4, "Code must be at most 4 characters long"),
});
