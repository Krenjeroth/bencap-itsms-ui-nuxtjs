import type { z } from "zod";

declare global {
  interface IPermission {
    id: string;
    title: string;
  }

  type TCreatePermissionValidationSchema = z.output<
    typeof CreatePermissionValidationSchema
  >;
  type TUpdatePermissionValidationSchema = z.output<
    typeof UpdatePermissionValidationSchema
  >;
}

export {
  IPermission,
  TCreatePermissionValidationSchema,
  TUpdatePermissionValidationSchema,
};
