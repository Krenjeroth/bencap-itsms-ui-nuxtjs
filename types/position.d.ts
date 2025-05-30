import type { z } from "zod";

declare global {
  interface IPosition {
    id: string;
    name: string;
    abbreviation: string;
    salary_grade: string;
  }

  type TPositionSelectOption = {
    id: number | string;
    name: string;
    abbreviation: string;
    salary_grade: string;
  };

  type TCreatePositionValidationSchema = z.output<
    typeof CreatePositionValidationSchema
  >;
  type TUpdatePositionValidationSchema = z.output<
    typeof UpdatePositionValidationSchema
  >;
}

export {
  IPosition,
  TPositionSelectOption,
  TCreatePositionValidationSchema,
  TUpdatePositionValidationSchema,
};
