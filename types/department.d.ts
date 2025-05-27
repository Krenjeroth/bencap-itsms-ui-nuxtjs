import type { z } from "zod";

declare global {
  interface IDepartment {
    id: string;
    name: string;
    full_name: string;
    division: string;
    abbreviation: string;
  }

  type TCreateDepartmentValidationSchema = z.output<
    typeof CreateDepartmentValidationSchema
  >;
  type TUpdateDepartmentValidationSchema = z.output<
    typeof UpdateDepartmentValidationSchema
  >;
}

export {
  IDepartment,
  TCreateDepartmentValidationSchema,
  TUpdateDepartmentValidationSchema,
};
