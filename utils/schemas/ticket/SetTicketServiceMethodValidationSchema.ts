import { z } from "zod";

export const SetTicketServiceMethodValidationSchema = z.object({
  service_method: z.enum(["on_site", "pulled_out"]).nullable().optional(),
});
