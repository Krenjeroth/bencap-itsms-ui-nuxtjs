import { z } from "zod";

export const CreateItemValidationSchema = z.object({
  item_type: z.number(),
  brand_model: z.object({
    id: z.number(),
    name: z.string(),
    brand: z.object({
      id: z.number(),
      name: z.string(),
      status: z.string(),
      // created_at: z.string(),
      // updated_at: z.string(),
    }),
    image: z.string().nullable().optional(),
    year_released: z.string().nullable().optional(),
    status: z.string(),
    // created_at: z.string(),
    // updated_at: z.string(),
  }),
  parent_component: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  serial_number: z.string().nullable().optional(),
  property_number: z.string(),
  ics_number: z.string().nullable().optional(),
  date_acquired: z.date().nullable().optional(),
  ip_address: z.string().nullable().optional(),
  mac_address: z.string().nullable().optional(),
  inventory_type: z.string().nullable().optional(),
});
