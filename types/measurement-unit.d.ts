import type { z } from "zod";

declare global {
  interface IMeasurementUnit {
    id: string;
    name: string;
    abbreviation: string;
    description: string | null;
  }

  type TMeasurementUnitSelectOption = {
    id: number | string;
    name: string;
    abbreviation: string;
    description: string | null;
  };

  type TCreateMeasurementUnitValidationSchema = z.output<
    typeof CreateMeasurementUnitValidationSchema
  >;
  type TUpdateMeasurementUnitValidationSchema = z.output<
    typeof UpdateMeasurementUnitValidationSchema
  >;
}

export {
  IMeasurementUnit,
  TMeasurementUnitSelectOption,
  TCreateMeasurementUnitValidationSchema,
  TUpdateMeasurementUnitValidationSchema,
};
