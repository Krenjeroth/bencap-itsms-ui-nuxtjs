import type { z } from "zod";

declare global {
  interface IEmployee {
    id: string;
    uid: string | null;
    firstname: string;
    middlename: string;
    lastname: string;
    suffix: string | null;
    full_name: string;
    img_path: string;
  }

  type TCreateEmployeeValidationSchema = z.output<
    typeof CreateEmployeeValidationSchema
  >;
  type TUpdateEmployeeValidationSchema = z.output<
    typeof UpdateEmployeeValidationSchema
  >;
}

export {
  IEmployee,
  TCreateEmployeeValidationSchema,
  TUpdateEmployeeValidationSchema,
};
