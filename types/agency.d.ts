import type { z } from "zod";

declare global {
  interface IAgency {
    id: string;
    name: string;
    abbreviation: string;
  }

  type TAgencySelectOption = {
    id: number | string;
    name: string;
    abbreviation: string;
  };

  type TCreateAgencyValidationSchema = z.output<
    typeof CreateAgencyValidationSchema
  >;
  type TUpdateAgencyValidationSchema = z.output<
    typeof UpdateAgencyValidationSchema
  >;
}

export {
  IAgency,
  TAgencySelectOption,
  TCreateAgencyValidationSchema,
  TUpdateAgencyValidationSchema,
};
