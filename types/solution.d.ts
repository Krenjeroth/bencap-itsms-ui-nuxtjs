import type { z } from "zod";

declare global {
  interface ISolution {
    id: string;
    description: string;
    author_id: string;
    item_type_id: string;
    created_at: string;
    updated_at: string;
  }

  // type TCreateTicketValidationSchema = z.output<
  //   typeof CreateTicketValidationSchema
  // >;
  // type TUpdateTicketValidationSchema = z.output<
  //   typeof UpdateTicketValidationSchema
  // >;
  // type TResolveTicketValidationSchema = z.output<
  //   typeof ResolveTicketValidationSchema
  // >;
  // type TSetTicketServiceMethodValidationSchema = z.output<
  //   typeof SetTicketServiceMethodValidationSchema
  // >;
  // type TSetTicketReleaseDateValidationSchema = z.output<
  //   typeof SetTicketReleaseDateValidationSchema
  // >;
}

export {
  ISolution,
  // TCreateTicketValidationSchema,
  // TUpdateTicketValidationSchema,
  // TResolveTicketValidationSchema,
  // TSetTicketServiceMethodValidationSchema,
  // TSetTicketReleaseDateValidationSchema,
};
