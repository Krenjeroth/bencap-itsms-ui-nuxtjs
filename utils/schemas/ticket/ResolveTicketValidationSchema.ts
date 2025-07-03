import { z } from "zod";

export const ResolveTicketValidationSchema = z.object({
  solution: z.object({ id: z.number() }),
});
