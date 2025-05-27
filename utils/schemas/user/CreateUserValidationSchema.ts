import { z } from "zod";

export const CreateUserValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters long"),
  email: z
    .string({
      invalid_type_error: "Email is required",
    })
    .email("Email is not valid"),
  password: z
    .string({
      invalid_type_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters long"),
});
//   .refine((data) => data.password === data.password_confirmation, {
//   message: "Passwords do not match",
//   path: ["password_confirmation"],
// });
