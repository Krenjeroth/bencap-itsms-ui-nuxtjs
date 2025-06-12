import { z } from "zod";

export const UpdateCommonProblemValidationSchema = z.object({
  code: z
    .string({
      invalid_type_error: "Code is required",
    })
    .min(2, "Code must be at least 2 characters long"),
  general_term: z
    .string({
      invalid_type_error: "General term is required",
    })
    .min(2, "General term must be at least 2 characters long"),
  information: z
    .string({
      invalid_type_error: "Information is required",
    })
    .min(2, "Information must be at least 2 characters long"),
  item_type: z.number(),
});
