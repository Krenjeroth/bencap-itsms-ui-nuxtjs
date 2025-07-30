import { z } from "zod";

export const CreateItSupplyValidationSchema = z.object({
  measurement_unit: z.string(),
  brand_model: z.object({
    id: z.number(),
    name: z.string(),
    specification: z.string().nullable().optional(),
    brand: z.object({
      id: z.number(),
      name: z.string(),
      status: z.string().optional(),
    }),
    item_type: z.object({
      id: z.number(),
      type: z.string(),
      classification: z.string(),
      purpose: z.string(),
      status: z.string(),
    }),
    image: z.string().nullable().optional(),
    year_released: z.string().nullable().optional(),
    status: z.string().optional(),
  }),
  description: z.string().nullable().optional(),
  item_number: z.string().nullable().optional(),
  stock_number: z.string().nullable().optional(),
  quantity: z.number(),
});
