import { z } from "zod";

export const UpdateTicketValidationSchema = z.object({
  employee: z
    .string({
      invalid_type_error: "Employee ID is required",
    })
    .min(2, "Employee ID must be at least 2 characters long"),
  item: z
    .string({
      invalid_type_error: "Item ID is required",
    })
    .min(2, "Item ID must be at least 2 characters long"),
  it_service: z
    .string({
      invalid_type_error: "IT Service ID is required",
    })
    .min(2, "IT Service ID must be at least 2 characters long"),
  concern: z
    .string({
      invalid_type_error: "Concern is required",
    })
    .min(2, "Concern must be at least 2 characters long"),
});
