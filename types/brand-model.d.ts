import type { z } from "zod";

declare global {
  interface IBrandModel {
    id: string;
    name: string;
    brand: string;
    image: string | null;
    year_released: string;
    status: string;
  }

  type TBrandModelSelectOption = {
    id: number | string;
    name: string;
  };

  type TCreateBrandModelValidationSchema = z.output<
    typeof CreateBrandModelValidationSchema
  >;
  type TUpdateBrandModelValidationSchema = z.output<
    typeof UpdateBrandModelValidationSchema
  >;
}

export {
  IBrandModel,
  TBrandModelSelectOption,
  TCreateBrandModelValidationSchema,
  TUpdateBrandModelValidationSchema,
};
