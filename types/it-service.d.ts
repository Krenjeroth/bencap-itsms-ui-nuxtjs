import type { z } from "zod";

declare global {
  interface IItService {
    id: string;
    name: string;
    description: string;
    code: string;
  }

  type TItServiceSelectOption = {
    id: number | string;
    name: string;
  };

  type TCreateItServiceValidationSchema = z.output<
    typeof CreateItServiceValidationSchema
  >;
  type TUpdateItServiceValidationSchema = z.output<
    typeof UpdateItServiceValidationSchema
  >;
}

export {
  IItService,
  TCreateItServiceValidationSchema,
  TUpdateItServiceValidationSchema,
  TItServiceSelectOption,
};
