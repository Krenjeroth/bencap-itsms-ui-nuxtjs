import { z } from "zod";

export const ResolveTicketValidationSchema = z.object({
  // service_method: z.enum(["on_site", "pulled_out"]).nullable().optional(),
  // item_type: z.string().nullable().optional(),
  solution: z.union(
    [z.number(), z.string()],
    z.object({
      id: z.number(),
      description: z.string(),
    })
  ),
});
