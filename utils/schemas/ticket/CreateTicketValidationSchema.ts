import { z } from "zod";

export const CreateTicketValidationSchema = z
  .object({
    inventory: z
      .object({
        id: z.number(),
        property_number: z.string(),
      })
      .nullable()
      .optional(),

    office: z
      .object({
        id: z.number(),
        office_code: z.string().nullable().optional(),
        office_desc: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),

    item_type: z.number(),

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
        },
      )
      .nullable()
      .optional(),

    is_other_agency: z.boolean(),

    full_name: z.string().nullish(),

    client_name: z.string().optional().nullable(),

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
      if (!data.client_name || data.client_name.trim() === "") {
        ctx.addIssue({
          path: ["client_name"],
          code: z.ZodIssueCode.custom,
          message: 'Client name is required when "Other Agency" is selected',
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

      return;
    }

    if (!data.inventory && !data.office) {
      ctx.addIssue({
        path: ["office"],
        code: z.ZodIssueCode.custom,
        message: "Office is required when no inventory is selected",
      });
    }
  });
