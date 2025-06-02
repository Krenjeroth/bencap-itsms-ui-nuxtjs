import type { z } from "zod";

declare global {
  interface IBrand {
    id: string;
    name: string;
  }

  type TBrandSelectOption = {
    id: number | string;
    name: string;
  };

  type TCreateBrandValidationSchema = z.output<
    typeof CreateBrandValidationSchema
  >;
  type TUpdateBrandValidationSchema = z.output<
    typeof UpdateBrandValidationSchema
  >;
}

export {
  IBrand,
  TBrandSelectOption,
  TCreateBrandValidationSchema,
  TUpdateBrandValidationSchema,
};
