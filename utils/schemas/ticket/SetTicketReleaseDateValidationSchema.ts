import { z } from "zod";

export const SetTicketReleaseDateValidationSchema = z.object({
  released_at: z.date().nullable().optional(),
});
