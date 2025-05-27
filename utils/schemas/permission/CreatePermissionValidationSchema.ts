import { z } from "zod";

export const CreatePermissionValidationSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Title is required",
    })
    .min(3, "Title must be at least 3 characters long"),
});
