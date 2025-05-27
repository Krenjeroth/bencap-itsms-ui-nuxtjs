import type { z } from "zod";

declare global {
  interface IRole {
    id: string;
    title: string;
    permissions: string[];
  }

  type TCreateRoleValidationSchema = z.output<
    typeof CreateRoleValidationSchema
  >;
  type TUpdateRoleValidationSchema = z.output<
    typeof UpdateRoleValidationSchema
  >;
}

export { IRole, TCreateRoleValidationSchema, TUpdateRoleValidationSchema };
