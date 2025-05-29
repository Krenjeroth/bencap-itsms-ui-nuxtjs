import { z } from "zod";

export const UpdatePositionValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters long"),
  abbreviation: z
    .string({
      invalid_type_error: "Abbreviation is required",
    })
    .regex(/^[A-Za-z]+$/, "Abbreviation must contain only letters"),
  salary_grade: z
    .string({
      invalid_type_error: "Salary grade is required",
    })
    .regex(
      /^([1-9]|[1-9][0-9])$/,
      "Salary grade must be a number from 1 to 99 with no leading zeros"
    ),
});
