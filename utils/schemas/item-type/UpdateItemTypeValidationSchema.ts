import { z } from "zod";

export const UpdateItemTypeValidationSchema = z.object({
  type: z
    .string({
      invalid_type_error: "Type is required",
    })
    .min(2, "Type must be at least 2 characters long"),
  classification: z
    .string({
      invalid_type_error: "Classification is required",
    })
    .min(2, "Classification must be at least 2 characters long"),
  purpose: z
    .string({
      invalid_type_error: "Purpose is required",
    })
    .min(2, "Purpose must be at least 2 characters long"),
  is_main_inventory: z.boolean(),
  is_component: z.boolean(),
});
