import { z } from "zod";

export const UpdateDepartmentValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters long"),
  full_name: z
    .string({
      invalid_type_error: "Full name is required",
    })
    .min(3, "Full name must be at least 3 characters long"),
  division: z
    .string({
      invalid_type_error: "Division is required",
    })
    .min(3, "Division must be at least 3 characters long"),
  abbreviation: z
    .string({
      invalid_type_error: "Abbreviation is required",
    })
    .min(3, "Abbreviation must be at least 3 characters long"),
});
