import { z } from "zod";

const currentYear = new Date().getFullYear();

export const CreateBrandModelValidationSchema = z.object({
  name: z.string().nullable().optional(),
  // name: z
  //   .string({
  //     invalid_type_error: "Brand model name is required",
  //   })
  //   .min(2, "Brand model name must be at least 2 characters long"),
  specification: z
    .string({
      invalid_type_error: "Brand model specification is required",
    })
    .min(2, "Brand model specification must be at least 2 characters long"),
  item_type: z.number(),
  brand: z.number(),
  // image: z
  //   .string({
  //     invalid_type_error: "Image is required",
  //   })
  //   .min(2, "Image must be at least 2 characters long"),
  // year_released: z
  //   .string({
  //     invalid_type_error: "Year released is required",
  //   })
  //   .regex(/^\d{4}$/, "Year must be a 4-digit number")
  //   .refine(
  //     (val) => {
  //       const year = parseInt(val);
  //       return year >= 1900 && year <= currentYear;
  //     },
  //     {
  //       message: `Year must be between 1900 and ${currentYear}`,
  //     }
  //   )
  //   .nullable()
  //   .optional(),
});
