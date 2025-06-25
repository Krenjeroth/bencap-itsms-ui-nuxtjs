import type { z } from "zod";

declare global {
  interface IUser {
    id: string;
    name: string;
    email: string;
    profile: any;
    permissions: string[];
    roles: string[];
  }

  type TCreateUserValidationSchema = z.output<
    typeof CreateUserValidationSchema
  >;
  type TUpdateUserValidationSchema = z.output<
    typeof UpdateUserValidationSchema
  >;
}

export { IUser, TCreateUserValidationSchema };
