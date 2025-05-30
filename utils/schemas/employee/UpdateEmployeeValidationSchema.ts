import { z } from "zod";

export const UpdateEmployeeValidationSchema = z.object({
  uid: z
    .string({
      invalid_type_error: "UID is required",
    })
    .min(3, "UID must be at least 3 characters long"),
  firstname: z
    .string({
      invalid_type_error: "First name is required",
    })
    .min(3, "First name must be at least 3 characters long"),
  middlename: z
    .string({
      invalid_type_error: "Middle name is required",
    })
    .regex(/^[A-Za-z]$/, "Middle Initial must be a single alphabet letter"),
  lastname: z
    .string({
      invalid_type_error: "Last name is required",
    })
    .min(3, "Last name must be at least 3 characters long"),
  suffix: z
    .string({
      invalid_type_error: "Suffix is required",
    })
    .min(3, "Suffix must be at least 3 characters long"),
});
