import { z } from "zod";

export const CreateTicketValidationSchema = z.object({
  employee: z.object({
    id: z.number(),
    full_name: z.string(),
  }),
  item: z.object({
    id: z.number(),
    property_number: z.string(),
  }),
  it_service: z.string(),
  concern: z
    .string({
      invalid_type_error: "Concern is required",
    })
    .min(2, "Concern must be at least 2 characters long"),
});
