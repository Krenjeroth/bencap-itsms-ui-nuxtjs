import type { z } from "zod";

declare global {
  interface ICommonProblem {
    id: string;
    code: string;
    general_term: string;
    information: string;
    item_type: string;
  }

  type TCreateCommonProblemValidationSchema = z.output<
    typeof CreateCommonProblemValidationSchema
  >;
  type TUpdateCommonProblemValidationSchema = z.output<
    typeof UpdateCommonProblemValidationSchema
  >;
}

export {
  ICommonProblem,
  TCreateCommonProblemValidationSchema,
  TUpdateCommonProblemValidationSchema,
};
