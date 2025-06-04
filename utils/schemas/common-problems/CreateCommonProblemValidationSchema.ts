import { z } from "zod";

export const CreateCommonProblemValidationSchema = z.object({
  code: z
    .string({
      invalid_type_error: "Model code is required",
    })
    .regex(
      /^(NE|E)\d{3,4}[A-Z]?$/,
      "Model code must match pattern like E0000, NE00E, NE000"
    ),
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
