import { z } from "zod";

export const CreateTicketValidationSchema = z.object({
  profile_id: z
    .string({
      invalid_type_error: "Profile ID is required",
    })
    .min(3, "Profile ID must be at least 3 characters long"),
  employee_id: z
    .string({
      invalid_type_error: "Employee ID is required",
    })
    .min(2, "Employee ID must be at least 2 characters long"),
  item_id: z
    .string({
      invalid_type_error: "Item ID is required",
    })
    .min(2, "Item ID must be at least 2 characters long"),
  it_service_id: z
    .string({
      invalid_type_error: "IT Service ID is required",
    })
    .min(2, "IT Service ID must be at least 2 characters long"),
});
