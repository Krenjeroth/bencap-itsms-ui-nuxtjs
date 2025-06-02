import { z } from "zod";

export const CreateBrandValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Brand name is required",
    })
    .min(2, "Brand name must be at least 2 characters long"),
});
