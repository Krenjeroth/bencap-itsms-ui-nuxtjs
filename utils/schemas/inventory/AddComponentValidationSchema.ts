import { z } from "zod";

export const AddComponentValidationSchema = z.object({
  item_type: z.number(),
  // inventory: z
  //   .object({
  //     id: z.number(),
  //     property_number: z.string(),
  //   })
  //   .nullable()
  //   .optional(),
  brand_model: z.object({
    id: z.number(),
    name: z.string().nullable().optional(),
    specification: z.string(),
  }),

  serial_number: z.string(),
  parent_id: z.number(),
  property_number: z.string(),
});
