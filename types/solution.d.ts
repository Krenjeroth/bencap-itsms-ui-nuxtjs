import type { z } from "zod";

declare global {
  interface ISolution {
    id: string;
    title: string;
    description: string;
    error_code: string;
    reference_url: string;
    author_id: string;
    created_at: string;
    updated_at: string;
  }

  type TCreateSolutionValidationSchema = z.output<
    typeof CreateSolutionValidationSchema
  >;
  type TUpdateSolutionValidationSchema = z.output<
    typeof UpdateSolutionValidationSchema
  >;
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
  TCreateSolutionValidationSchema,
  TUpdateSolutionValidationSchema,
};
