import { z } from "zod";

export const AddComponentValidationSchema = z.object({
  item_type: z
    .number({
      required_error: "Item type is required.",
      invalid_type_error: "Item type is required.",
    })
    .int()
    .positive("Item type is required."),
  brand_model: z.object({
    id: z.number(),
    name: z.string().nullable().optional(),
    specification: z.string(),
  }),

  serial_number: z.string().nullable().optional(),
  date_acquired: z.date().nullable().optional(),
  parent_id: z.number(),
  property_number: z.string(),
});
