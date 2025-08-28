import { z } from "zod";

export const CreateRoleValidationSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Title is required",
    })
    .min(3, "Title must be at least 3 characters long"),
  permission_ids: z
    .array(z.number())
    .min(1, "At least one permission is required"),
});
