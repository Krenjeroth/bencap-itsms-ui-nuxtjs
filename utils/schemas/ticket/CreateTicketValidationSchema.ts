import { z } from "zod";

export const CreateTicketValidationSchema = z
  .object({
    // employee: z.object({
    //   id: z.number(),
    //   full_name: z.string(),
    // }),
    item: z
      .object({
        id: z.number(),
        property_number: z.string(),
      })
      .nullable()
      .optional(),
    item_type: z.number().optional(),
    it_service: z.string(),
    concern: z
      .string({
        invalid_type_error: "Concern is required",
      })
      .min(2, "Concern must be at least 2 characters long"),
    priority: z.string(),
    contact_number: z
      .string()
      .refine(
        (p) => {
          const mobilePattern = /^(09\d{9}|\+639\d{9})$/;
          return mobilePattern.test(p);
        },
        {
          message: "Invalid Phone number format",
        }
      )
      .nullable()
      .optional(),
    is_other_agency: z.boolean(),
    full_name: z.string().optional(),
    agency: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.is_other_agency) {
      if (!data.full_name || data.full_name.trim() === "") {
        ctx.addIssue({
          path: ["full_name"],
          code: z.ZodIssueCode.custom,
          message: 'Full name is required when "Other Agency" is selected',
        });
      }
      if (!data.agency || data.agency.id === null) {
        ctx.addIssue({
          path: ["agency"],
          code: z.ZodIssueCode.custom,
          message: 'Agency is required when "Other Agency" is selected',
        });
      }
      if (!data.item_type || data.item_type === null) {
        ctx.addIssue({
          path: ["item_type"],
          code: z.ZodIssueCode.custom,
          message: 'Item type is required when "Other Agency" is selected',
        });
      }
    }
  });
