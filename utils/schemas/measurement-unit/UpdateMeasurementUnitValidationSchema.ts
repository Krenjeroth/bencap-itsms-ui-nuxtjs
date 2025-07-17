import { z } from "zod";

export const UpdateMeasurementUnitValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Measurement unit name must be at least 2 characters long"),
  abbreviation: z
    .string()
    .min(2, "Measurement unit abbreviation must be at least 2 characters long"),
  description: z.string().optional(),
});
